// render.js
export function layout(title, content) {
    return `
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            padding: 80px;
            font: 16px Helvetica, Arial;
          }
      
          h1 {
            font-size: 2em;
          }
      
          h2 {
            font-size: 1.2em;
          }
      
          #contacts {
            margin: 0;
            padding: 0;
          }
      
          #contacts li {
            margin: 40px 0;
            padding: 0;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
            list-style: none;
          }
      
          #contacts li:last-child {
            border-bottom: none;
          }
      
          textarea {
            width: 500px;
          }
      
          input[type=text],
          textarea {
            border: 1px solid #eee;
            border-top-color: #ddd;
            border-left-color: #ddd;
            border-radius: 2px;
            padding: 15px;
            font-size: .8em;
          }
      
          input[type=text] {
            width: 500px;
          }
        </style>
      </head>
      <body>
        <section id="content">
          ${content}
        </section>
      </body>
      </html>
    `;
  }
  
  export function listContacts(contacts) {
    let list = [];
    for (let contact of contacts) {
      list.push(`
        <li>
          <h2>${contact.name}</h2>
          <p><a href="/contact/${contacts.indexOf(contact)}">查看詳細資訊</a></p>
        </li>
      `);
    }
    let content = `
      <h1>通訊錄</h1>
      <p>你有 <strong>${contacts.length}</strong> 聯絡人!</p>
      <p><a href="/contact/new">新增聯絡人</a></p>
      <p><a href="/search">搜尋聯絡人</a></p>
    `;
    content += `
      <ul id="contacts">
        ${list.join("\n")}
      </ul>
    `;
    return layout("Contacts", content);
  }
  
  export function newContactForm() {
    return layout(
      "新增聯絡人",
      `
      <h1>新增聯絡人</h1>
      <p>請填寫以下資訊：</p>
      <form action="/contact" method="post">
        <p><input type="text" placeholder="姓名" name="name"></p>
        <p><input type="text" placeholder="電話" name="phone"></p>
        <p><input type="submit" value="新增"></p>
      </form>
    `,
    );
  }
  
  export function searchContactForm() {
    return layout(
      "搜尋聯絡人",
      `
      <h1>搜尋聯絡人</h1>
      <form action="/find" method="post">
        <p><input type="text" placeholder="要查找的姓名" name="name"></p>
        <p><input type="submit" value="查詢"></p>
      </form>
    `,
    );
  }
  
  export function foundContact(contact) {
    return layout(
      "聯絡人資訊",
      `
      <h1>${contact.name}</h1>
      <p>電話：${contact.phone}</p>
    `,
    );
  }
  
  export function notFoundContact() {
    return layout(
      "查找聯絡人",
      `
      <h1>查找聯絡人</h1>
      <form action="/find" method="post">
        <p><input type="text" placeholder="要查找的姓名" name="name"></p>
        <p><input type="submit" value="查詢"></p>
      </form>
      <h1>未找到</h1>
    `,
    );
  }