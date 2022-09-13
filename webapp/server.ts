import { oak } from "/deps.ts";
const { Application, Router, send } = oak;

const app = new Application();

const router = new Router();
router.get("/", async (ctx) => {
  await send(ctx, "index.html");
});
router.get("/needs-token", async (ctx) => {
  // just a dumb check to show how we can read cookies
  // share the logic with API if you want to actually call the database
  if (await ctx.cookies.get("AUTH_TOKEN")) {
    await send(ctx, "needs-token.html");
  } else {
    ctx.throw(401, "No token found in cookies");
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Running Deno server on http://localhost:8080");
await app.listen({ port: 8080 });
