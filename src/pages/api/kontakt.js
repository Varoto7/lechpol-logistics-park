export const prerender = false; // Wymuszamy, by to był skrypt serwerowy

export async function POST({ request, locals, redirect }) {
  try {
    const data = await request.formData();
    const email = data.get("email");
    const message = data.get("message");

    // Pobranie środowiska i bazy D1
    const env = locals?.runtime?.env;

    if (env && env.DB) {
      // Zapis do bazy
      await env.DB.prepare(
        "INSERT INTO messages (email, message, created_at) VALUES (?, ?, datetime('now'))"
      ).bind(email, message).run();

      // Przekierowanie powrotne na stronę kontakt z flagą sukcesu (kod 303 jest tu kluczowy!)
      return redirect('/kontakt?status=success', 303);
    } else {
      return redirect('/kontakt?status=nodb', 303);
    }
  } catch (error) {
    console.error("Błąd zapisu do D1:", error);
    return redirect('/kontakt?status=error', 303);
  }
}