// server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { MailerSend, EmailParams, Sender, Recipient, Attachment } = require("mailersend");

const app = express();
app.use(cors());

// Inicializa o cliente do MailerSend com sua chave de API
const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

// Configuração do Multer (continua a mesma)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // Limite total de 15MB
});

const uploadFields = upload.fields([
    { name: 'cnh', maxCount: 1 },
    { name: 'contrato_social', maxCount: 10 },
    { name: 'cartao_cnpj', maxCount: 1 }
]);


app.post('/enviar-email', uploadFields, async (req, res) => {
    try {
        const { nome_completo, email, telefone } = req.body;

        // Acessa os arquivos da mesma forma
        const cnhFile = req.files['cnh'] ? req.files['cnh'][0] : null;
        const contratoSocialFiles = req.files['contrato_social'] || [];
        const cartaoCnpjFile = req.files['cartao_cnpj'] ? req.files['cartao_cnpj'][0] : null;

        // Monta a lista de anexos no formato do MailerSend
        const attachments = [];
        if (cnhFile) {
            attachments.push(new Attachment(cnhFile.buffer.toString("base64"), cnhFile.originalname));
        }
        if (cartaoCnpjFile) {
            attachments.push(new Attachment(cartaoCnpjFile.buffer.toString("base64"), cartaoCnpjFile.originalname));
        }
        contratoSocialFiles.forEach(file => {
            attachments.push(new Attachment(file.buffer.toString("base64"), file.originalname));
        });

        // Configura os parâmetros do e-mail
        const sentFrom = new Sender(process.env.SENDER_EMAIL, nome_completo);
        const recipients = [new Recipient(process.env.EMAIL_DESTINO, "Admin do Site")];
        
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(new Sender(email, nome_completo)) // Para poder responder ao usuário
            .setSubject(`Novo cadastro de ${nome_completo}`)
            .setHtml(`
                <h1>Novo Cadastro Recebido</h1>
                <p><strong>Nome Completo:</strong> ${nome_completo}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p>Os documentos foram enviados em anexo.</p>
            `)
            .setAttachments(attachments);

        // Envia o e-mail usando a API do MailerSend
        await mailerSend.email.send(emailParams);

        res.status(200).send("Cadastro enviado com sucesso!");

    } catch (error) {
        console.error("Erro ao enviar e-mail:", error.body ? error.body.errors : error);
        res.status(500).send("Ocorreu um erro ao enviar o e-mail.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});