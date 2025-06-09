import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    naam: v.string(),
    avatarUrl: v.optional(v.string()),
    functie: v.string(),
    organisatie: v.string(),
    bio: v.string(),
    tags: v.array(v.string()),
    linkedinUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"), v.literal("moderator"))),
    aangemaaktOp: v.number(),
    // Onboarding progress
    onboardingCompleted: v.optional(v.boolean()),
    onboardingSteps: v.optional(v.object({
      shared: v.boolean(),
      introduced: v.boolean(),
      prompt: v.boolean(),
    })),
  })
    .index("by_clerk_id", ["clerkId"]),

  secties: defineTable({
    naam: v.string(),
    emoji: v.string(),
    kleur: v.string(), // Hex color code
    status: v.optional(v.union(v.literal("draft"), v.literal("live"))), // Status van de sectie
    volgorde: v.number(),
    aangemaaktOp: v.number(),
  })
    .index("by_volgorde", ["volgorde"])
    .index("by_status", ["status"]),

  channels: defineTable({
    naam: v.string(),
    slug: v.string(),
    beschrijving: v.string(),
    type: v.union(v.literal("discussie"), v.literal("templates"), v.literal("modules")),
    sectieId: v.optional(v.id("secties")), // Verwijzing naar sectie
    aangemaaktDoor: v.id("users"),
    stickyPosts: v.array(v.id("threads")),
    volgorde: v.optional(v.number()), // Volgorde binnen een sectie
    visible: v.optional(v.boolean()), // Zichtbaarheid van het kanaal
    aangemaaktOp: v.number(),
    headerAfbeelding: v.optional(v.string()),
    headerOmschrijving: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"])
    .index("by_sectie", ["sectieId"])
    .index("by_sectie_volgorde", ["sectieId", "volgorde"])
    .index("by_visible", ["visible"]),

  threads: defineTable({
    kanaalId: v.id("channels"),
    titel: v.string(),
    slug: v.string(), // URL-friendly version of title
    threadNumber: v.number(), // Unique incrementing number
    inhoud: v.optional(v.string()), // Optional for polls
    auteurId: v.id("users"),
    upvotes: v.array(v.id("users")),
    sticky: v.boolean(),
    afbeelding: v.optional(v.string()), // Thread afbeelding URL
    type: v.optional(v.union(v.literal("text"), v.literal("poll"))), // Thread type
    aangemaaktOp: v.number(),
  })
    .index("by_channel", ["kanaalId"])
    .index("by_author", ["auteurId"])
    .index("by_created_at", ["aangemaaktOp"])
    .index("by_type", ["type"])
    .index("by_slug", ["slug"])
    .index("by_thread_number", ["threadNumber"])
    .searchIndex("search_threads", {
      searchField: "titel",
      filterFields: ["kanaalId"]
    }),

  polls: defineTable({
    threadId: v.id("threads"),
    vraag: v.string(), // Poll question
    opties: v.array(v.string()), // Poll options
    multipleChoice: v.optional(v.boolean()), // Allow multiple selections
    aangemaaktOp: v.number(),
  })
    .index("by_thread", ["threadId"]),

  pollVotes: defineTable({
    pollId: v.id("polls"),
    userId: v.id("users"),
    optieIndex: v.number(), // Index of the selected option
    aangemaaktOp: v.number(),
  })
    .index("by_poll", ["pollId"])
    .index("by_user_poll", ["userId", "pollId"])
    .index("by_poll_option", ["pollId", "optieIndex"]),

  comments: defineTable({
    threadId: v.id("threads"),
    auteurId: v.id("users"),
    inhoud: v.string(),
    likes: v.array(v.id("users")),
    aangemaaktOp: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_author", ["auteurId"])
    .index("by_created_at", ["aangemaaktOp"]),
}); 