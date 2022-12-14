import { oak } from "/deps.ts";
const { Router } = oak;
import {
  checkIsAuth,
  checkIsVisitor,
  getUserFromContext,
  initUserCtx,
} from "./middlewares.ts";
import {
  createUser,
  getUserByCredentials,
  getUserByUsername,
} from "./model.ts";
import { authTokenCookie, generateJWT } from "./token-manager.ts";
import { apiConfig } from "../core/config.ts";
import { Ctx } from "../core/typings.ts";

const setCookieInCtx = (ctx: Ctx, jwt: string) => {
  ctx.cookies.set(authTokenCookie, jwt, {
    httpOnly: true,
    domain: "localhost",
    // localhost is using HTTP
    secure: apiConfig.ENVIRONMENT !== "development",
  });
};
export const accountRouter = new Router()
  .use(initUserCtx)
  .get("/user", (ctx) => {
    // if user is not auth its ok, we return null value with a 200
    ctx.response.body = getUserFromContext(ctx);
  })
  .post("/signup", checkIsVisitor, async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    if (!body.username) {
      ctx.throw(400, "No username provided");
    }
    if (!body.password) {
      ctx.throw(400, "No password provied");
    }
    const existingUser = await getUserByUsername(body.username);
    if (existingUser) {
      // error has to stay blackbox (here we don't take timing attacs into account yet)
      ctx.throw(400, "Could not signup");
    }
    const createdUser = await createUser(body.username, body.password);
    if (!createdUser) {
      return ctx.throw(500, `Unknown error when creating user`);
    }
    const jwt = await generateJWT(createdUser.id);
    ctx.response.body = {
      username: createdUser.username,
      id: createdUser.id,
      /**
      Pattern for server-server communication, returning the jwt explicitely
      For browser auth, prefer a cookie
      jwt,
      */
    };
    setCookieInCtx(ctx, jwt);
  })
  .post("/login", checkIsVisitor, async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    if (!body.username) {
      ctx.throw(400, "No username provided");
    }
    if (!body.password) {
      ctx.throw(400, "No password provied");
    }
    const user = await getUserByCredentials(body.username, body.password);
    if (!user) {
      ctx.throw(401, "Username/password combination not found");
    } else {
      //ctx.response.body = user;
      const jwt = await generateJWT(user.id);
      // FIXME: it's better to rely on cookies, but CORS need a more complex setup
      // we expect the user to get the token from sessionStorage
      ctx.response.body = {
        username: user.username,
        id: user.id,
        /**
      Pattern for server-server communication, returning the jwt explicitely
      For browser auth, prefer a cookie
      jwt,
      */
      };
      setCookieInCtx(ctx, jwt);
    }
  })
  .post("/logout", checkIsAuth, (ctx) => {
    ctx.cookies.set(authTokenCookie, null);
  });
