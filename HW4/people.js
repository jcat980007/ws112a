import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const peoples = new Map();

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "請在網址列輸入/public/";
  })
  .get("/people", (ctx) => {
    ctx.response.body = Array.from(peoples.values());
  })
  .post("/people/add", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      const params = {};
      for (const [key, value] of pairs) {
        params[key] = value;
      }

      let account = params["account"];
      let password = params["password"];

      if (peoples.get(account)) {
        ctx.response.body = { error: `帳號=${account} 已經存在！` };
      } else {
        peoples.set(account, { account, password });
        ctx.response.type = "text/html";
        ctx.response.body = `<p>註冊成功</p><p><a href="/public/login.html">前往登入介面</a></p>`;
      }
    }
  })
  .post("/people/login", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      const params = {};
      for (const [key, value] of pairs) {
        params[key] = value;
      }
      const account = params["account"];
      const password = params["password"];

      const storedUser = peoples.get(account);

      if (storedUser && storedUser.password === password) {
        ctx.response.type = "text/html";
        ctx.response.body = `<p>登入成功</p><br><a href="/public/system.html">進入系統</a>`;
      } else {
        ctx.response.type = "text/html";
        ctx.response.body = `<p>登入失敗，請檢查帳號密碼是否有錯！</p><br><p><a href="/public/login.html">重新登入介面</a></p>`;
      }
    }
  })
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0];
    console.log("wpath=", wpath);
    await send(ctx, wpath, {
      root: Deno.cwd() + "/public/",
      index: "index.html",
    });
  });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("start at : http://127.0.0.1:8000");

await app.listen({ port: 8000 });