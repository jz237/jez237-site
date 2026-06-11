export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.jez237.com") {
    url.hostname = "jez237.com";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
