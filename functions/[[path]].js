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
  const { request, env } = context;

  const url = new URL(request.url);
  const { host, pathname } = url;

  const lookClass = lookClassFromHost(host);
  const html = `<!DOCTYPE html>
    <head>
      <title>${host}</title>
      <link href="/assets/styles.css" rel="stylesheet">
    </head>
    <body>
      <h1 class="title">${host}</h1>
      <p class="some-text">This page was served by Cloudflare Workers deployed through Cloudflare Pages</p>
      <p>The <span class="${lookClass}">look is slightly different</span> depending on what host you access it from:<p>
      <ul>
        <li><a href="https://cloudflare-pages-by-host.pages.dev/">cloudflare-pages-by-host.pages.dev</a></li>
        <li><a href="https://something-something.kristofer.me/">something-something.kristofer.me</a></li>
        <li><a href="https://testing.whitebrd.se/">testing.whitebrd.se</a></li>
      </ul>
    </body>`;

  if (pathname == "/assets/styles.css") {
    return env.ASSETS.fetch(request);
  }

  return new Response(html, {
    status: 503, // See <https://developers.google.com/search/blog/2011/01/how-to-deal-with-planned-site-downtime>
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}
