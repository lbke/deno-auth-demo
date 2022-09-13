import { oak, oakCors } from "/deps.ts";
const { Application, Router } = oak;

import { connectToAppDb } from "/core/db.ts";
import { accountRouter } from "/account/router.ts";

await connectToAppDb();

const app = new Application();

// NOTE: this means that the API is open to any route
// it should be restricted before releasing to production
// TODO: why "*" is not working?
app.use(
  oakCors({
    // Can also accept Regex
    // NOTE: this WON'T accept 127.0.0.1, only "localhost"
    // NOTE: this will block server-server request as well
    // (use a custom function to support having no origin)
    origin: "http://localhost:8080",
    // Will add "Access-Control-Allow-Credentials: true"
    // Mandatory for Set-Cookie to work with fetch credentials/XHR withCredentials options
    credentials: true,
  })
);

app.use(
  new Router()
    .use("/account", accountRouter.routes(), accountRouter.allowedMethods())
    .routes()
);

console.info("Running Deno server on http://localhost:8000");
await app.listen({ port: 8000 });
