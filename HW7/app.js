import { serve } from "https://deno.land/std/http/server.ts";
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

const server = serve({ port: 8000 });

async function handleRequest(request) {
  const { method, url } = request;
  const [_, section, param] = url.split('/');

  switch (section) {
    case '':
      await handleList(request);
      break;
    case 'contact':
      if (method === 'GET') {
        await handleShow(request, param);
      } else if (method === 'POST') {
        await handleCreate(request);
      }
      break;
    case 'contact/search':
      await handleSearch(request);
      break;
    case 'contact/new':
      await handleAdd(request);
      break;
    default:
      await request.respond({ status: 404, body: 'Not Found' });
  }
}

async function handleList(request) {
  const contacts = await db.query("SELECT * FROM contacts");
  const body = await render.list(contacts);
  await request.respond({ status: 200, body });
}

async function handleShow(request, id) {
  const contact = await db.queryOne("SELECT * FROM contacts WHERE id = ?", id);
  if (!contact) {
    await request.respond({ status: 404, body: 'Contact not found' });
  } else {
    const body = await render.show(contact);
    await request.respond({ status: 200, body });
  }
}

async function handleCreate(request) {
  const body = await readBody(request);
  const params = new URLSearchParams(body);
  const name = params.get('name');
  const phone = params.get('phone');
  const id = await db.query("INSERT INTO contacts (name, phone) VALUES (?, ?)", name, phone);
  await request.respond({ status: 303, headers: new Headers({ "Location": '/' }) });
}

async function handleSearch(request) {
  const body = await render.search();
  await request.respond({ status: 200, body });
}

async function handleAdd(request) {
  const body = await render.newContact();
  await request.respond({ status: 200, body });
}

async function readBody(request) {
  const buf = new Uint8Array(1024);
  let body = '';
  let n;
  while ((n = await request.body.read(buf)) !== null) {
    body += new TextDecoder().decode(buf.subarray(0, n));
  }
  return body;
}

console.log('Server run at http://127.0.0.1:8000');

for await (const request of server) {
  handleRequest(request);
}