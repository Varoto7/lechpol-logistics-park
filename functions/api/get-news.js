export async function onRequestGet(context) {
  try {
    const { env } = context;
    if (!env || !env.DB) {
      return new Response(JSON.stringify({ error: "Brak bazy" }), { status: 500 });
    }

    // Pobieramy newsy od najnowszego (DESC)
    const { results } = await env.DB.prepare("SELECT * FROM news ORDER BY created_at DESC").all();
    
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json;charset=UTF-8" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Błąd pobierania" }), { status: 500 });
  }
}