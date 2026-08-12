export async function onRequestPost(context) {
  try {
    const apiKey = context.env.BREVO_API_KEY;
    const senderEmail = context.env.SENDER_EMAIL;
    const rawAdminEmails = context.env.ADMIN_EMAIL || '';

    if (!apiKey || !senderEmail || !rawAdminEmails) {
      return new Response(
        JSON.stringify({ error: 'Brak wymaganych zmiennych w panelu Cloudflare' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const recipients = rawAdminEmails
      .split(',')
      .map(email => ({ email: email.trim() }))
      .filter(item => item.email.length > 0);

    const body = await context.request.json();
    const { imie, email, wiadomosc, hala } = body;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'Lechpol Logistics Park', email: senderEmail },
        to: recipients,
        subject: `Nowe zapytanie ze strony: ${hala || 'Formularz ogólny'}`,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0284c7;">Nowa wiadomość ze strony Parku Logistycznego</h2>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;" />
            <p><strong>Imię / Firma:</strong> ${imie || 'Brak danych'}</p>
            <p><strong>E-mail nadawcy:</strong> ${email || 'Brak danych'}</p>
            <p><strong>Interesująca strefa:</strong> ${hala || 'Zapytanie ogólne'}</p>
            <p><strong>Treść wiadomości:</strong></p>
            <blockquote style="background: #f4f4f4; padding: 15px; border-left: 4px solid #0284c7; margin: 10px 0;">
              ${wiadomosc || 'Brak treści'}
            </blockquote>
          </div>
        `
      })
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    } else {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData }), { status: 400 });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}