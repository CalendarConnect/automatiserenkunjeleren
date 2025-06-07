import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateSlug } from "./lib/utils";

export const createThread = mutation({
  args: {
    kanaalId: v.id("channels"),
    titel: v.string(),
    inhoud: v.optional(v.string()),
    auteurId: v.id("users"),
    afbeelding: v.optional(v.string()),
    type: v.optional(v.union(v.literal("text"), v.literal("poll"))),
    // Poll specific fields
    pollVraag: v.optional(v.string()),
    pollOpties: v.optional(v.array(v.string())),
    multipleChoice: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Generate slug from title
    const slug = generateSlug(args.titel);
    
    // Get next thread number
    const allThreads = await ctx.db.query("threads").collect();
    const threadNumber = allThreads.length + 1;
    
    const threadId = await ctx.db.insert("threads", {
      kanaalId: args.kanaalId,
      titel: args.titel,
      slug: slug,
      threadNumber: threadNumber,
      inhoud: args.inhoud,
      auteurId: args.auteurId,
      afbeelding: args.afbeelding,
      type: args.type || "text",
      upvotes: [],
      sticky: false,
      aangemaaktOp: Date.now(),
    });

    // If it's a poll, create the poll record
    if (args.type === "poll" && args.pollVraag && args.pollOpties) {
      await ctx.db.insert("polls", {
        threadId,
        vraag: args.pollVraag,
        opties: args.pollOpties,
        multipleChoice: args.multipleChoice || false,
        aangemaaktOp: Date.now(),
      });
    }

    // Return the thread data needed for URL generation
    return {
      threadId,
      slug,
      threadNumber,
    };
  },
});

export const getThreadsByChannel = query({
  args: { kanaalId: v.id("channels") },
  handler: async (ctx, args) => {
    const threads = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("kanaalId"), args.kanaalId))
      .order("desc")
      .collect();

    // Get author info for each thread
    const threadsWithAuthors = await Promise.all(
      threads.map(async (thread) => {
        const author = await ctx.db.get(thread.auteurId);
        const channel = await ctx.db.get(thread.kanaalId);
        return {
          ...thread,
          author,
          channel,
        };
      })
    );

    return threadsWithAuthors;
  },
});

export const getThreadById = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) return null;

    const author = await ctx.db.get(thread.auteurId);
    const channel = await ctx.db.get(thread.kanaalId);
    
    return {
      ...thread,
      author,
      channel,
    };
  },
});

export const getThreadBySlugAndNumber = query({
  args: { 
    slug: v.string(),
    threadNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("threads")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("threadNumber"), args.threadNumber))
      .first();
    
    if (!thread) return null;

    const author = await ctx.db.get(thread.auteurId);
    const channel = await ctx.db.get(thread.kanaalId);
    
    return {
      ...thread,
      author,
      channel,
    };
  },
});

export const upvoteThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) throw new Error("Thread niet gevonden");

    const hasUpvoted = thread.upvotes.includes(args.userId);
    
    let updatedUpvotes;
    if (hasUpvoted) {
      // Remove upvote
      updatedUpvotes = thread.upvotes.filter((id: any) => id !== args.userId);
    } else {
      // Add upvote
      updatedUpvotes = [...thread.upvotes, args.userId];
    }

    await ctx.db.patch(args.threadId, { upvotes: updatedUpvotes });
    return !hasUpvoted; // Return new upvote state
  },
});

export const markAsSticky = mutation({
  args: {
    threadId: v.id("threads"),
    sticky: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, { sticky: args.sticky });
    
    // If marking as sticky, also add to channel's sticky posts
    if (args.sticky) {
      const thread = await ctx.db.get(args.threadId);
      if (thread) {
        const channel = await ctx.db.get(thread.kanaalId);
        if (channel && !channel.stickyPosts.includes(args.threadId)) {
          const updatedStickies = [...channel.stickyPosts, args.threadId];
          await ctx.db.patch(thread.kanaalId, { stickyPosts: updatedStickies });
        }
      }
    }
  },
});

export const searchThreads = query({
  args: { 
    searchTerm: v.string(),
    kanaalId: v.optional(v.id("channels")),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("threads")
      .withSearchIndex("search_threads", (q) => {
        const searchQuery = q.search("titel", args.searchTerm);
        return args.kanaalId ? searchQuery.eq("kanaalId", args.kanaalId) : searchQuery;
      })
      .take(20);

    // Get author info for each result
    const threadsWithAuthors = await Promise.all(
      results.map(async (thread) => {
        const author = await ctx.db.get(thread.auteurId);
        const channel = await ctx.db.get(thread.kanaalId);
        return {
          ...thread,
          author,
          channel,
        };
      })
    );

    return threadsWithAuthors;
  },
});

export const getAllThreads = query({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db
      .query("threads")
      .order("desc")
      .collect();

    // Join met users en channels
    const threadsWithData = await Promise.all(
      threads.map(async (thread) => {
        const auteur = await ctx.db.get(thread.auteurId);
        const kanaal = thread.kanaalId ? await ctx.db.get(thread.kanaalId) : null;
        
        return {
          ...thread,
          auteur,
          kanaal,
        };
      })
    );

    return threadsWithData;
  },
});

export const toggleStickyThread = mutation({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread niet gevonden");
    }

    await ctx.db.patch(args.threadId, {
      sticky: !thread.sticky,
    });

    return args.threadId;
  },
});

export const deleteThread = mutation({
  args: { 
    threadId: v.id("threads"),
    userId: v.id("users")
  },
  handler: async (ctx, args) => {
    // Get the user to check if they're admin
    const user = await ctx.db.get(args.userId);
    if (!user || user.role !== "admin") {
      throw new Error("Alleen admins kunnen threads verwijderen");
    }

    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread niet gevonden");
    }

    // Delete related poll if it exists
    if (thread.type === "poll") {
      const poll = await ctx.db
        .query("polls")
        .filter((q) => q.eq(q.field("threadId"), args.threadId))
        .first();
      
      if (poll) {
        await ctx.db.delete(poll._id);
      }
    }

    // Delete all comments for this thread
    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Remove from channel's sticky posts if it was sticky
    if (thread.sticky) {
      const channel = await ctx.db.get(thread.kanaalId);
      if (channel && channel.stickyPosts.includes(args.threadId)) {
        const updatedStickies = channel.stickyPosts.filter((id: any) => id !== args.threadId);
        await ctx.db.patch(thread.kanaalId, { stickyPosts: updatedStickies });
      }
    }

    // Finally delete the thread
    await ctx.db.delete(args.threadId);

    return args.threadId;
  },
});

export const getThreadsByAuthor = query({
  args: { auteurId: v.id("users") },
  handler: async (ctx, args) => {
    const threads = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("auteurId"), args.auteurId))
      .order("desc")
      .collect();

    // Join met auteur en kanaal data
    const threadsWithData = await Promise.all(
      threads.map(async (thread) => {
        const auteur = await ctx.db.get(thread.auteurId);
        const kanaal = thread.kanaalId ? await ctx.db.get(thread.kanaalId) : null;
        
        return {
          ...thread,
          auteur,
          kanaal,
        };
      })
    );

    return threadsWithData;
  },
});

// Poll-related queries and mutations
export const getPollByThreadId = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const poll = await ctx.db
      .query("polls")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .first();
    
    if (!poll) return null;

    // Get vote counts for each option
    const votes = await ctx.db
      .query("pollVotes")
      .filter((q) => q.eq(q.field("pollId"), poll._id))
      .collect();

    const voteCounts = poll.opties.map((_, index) => 
      votes.filter(vote => vote.optieIndex === index).length
    );

    const totalVotes = votes.length;

    return {
      ...poll,
      voteCounts,
      totalVotes,
    };
  },
});

export const getUserPollVote = query({
  args: { 
    threadId: v.id("threads"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db
      .query("polls")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .first();
    
    if (!poll) return null;

    const userVote = await ctx.db
      .query("pollVotes")
      .filter((q) => 
        q.and(
          q.eq(q.field("pollId"), poll._id),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    return userVote ? userVote.optieIndex : null;
  },
});

export const votePoll = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.id("users"),
    optieIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db
      .query("polls")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .first();
    
    if (!poll) throw new Error("Poll niet gevonden");

    // Check if user already voted
    const existingVote = await ctx.db
      .query("pollVotes")
      .filter((q) => 
        q.and(
          q.eq(q.field("pollId"), poll._id),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        optieIndex: args.optieIndex,
      });
    } else {
      // Create new vote
      await ctx.db.insert("pollVotes", {
        pollId: poll._id,
        userId: args.userId,
        optieIndex: args.optieIndex,
        aangemaaktOp: Date.now(),
      });
    }

    return true;
  },
});

// Enhanced getThreadsByChannel to include poll data and sort by upvotes for voorstellen-uitbreiding
export const getThreadsByChannelWithPolls = query({
  args: { 
    kanaalId: v.id("channels"),
    sortByUpvotes: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const threads = await ctx.db
      .query("threads")
      .filter((q) => q.eq(q.field("kanaalId"), args.kanaalId))
      .order("desc")
      .collect();

    // Get author info and poll data for each thread
    const threadsWithData = await Promise.all(
      threads.map(async (thread) => {
        const author = await ctx.db.get(thread.auteurId);
        
        let pollData = null;
        if (thread.type === "poll") {
          const poll = await ctx.db
            .query("polls")
            .filter((q) => q.eq(q.field("threadId"), thread._id))
            .first();
          
          if (poll) {
            const votes = await ctx.db
              .query("pollVotes")
              .filter((q) => q.eq(q.field("pollId"), poll._id))
              .collect();

            const voteCounts = poll.opties.map((_, index) => 
              votes.filter(vote => vote.optieIndex === index).length
            );

            pollData = {
              ...poll,
              voteCounts,
              totalVotes: votes.length,
            };
          }
        }

        return {
          ...thread,
          author,
          poll: pollData,
        };
      })
    );

    // Sort by upvotes if requested (for voorstellen-uitbreiding channel)
    if (args.sortByUpvotes) {
      return threadsWithData.sort((a, b) => b.upvotes.length - a.upvotes.length);
    }

    return threadsWithData;
  },
});

export const getRecentThreads = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const threads = await ctx.db
      .query("threads")
      .order("desc")
      .take(limit);

    // Get author info for each thread
    const threadsWithAuthors = await Promise.all(
      threads.map(async (thread) => {
        const author = await ctx.db.get(thread.auteurId);
        const channel = await ctx.db.get(thread.kanaalId);
        return {
          ...thread,
          author,
          channel,
        };
      })
    );

    return threadsWithAuthors;
  },
});

 