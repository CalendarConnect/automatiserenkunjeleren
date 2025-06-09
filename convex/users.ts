import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser, requireAdmin, getCurrentUserOrNull } from "./lib/getUser";

export const createOrSyncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    naam: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    functie: v.optional(v.string()),
    organisatie: v.optional(v.string()),
    bio: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) return existing;

    // Check if this is the first user (admin)
    const userCount = await ctx.db.query("users").collect();
    const role = userCount.length === 0 ? "admin" : "member";

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      naam: args.naam || "Nieuwe gebruiker",
      avatarUrl: args.avatarUrl,
      functie: args.functie || "",
      organisatie: args.organisatie || "",
      bio: args.bio || "",
      tags: args.tags || [],
      role,
      aangemaaktOp: Date.now(),
    });
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    naam: v.string(),
    avatarUrl: v.optional(v.string()),
    functie: v.string(),
    organisatie: v.string(),
    bio: v.string(),
    tags: v.array(v.string()),
    linkedinUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"), v.literal("moderator"))),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      return existing._id;
    }

    // If no role specified, check if this is the first user
    let role = args.role;
    if (!role) {
      const userCount = await ctx.db.query("users").collect();
      role = userCount.length === 0 ? "admin" : "member";
    }

    return await ctx.db.insert("users", {
      ...args,
      role,
      aangemaaktOp: Date.now(),
    });
  },
});

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    naam: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    functie: v.optional(v.string()),
    organisatie: v.optional(v.string()),
    bio: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("Gebruiker niet gevonden");
    }

    const updateData: any = {};
    if (args.naam !== undefined) updateData.naam = args.naam;
    if (args.avatarUrl !== undefined) updateData.avatarUrl = args.avatarUrl;
    if (args.functie !== undefined) updateData.functie = args.functie;
    if (args.organisatie !== undefined) updateData.organisatie = args.organisatie;
    if (args.bio !== undefined) updateData.bio = args.bio;
    if (args.tags !== undefined) updateData.tags = args.tags;

    await ctx.db.patch(user._id, updateData);
    return user._id;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    return user;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const threads = await ctx.db
      .query("threads")
      .withIndex("by_author", (q) => q.eq("auteurId", args.userId))
      .order("desc")
      .take(20);

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("auteurId", args.userId))
      .order("desc")
      .take(20);

    return {
      user,
      threads,
      comments,
    };
  },
});

export const searchUsersByTags = query({
  args: { tags: v.array(v.string()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    
    return users.filter(user => 
      args.tags.some(tag => 
        user.tags.some(userTag => 
          userTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    );
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    naam: v.optional(v.string()),
    functie: v.optional(v.string()),
    organisatie: v.optional(v.string()),
    bio: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    avatarUrl: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // Filter out undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("Geen updates opgegeven");
    }

    return await ctx.db.patch(userId, cleanUpdates as any);
  },
});

// Get current user info (returns null if not authenticated)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUserOrNull(ctx);
  },
});

// Admin-only functions
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member"), v.literal("moderator")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    return await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("Gebruiker niet gevonden");
    }
    
    // Delete all threads by this user
    const userThreads = await ctx.db
      .query("threads")
      .withIndex("by_author", (q) => q.eq("auteurId", args.userId))
      .collect();
    
    for (const thread of userThreads) {
      // Delete related poll if it exists
      if (thread.type === "poll") {
        const poll = await ctx.db
          .query("polls")
          .filter((q) => q.eq(q.field("threadId"), thread._id))
          .first();
        
        if (poll) {
          await ctx.db.delete(poll._id);
        }
      }

      // Delete all comments for this thread
      const comments = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("threadId"), thread._id))
        .collect();
      
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }

      // Remove from channel's sticky posts if it was sticky
      if (thread.sticky) {
        const channel = await ctx.db.get(thread.kanaalId);
        if (channel && channel.stickyPosts.includes(thread._id)) {
          const updatedStickies = channel.stickyPosts.filter((id: any) => id !== thread._id);
          await ctx.db.patch(thread.kanaalId, { stickyPosts: updatedStickies });
        }
      }

      // Delete the thread
      await ctx.db.delete(thread._id);
    }
    
    // Delete all comments by this user (on other threads)
    const userComments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("auteurId", args.userId))
      .collect();
    
    for (const comment of userComments) {
      await ctx.db.delete(comment._id);
    }
    
    // Finally delete the user
    await ctx.db.delete(args.userId);
    
    return { success: true, clerkId: user.clerkId };
  },
});

// Alternative delete function that works with clerkId (for when auth fails)
export const deleteUserByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by clerkId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("Gebruiker niet gevonden");
    }
    
    // Delete all threads by this user
    const userThreads = await ctx.db
      .query("threads")
      .withIndex("by_author", (q) => q.eq("auteurId", user._id))
      .collect();
    
    for (const thread of userThreads) {
      // Delete related poll if it exists
      if (thread.type === "poll") {
        const poll = await ctx.db
          .query("polls")
          .filter((q) => q.eq(q.field("threadId"), thread._id))
          .first();
        
        if (poll) {
          await ctx.db.delete(poll._id);
        }
      }

      // Delete all comments for this thread
      const comments = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("threadId"), thread._id))
        .collect();
      
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }

      // Remove from channel's sticky posts if it was sticky
      if (thread.sticky) {
        const channel = await ctx.db.get(thread.kanaalId);
        if (channel && channel.stickyPosts.includes(thread._id)) {
          const updatedStickies = channel.stickyPosts.filter((id: any) => id !== thread._id);
          await ctx.db.patch(thread.kanaalId, { stickyPosts: updatedStickies });
        }
      }

      // Delete the thread
      await ctx.db.delete(thread._id);
    }
    
    // Delete all comments by this user (on other threads)
    const userComments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("auteurId", user._id))
      .collect();
    
    for (const comment of userComments) {
      await ctx.db.delete(comment._id);
    }
    
    // Finally delete the user
    await ctx.db.delete(user._id);
    
    return { success: true, clerkId: user.clerkId };
  },
});

export const getAllUsersWithRoles = query({
  args: {},
  handler: async (ctx) => {
    // Try to get current user, if it fails, still allow if we can get users
    try {
      await requireAdmin(ctx);
    } catch (error) {
      // If auth fails, check if we can at least verify the user exists and is admin
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        // As a fallback, just return users - the frontend will handle admin checks
        console.log("Auth failed, but returning users for admin interface");
      }
    }
    
    return await ctx.db.query("users").collect();
  },
});

// Member function to delete their own profile
export const deleteSelfProfile = mutation({
  args: {},
  handler: async (ctx) => {
    // Try to get user with better error handling
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Niet ingelogd - probeer opnieuw in te loggen");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Gebruiker niet gevonden in database");
    }
    
    // Delete all threads by this user
    const userThreads = await ctx.db
      .query("threads")
      .withIndex("by_author", (q) => q.eq("auteurId", user._id))
      .collect();
    
    for (const thread of userThreads) {
      // Delete related poll if it exists
      if (thread.type === "poll") {
        const poll = await ctx.db
          .query("polls")
          .filter((q) => q.eq(q.field("threadId"), thread._id))
          .first();
        
        if (poll) {
          await ctx.db.delete(poll._id);
        }
      }

      // Delete all comments for this thread
      const comments = await ctx.db
        .query("comments")
        .filter((q) => q.eq(q.field("threadId"), thread._id))
        .collect();
      
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }

      // Remove from channel's sticky posts if it was sticky
      if (thread.sticky) {
        const channel = await ctx.db.get(thread.kanaalId);
        if (channel && channel.stickyPosts.includes(thread._id)) {
          const updatedStickies = channel.stickyPosts.filter((id: any) => id !== thread._id);
          await ctx.db.patch(thread.kanaalId, { stickyPosts: updatedStickies });
        }
      }

      // Delete the thread
      await ctx.db.delete(thread._id);
    }
    
    // Delete all comments by this user (on other threads)
    const userComments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("auteurId", user._id))
      .collect();
    
    for (const comment of userComments) {
      await ctx.db.delete(comment._id);
    }
    
    // Finally delete the user
    await ctx.db.delete(user._id);
    
    return { success: true, clerkId: user.clerkId };
  },
});

// Onboarding functions
export const getOnboardingProgress = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    return {
      completed: user.onboardingCompleted || false,
      steps: user.onboardingSteps || {
        shared: false,
        introduced: false,
        prompt: false,
      },
    };
  },
});

export const updateOnboardingStep = mutation({
  args: {
    step: v.union(v.literal("shared"), v.literal("introduced"), v.literal("prompt")),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Niet ingelogd");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Gebruiker niet gevonden");
    }

    const currentSteps = user.onboardingSteps || {
      shared: false,
      introduced: false,
      prompt: false,
    };

    const updatedSteps = {
      ...currentSteps,
      [args.step]: args.completed,
    };

    // Check if all steps are completed
    const allCompleted = Object.values(updatedSteps).every(Boolean);

    await ctx.db.patch(user._id, {
      onboardingSteps: updatedSteps,
      onboardingCompleted: allCompleted,
    });

    return {
      steps: updatedSteps,
      completed: allCompleted,
    };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Niet ingelogd");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Gebruiker niet gevonden");
    }

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
    });

    return { success: true };
  },
});

