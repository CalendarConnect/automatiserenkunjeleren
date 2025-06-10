import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Helper function to extract user IDs from mention text
function extractMentions(content: string, allUsers: any[]): Id<"users">[] {
  const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
  const mentions: Id<"users">[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    const mentionedName = match[1].trim();
    const user = allUsers.find(u => 
      u.naam.toLowerCase() === mentionedName.toLowerCase()
    );
    if (user) {
      mentions.push(user._id);
    }
  }

  return [...new Set(mentions)]; // Remove duplicates
}

export const postComment = mutation({
  args: {
    threadId: v.id("threads"),
    auteurId: v.id("users"),
    inhoud: v.string(),
    mentions: v.optional(v.array(v.id("users"))), // Array of mentioned user IDs
  },
  handler: async (ctx, args) => {
    // If no mentions provided, try to extract from content
    let mentions = args.mentions || [];
    
    if (!args.mentions && args.inhoud.includes('@')) {
      const allUsers = await ctx.db.query("users").collect();
      mentions = extractMentions(args.inhoud, allUsers);
    }

    return await ctx.db.insert("comments", {
      threadId: args.threadId,
      auteurId: args.auteurId,
      inhoud: args.inhoud,
      likes: [],
      mentions: mentions.length > 0 ? mentions : undefined,
      aangemaaktOp: Date.now(),
    });
  },
});

export const getCommentsByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .order("asc")
      .collect();

    // Get author info and mentioned users for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.auteurId);
        
        // Get mentioned users if any
        let mentionedUsers: any[] = [];
        if (comment.mentions && comment.mentions.length > 0) {
          mentionedUsers = await Promise.all(
            comment.mentions.map(async (userId: any) => {
              return await ctx.db.get(userId);
            })
          );
        }

        return {
          ...comment,
          author,
          mentionedUsers: mentionedUsers.filter(Boolean), // Filter out any null results
        };
      })
    );

    return commentsWithAuthors;
  },
});

export const likeComment = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Reactie niet gevonden");

    const hasLiked = comment.likes.includes(args.userId);
    
    let updatedLikes;
    if (hasLiked) {
      // Remove like
      updatedLikes = comment.likes.filter((id: any) => id !== args.userId);
    } else {
      // Add like
      updatedLikes = [...comment.likes, args.userId];
    }

    await ctx.db.patch(args.commentId, { likes: updatedLikes });
    return !hasLiked; // Return new like state
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Reactie niet gevonden");
    
    // Only allow deletion by author
    if (comment.auteurId !== args.userId) {
      throw new Error("Geen toestemming om deze reactie te verwijderen");
    }

    await ctx.db.delete(args.commentId);
  },
});

export const getCommentsByAuthor = query({
  args: { auteurId: v.id("users") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("auteurId"), args.auteurId))
      .order("desc")
      .collect();

    // Join met thread data
    const commentsWithData = await Promise.all(
      comments.map(async (comment) => {
        const auteur = await ctx.db.get(comment.auteurId);
        const thread = await ctx.db.get(comment.threadId);
        
        return {
          ...comment,
          auteur,
          thread,
        };
      })
    );

    return commentsWithData;
  },
}); 