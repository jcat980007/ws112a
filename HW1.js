import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  const nquUrl = "https://www.nqu.edu.tw/";
  const csieUrl = "https://csie.nqu.edu.tw/";

  console.log(`path=${ctx.request.url.pathname}`);

  if (ctx.request.url.pathname === "/nqu/") {
    ctx.response.body = `
      <html>
          <body>
              <a href="${nquUrl}">NQU</a>
          </body>
      </html>`;
  } else if (ctx.request.url.pathname === "/nqu/csie/") {
    ctx.response.body = `
      <html>
          <body>
              <a href="${csieUrl}">NQU_CSIE</a>
          </body>
      </html>`;
  } else if (ctx.request.url.pathname === "/to/nqu/") {
    ctx.response.redirect(nquUrl);
  } else if (ctx.request.url.pathname === "/to/nqu/csie/") {
    ctx.response.redirect(csieUrl);
  }
});

console.log('start at : http://127.0.0.1:8000');
await app.listen({ port: 8000 });
