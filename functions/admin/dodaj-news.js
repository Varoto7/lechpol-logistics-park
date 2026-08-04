export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");

    if (!env || !env.DB) {
      return Response.redirect(new URL('/admin/dodaj-news?status=error', request.url), 302);
    }

    // Automatycznie tworzymy nową tabelę 'news' jeśli jeszcze nie istnieje
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        created_at TEXT
      )
    `).run();

    // Dodajemy newsa do bazy
    await env.DB.prepare(
      "INSERT INTO news (title, content, created_at) VALUES (?, ?, datetime('now'))"
    ).bind(title, content).run();

    return Response.redirect(new URL('/admin/dodaj-news?status=success', request.url), 302);

  } catch (error) {
    console.error("Błąd zapisu newsa:", error);
    return Response.redirect(new URL('/admin/dodaj-news?status=error', request.url), 302);
  }
}