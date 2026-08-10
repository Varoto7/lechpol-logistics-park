export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const title = formData.get('title');
        const image = formData.get('image');
        const area = formData.get('area');
        const height = formData.get('height');
        const docks = formData.get('docks');
        const description = formData.get('description');

        await context.env.DB.prepare(
            "INSERT INTO halls (title, image, area, height, docks, description) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(title, image, area, height, docks, description).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}