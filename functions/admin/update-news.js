export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        
        const id = formData.get("id");
        const title = formData.get("title");
        const content = formData.get("content");

        if (!id || !title || !content) {
            return new Response(JSON.stringify({ error: "Brakujące dane" }), { status: 400 });
        }

        if (!env || !env.DB) {
            return new Response(JSON.stringify({ error: "Brak połączenia z bazą" }), { status: 500 });
        }

        // Aktualizacja wpisu w bazie danych D1
        await env.DB.prepare(
            "UPDATE news SET title = ?, content = ? WHERE id = ?"
        ).bind(title, content, id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}