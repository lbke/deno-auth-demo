import { Ctx, NextFn } from "../core/typings.ts";
import { getUserByToken, UserDocument } from "./model.ts";
import { authTokenCookie } from "./token-manager.ts";

/**
 * Set user in context so its passed downstream to middlewares
 * @param ctx
 * @param user
 */
function setUserInContext(ctx: Ctx, user: UserDocument) {
  ctx.state.user = user;
}

/**
 * Get the current user from context
 * /!\ Make sure initUserCtx is in the middlewares chain
 * @param ctx
 * @returns
 */
export function getUserFromContext(ctx: Ctx) {
  if (!ctx.state._init_user) {
    throw new Error(
      "initUserCtx must be in the middleware chain when calling getUserFromContext"
    );
  }
  return ctx.state.user;
}

export async function initUserCtx(ctx: Ctx, next: () => Promise<unknown>) {
  // Flag to check that initUserCtx was called
  ctx.state._init_user = true;

  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader && authHeader?.split(" ").length === 2) {
    await next();
  }
  // NOTE: since this API is meant to be called by a webapp,
  // we get the token from a cookie, NOT an authorization header
  const token = await ctx.cookies.get(authTokenCookie);

  if (!token) {
    // no connected user
    return await next();
  }

  const user = await getUserByToken(token);
  if (!user) {
    // token is not valid
    return await next();
  }
  setUserInContext(ctx, user);
  await next();
}

/**
 * Respond with 401 if user is not authenticated
 */
export async function checkIsAuth(ctx: Ctx, next: NextFn) {
  const user = getUserFromContext(ctx);
  if (!user) {
    ctx.throw(401, "Not logged in");
  } else {
    await next();
  }
}

/**
 * Inverse of checkIsAuth, respond with 403 if user is already authenticated
 */
export async function checkIsVisitor(ctx: Ctx, next: NextFn) {
  const user = getUserFromContext(ctx);
  if (user) {
    ctx.throw(403, "Already logged in");
  } else {
    await next();
  }
}
