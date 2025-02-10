export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action, clicks } = req.body;
  
  let subject, text;
  switch(action) {
    case 'yes':
      subject = 'Someone said YES! 💝';
      text = clicks === 0 
        ? "They said yes immediately! True love at first sight! 💘"
        : `They said yes after clicking 'no' ${clicks} times! Persistence pays off! 💝`;
      break;
    case 'exit':
      subject = 'Someone left without saying Yes 💔';
      text = `They clicked 'no' ${clicks} times before leaving. Maybe next time! 😢`;
      break;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Valentine App <valentines@srijit.co>',
        to: process.env.RECIPIENT_EMAIL,
        subject: subject,
        text: text
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}