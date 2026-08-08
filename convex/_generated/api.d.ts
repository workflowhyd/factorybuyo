/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as about from "../about.js";
import type * as auth from "../auth.js";
import type * as contact from "../contact.js";
import type * as files from "../files.js";
import type * as policy from "../policy.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as testimonials from "../testimonials.js";
import type * as trustBadges from "../trustBadges.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  about: typeof about;
  auth: typeof auth;
  contact: typeof contact;
  files: typeof files;
  policy: typeof policy;
  products: typeof products;
  seed: typeof seed;
  seedData: typeof seedData;
  testimonials: typeof testimonials;
  trustBadges: typeof trustBadges;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
