export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const email = formData.get("email");
    const message = formData.get("message");

    if (!env || !env.DB) {
      // Baza danych nie jest powiązana w Cloudflare Pages Settings -> Bindings
      return Response.redirect(new URL('/kontakt?status=nodb', request.url), 302);
    }

    // Upewniamy się, że tabela istnieje (tworzy ją automatycznie, jeśli jej brak)
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        message TEXT,
        created_at TEXT
      )
    `).run();

    // Wstawienie danych do bazy
    await env.DB.prepare(
      "INSERT INTO messages (email, message, created_at) VALUES (?, ?, datetime('now'))"
    ).bind(email, message).run();

    // Sukces - przekierowanie z zielonym komunikatem
    return Response.redirect(new URL('/kontakt?status=success', request.url), 302);

  } catch (error) {
    // W razie jakiegokolwiek błędu SQL przekierowujemy na status błędu zamiast rzucać błędem 1101
    console.error("Błąd bazy D1:", error);
    return Response.redirect(new URL('/kontakt?status=error', request.url), 302);
  }
}