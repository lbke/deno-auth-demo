import { oak, oakCors } from "/deps.ts";
const { Application, Router } = oak;

import { connectToAppDb } from "/core/db.ts";
import { accountRouter } from "/account/router.ts";

await connectToAppDb();

const app = new Application();

// NOTE: this means that the API is open to any route
// it should be restricted before releasing to production
// TODO: why "*" is not working?
app.use(oakCors({ origin: ["*", "http://localhost:8080"] }));

app.use(
  new Router()
    .use("/account", accountRouter.routes(), accountRouter.allowedMethods())
    .routes()
);

console.info("Running Deno server on http://localhost:8000");
await app.listen({ port: 8000 });
