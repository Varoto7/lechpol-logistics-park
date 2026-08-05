export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const email = formData.get("email");
    const message = formData.get("message");
    const turnstileToken = formData.get("cf-turnstile-response");

    // 1. Weryfikacja antyspamowa Turnstile z serwerami Cloudflare
    const secretKey = "0x4AAAAAAEGGv5EnRpy2SLctZ36_X_3yAx0";
    const clientIp = request.headers.get("CF-Connecting-IP");

    const verifyData = new FormData();
    verifyData.append("secret", secretKey);
    verifyData.append("response", turnstileToken);
    if (clientIp) verifyData.append("remoteip", clientIp);

    const outcome = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: verifyData,
    });

    const result = await outcome.json();

    // Jeśli weryfikacja bota nie przeszła:
    if (!result.success) {
      return Response.redirect(new URL('/kontakt?status=bot', request.url), 302);
    }

    // 2. Walidacja Bazy D1
    if (!env || !env.DB) {
      return Response.redirect(new URL('/kontakt?status=nodb', request.url), 302);
    }

    // 3. Zapis danych (Bez zapytania CREATE TABLE – obsługiwane przez D1 Migrations)
    await env.DB.prepare(
      "INSERT INTO messages (email, message, created_at) VALUES (?, ?, datetime('now'))"
    ).bind(email, message).run();

    return Response.redirect(new URL('/kontakt?status=success', request.url), 302);

  } catch (error) {
    console.error("Błąd API:", error);
    return Response.redirect(new URL('/kontakt?status=error', request.url), 302);
  }
}