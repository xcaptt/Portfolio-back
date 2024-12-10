require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3003;


app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});


transporter.verify((error, success) => {
    if (error) {
        console.error('Erro ao conectar ao servidor de e-mail:', error.message);
    } else {
        console.log('Servidor de e-mail pronto para envio:', success);
    }
});


app.post('/submit-form', async (req, res) => {
    try {
        const { name, email, message } = req.body;


        if (!name || !email || !message) {
            throw new Error('Todos os campos são obrigatórios!');
        }


        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: 'claudiacapeletti1@gmail.com', 
            subject: 'Nova mensagem do formulário de contato',
            text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`, 
        };


        await transporter.sendMail(mailOptions);

        console.log('E-mail enviado com sucesso!');
        res.status(200).send('Formulário enviado e e-mail enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error.message);
        res.status(500).send(`Erro ao enviar e-mail: ${error.message}`);
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
