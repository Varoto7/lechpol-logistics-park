export async function onRequestGet(context) {
  try {
    const { env } = context;

    if (!env || !env.DB) {
      return new Response(JSON.stringify({ error: "Brak bazy danych" }), { status: 500 });
    }

    // Pobranie wszystkich wiadomości z bazy (sortowanie od najnowszych)
    const { results } = await env.DB.prepare(
      "SELECT * FROM messages ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}