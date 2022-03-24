export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;

  const url = new URL(request.url);
  const { host, pathname } = url;

  const html = `<!DOCTYPE html>
    <head>
      <title>${host}</title>
      <link href="/styles.css" rel="stylesheet">
    </head>
    <body>
      <h1 class="title">${host}</h1>
      <p class="some-text">This page was served by Cloudflare Workers deployed through Cloudflare Pages</p>
    </body>`;

  const css = `.title {
    font-size: 16px;
    color: rebeccapurple;
  }

  .some-text {
    border-top: 3px solid black;
    padding-top: 10px;
    margin: 10px;
  }
  `;

  if (pathname == "/styles.css") {
    return new Response(css, {
      status: 200,
      headers: {
        "content-type": "text/css;charset=UTF-8",
      },
    });
  }

  return new Response(html, {
    status: 503,
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}
