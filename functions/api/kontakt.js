export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    
    // Pobieramy dane z formularza 
    // (Jeśli w HTML masz pola name="imie" lub name="hala", też je tu łapiemy)
    const email = formData.get("email");
    const message = formData.get("message");
    const imie = formData.get("imie") || "Brak danych";
    const hala = formData.get("hala") || "Zapytanie ogólne";
    const turnstileToken = formData.get("cf-turnstile-response");

    // 1. Weryfikacja antyspamowa Turnstile
    const secretKey = env.TURNSTILE_SECRET_KEY;
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

    if (!result.success) {
      return Response.redirect(new URL('/kontakt?status=bot', request.url), 302);
    }

    // 2. Walidacja i Zapis do Bazy D1
    if (!env || !env.DB) {
      return Response.redirect(new URL('/kontakt?status=nodb', request.url), 302);
    }

    await env.DB.prepare(
      "INSERT INTO messages (email, message, created_at) VALUES (?, ?, datetime('now'))"
    ).bind(email, message).run();

    // 3. WYSYŁKA POWIADOMIENIA E-MAIL (Brevo)
    const apiKey = env.BREVO_API_KEY;
    const senderEmail = env.SENDER_EMAIL;
    const rawAdminEmails = env.ADMIN_EMAIL || '';

    // Wysyłamy e-mail tylko wtedy, gdy zmienne są uzupełnione w Cloudflare
    if (apiKey && senderEmail && rawAdminEmails) {
      const recipients = rawAdminEmails
        .split(',')
        .map(e => ({ email: e.trim() }))
        .filter(item => item.email.length > 0);

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Lechpol Logistics Park', email: senderEmail },
          to: recipients,
          subject: `Nowe zapytanie ze strony: ${hala}`,
          htmlContent: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #0284c7;">Nowa wiadomość ze strony Parku Logistycznego</h2>
              <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
              <p><strong>Imię / Firma:</strong> ${imie}</p>
              <p><strong>E-mail nadawcy:</strong> ${email}</p>
              <p><strong>Interesująca strefa:</strong> ${hala}</p>
              <p><strong>Treść wiadomości:</strong></p>
              <blockquote style="background: #f4f4f4; padding: 15px; border-left: 4px solid #0284c7; margin: 10px 0;">
                ${message}
              </blockquote>
            </div>
          `
        })
      });
    } else {
      console.log("Pominięto wysyłkę e-mail: Brak kluczy Brevo w panelu Cloudflare.");
    }

    // 4. Przekierowanie po sukcesie (Zapis + Mail gotowe!)
    return Response.redirect(new URL('/kontakt?status=success', request.url), 302);

  } catch (error) {
    console.error("Błąd API:", error);
    return Response.redirect(new URL('/kontakt?status=error', request.url), 302);
  }
}