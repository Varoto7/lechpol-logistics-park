export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { results } = await env.DB.prepare("SELECT * FROM map_zones").all();
    
    // Konwertujemy tablicę z bazy na format obiektu (taki sam jak miał JSON),
    // żebyśmy nie musieli drastycznie przerabiać kodu mapy SVG!
    const dataMap = {};
    results.forEach(row => {
        dataMap[row.id] = row;
    });

    return new Response(JSON.stringify(dataMap), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}