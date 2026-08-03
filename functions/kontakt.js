export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const email = formData.get("email");
    const message = formData.get("message");

    // Jeśli baza D1 jest podpięta pod zmienną DB
    if (env && env.DB) {
      await env.DB.prepare(
        "INSERT INTO messages (email, message, created_at) VALUES (?, ?, datetime('now'))"
      ).bind(email, message).run();

      return Response.redirect(new URL('/kontakt?status=success', request.url), 302);
    } else {
      return Response.redirect(new URL('/kontakt?status=nodb', request.url), 302);
    }
  } catch (error) {
    return Response.redirect(new URL('/kontakt?status=error', request.url), 302);
  }
}