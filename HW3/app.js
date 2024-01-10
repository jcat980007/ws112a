import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const contacts = [];

const router = new Router();

router
  .get('/', listContacts)
  .get('/contact/new', addContactForm)
  .post('/contact', addContact)
  .get('/contact/:id', showContact)
  .post('/search', searchContactForm)
  .post('/find', findContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function listContacts(ctx) {
  ctx.response.body = await render.listContacts(contacts);
}

async function addContactForm(ctx) {
  ctx.response.body = await render.newContactForm();
}

async function addContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const contact = {};
    for (const [key, value] of pairs) {
      contact[key] = value;
    }
    contacts.push(contact);
    ctx.response.redirect('/');
  }
}

async function showContact(ctx) {
  const id = ctx.params.id;
  const contact = contacts[id];
  if (!contact) ctx.throw(404, 'invalid contact id');
  ctx.response.body = await render.showContact(contact);
}

async function searchContactForm(ctx) {
  ctx.response.body = await render.searchContactForm();
}

async function findContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const nameToFind = pairs.find(pair => pair[0] === 'name')[1];
    const contact = contacts.find(c => c.name === nameToFind);

    if (contact) {
      ctx.response.body = await render.foundContact(contact);
    } else {
      ctx.response.body = await render.notFoundContact();
    }
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
