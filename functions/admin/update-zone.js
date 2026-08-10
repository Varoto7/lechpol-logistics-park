export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    
    const id = formData.get('id');
    const nazwa = formData.get('nazwa');
    const powierzchnia = formData.get('powierzchnia');
    const status = formData.get('status');
    const opis = formData.get('opis');

    if (!id || !nazwa || !powierzchnia || !status) {
        return new Response(JSON.stringify({ error: "Brakuje wymaganych pól" }), { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE map_zones SET nazwa = ?, powierzchnia = ?, status = ?, opis = ? WHERE id = ?"
    ).bind(nazwa, powierzchnia, status, opis, id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}