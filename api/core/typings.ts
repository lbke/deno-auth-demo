/**
 * Type helpers to improve context typing across middlewares
 *
 * Could be improved with generics
 *
 * Having a correctly typed context seems extra hard with middleware architecture,
 * I couldn't figure the best pattern yet
 */
import { oak } from "/deps.ts";

export type Ctx = oak.RouterContext<any, any, any>;
export type NextFn = () => Promise<unknown>;
