// render.js
export async function list() {
  const response = await fetch('/'); 
  const html = await response.text();
  return html;
}

export async function newContact() {
  const response = await fetch('/contact/new');
  const html = await response.text();
  return html;
}

export async function search() {
  const response = await fetch('/contact/search');
  const html = await response.text();
  return html;
}

export async function show(id) {
  const response = await fetch(`/contact/${id}`);
  const html = await response.text();
  return html;
}

export async function found(resultHtml) {
  const response = await fetch('/contact/search', {
    method: 'POST',
    body: new URLSearchParams({ resultHtml }),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const html = await response.text();
  return html;
}

export async function notFound() {
  const response = await fetch('/contact/search');
  const html = await response.text();
  return html;
}
