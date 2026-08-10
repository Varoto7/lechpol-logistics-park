export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const id = formData.get('id');
        await context.env.DB.prepare("DELETE FROM halls WHERE id = ?").bind(id).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}