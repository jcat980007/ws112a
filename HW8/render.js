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

export function initWebSocket() {
  const socket = new WebSocket("ws://localhost:8000/ws");

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened:", event);
    // Handle WebSocket connection opened event
  });

  socket.addEventListener("message", (event) => {
    console.log("WebSocket message received:", event.data);
    // Handle WebSocket message received event
  });

  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed:", event);
    // Handle WebSocket connection closed event
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket error:", event);
    // Handle WebSocket error event
  });

  return socket;
}