/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as channels from "../channels.js";
import type * as comments from "../comments.js";
import type * as lib_getUser from "../lib/getUser.js";
import type * as lib_utils from "../lib/utils.js";
import type * as promptbibliotheek from "../promptbibliotheek.js";
import type * as secties from "../secties.js";
import type * as seed from "../seed.js";
import type * as seedChannels from "../seedChannels.js";
import type * as threads from "../threads.js";
import type * as toolbibliotheek from "../toolbibliotheek.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  channels: typeof channels;
  comments: typeof comments;
  "lib/getUser": typeof lib_getUser;
  "lib/utils": typeof lib_utils;
  promptbibliotheek: typeof promptbibliotheek;
  secties: typeof secties;
  seed: typeof seed;
  seedChannels: typeof seedChannels;
  threads: typeof threads;
  toolbibliotheek: typeof toolbibliotheek;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
