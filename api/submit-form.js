require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', 'https://xcaptt.github.io'); 
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); 
  }

  if (req.method === 'POST') {
    const { name, email, message } = req.body;


    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'claudiacapeletti1@gmail.com',
      subject: 'Nova mensagem do formulário de contato',
      text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).send('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return res.status(500).send(`Erro ao enviar e-mail: ${error.message}`);
    }
  } else {
    return res.status(405).send('Método não permitido');
  }
};
