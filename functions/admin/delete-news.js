export async function onRequestDelete(context) {
    try {
        const { request, env } = context;
        
        // Pobieramy ID z adresu URL (np. /admin/delete-news?id=5)
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return new Response(JSON.stringify({ error: "Brak ID wpisu" }), { status: 400 });
        }

        if (!env || !env.DB) {
            return new Response(JSON.stringify({ error: "Brak połączenia z bazą" }), { status: 500 });
        }

        // Usuwanie wpisu z bazy danych
        await env.DB.prepare("DELETE FROM news WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}