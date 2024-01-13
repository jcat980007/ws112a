import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Database } from "https://deno.land/x/sqlite/mod.ts";
import * as render from './render.js';

const db = new Database("contacts.db");
db.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT
  )
`);

const router = new Router();

router.get('/', list)
  .get('/contact/search', search)
  .get('/contact/new', add)
  .get('/contact/:id', show)
  .post('/contact', create)
  .post('/search', find);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  const contacts = await db.query("SELECT * FROM contacts");
  ctx.response.body = await render.list(contacts);
}

async function add(ctx) {
  ctx.response.body = await render.newContact();
}

async function search(ctx) {
  ctx.response.body = await render.search();
}

async function show(ctx) {
  const id = ctx.params.id;
  const contact = await db.queryOne("SELECT * FROM contacts WHERE id = ?", id);
  if (!contact) ctx.throw(404, 'invalid contact id');
  ctx.response.body = await render.show(contact);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const name = pairs.get('name');
    const phone = pairs.get('phone');
    const id = await db.query("INSERT INTO contacts (name, phone) VALUES (?, ?)", name, phone);
    ctx.response.redirect('/');
  }
}

async function find(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const searchTerm = pairs.get('name');
    const results = await db.query("SELECT * FROM contacts WHERE name LIKE ?", `%${searchTerm}%`);

    if (results.length > 0) {
      const resultHtml = results.map(contact => `<h1>Name: ${contact.name}</h1><p>Phone: ${contact.phone}</p>`).join('');
      ctx.response.body = await render.found(resultHtml);
    } else {
      ctx.response.body = await render.notFound();
    }
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });

//deno install --allow-write --allow-read --unstable -n deno-sqlite https://deno.land/x/sqlite/mod.ts