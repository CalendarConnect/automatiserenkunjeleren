import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const postComment = mutation({
  args: {
    threadId: v.id("threads"),
    auteurId: v.id("users"),
    inhoud: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      ...args,
      likes: [],
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

    // Get author info for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.auteurId);
        return {
          ...comment,
          author,
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