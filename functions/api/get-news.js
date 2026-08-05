export async function onRequestGet(context) {
  try {
    const { env, request } = context;

    if (!env || !env.DB) {
      return new Response(JSON.stringify({ error: "Brak połączenia z bazą danych" }), { status: 500 });
    }

    // Odczytujemy numer strony z adresu URL (domyślnie strona 1)
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = 20; // Liczba newsów na stronę
    const offset = (page - 1) * limit;

    // Pobranie konkretnej paczki newsów
    const { results } = await env.DB.prepare(
      "SELECT * FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}