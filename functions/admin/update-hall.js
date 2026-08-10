export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const image = formData.get('image');
        const area = formData.get('area');
        const height = formData.get('height');
        const docks = formData.get('docks');
        const description = formData.get('description');

        if (!id) {
            return new Response(JSON.stringify({ error: "Brak ID hali do edycji" }), { status: 400 });
        }

        await context.env.DB.prepare(
            "UPDATE halls SET title = ?, image = ?, area = ?, height = ?, docks = ? WHERE id = ?"
        ).bind(title, image, area, height, docks, id).run();

        // Osobne zapytanie na opis, jeśli chcesz lub w jednym zapytaniu:
        await context.env.DB.prepare(
            "UPDATE halls SET title = ?, image = ?, area = ?, height = ?, docks = ?, description = ? WHERE id = ?"
        ).bind(title, image, area, height, docks, description, id).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}