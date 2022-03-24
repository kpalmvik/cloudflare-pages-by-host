const lookClassFromHost = (host) => {
  if (host === "something-something.kristofer.me") {
    return "look-like-something-something";
  }

  if (host === "testing.whitebrd.se") {
    return "look-like-something-else";
  }

  return "";
};

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
      <p>The <span class="${lookClassFromHost(
        host
      )}">look is slightly different</span> depending on what host you access it from:<p>
      <ul>
        <li><a href="https://cloudflare-pages-by-host.pages.dev/">cloudflare-pages-by-host.pages.dev</a></li>
        <li><a href="https://something-something.kristofer.me/">something-something.kristofer.me</a></li>
        <li><a href="https://testing.whitebrd.se/">testing.whitebrd.se</a></li>
      </ul>
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

  .look-like-something-something {
    font-weight: bold;
    color: red;
  }

  .look-like-something-else {
    font-weight: bold;
    color: orange;
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
    status: 503, // See <https://developers.google.com/search/blog/2011/01/how-to-deal-with-planned-site-downtime>
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}
