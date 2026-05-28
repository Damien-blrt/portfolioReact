declare const Deno: any;
Deno.serve(async (req: Request) => {
  const { record } = await req.json();

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'damien.ballerat@etu.uca.fr',
      subject: `💬 Nouveau message de ${record.nom}`,
      html: `
        <h2>Nouveau message reçu</h2>
        <p><b>Nom :</b> ${record.nom}</p>
        <p><b>Email :</b> ${record.email || 'non renseigné'}</p>
        <p><b>Message :</b> ${record.message}</p>
      `,
    }),
  });

  return new Response('ok', { status: 200 });
});