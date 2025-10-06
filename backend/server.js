// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const {
  MailerSend,
  EmailParams,
  Sender,
  Recipient,
  Attachment,
} = require("mailersend");

const app = express();
app.use(cors());

// Inicializa o cliente do MailerSend com sua chave de API
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

// Configuração do Multer para arquivos em memória e limite de 15MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Configurando os campos que serão aceitos pelo multer
const uploadFields = upload.fields([
  { name: "cnh", maxCount: 1 },
  { name: "cartao-cnpj", maxCount: 1 },
  { name: "contrato-social", maxCount: 10 },
]);

app.post("/enviar-email", uploadFields, async (req, res) => {
  try {
    // Extrai campos comuns dos formulários
    const {
      nomeCompleto,
      cpf,
      telefone,
      email,
      rua,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      cnpj,
      responsavel,
      "data-video": dataVideo,
      "hora-video": horaVideo,
    } = req.body; // Acessa os arquivos enviados

    const cnhFile = req.files["cnh"] ? req.files["cnh"][0] : null;
    const cartaoCnpjFile = req.files["cartao-cnpj"]
      ? req.files["cartao-cnpj"][0]
      : null;
    const contratoSocialFiles = req.files["contrato-social"] || []; // Monta anexos para e-mail

    const attachments = [];
    if (cnhFile) {
      attachments.push(
        new Attachment(cnhFile.buffer.toString("base64"), cnhFile.originalname)
      );
    }
    if (cartaoCnpjFile) {
      attachments.push(
        new Attachment(
          cartaoCnpjFile.buffer.toString("base64"),
          cartaoCnpjFile.originalname
        )
      );
    }
    contratoSocialFiles.forEach((file) => {
      attachments.push(
        new Attachment(file.buffer.toString("base64"), file.originalname)
      );
    }); // Monta corpo do email dinamicamente com base no formulário enviado

    let emailBody = `
      <h1>Novo Cadastro</h1>
      <h1>Identifica Express</h1>
    `;

    if (cpf) {
      // Formulário CPF
      emailBody += `
        <p><strong>Nome Completo:</strong> ${nomeCompleto}</p>
        <p><strong>CPF:</strong> ${cpf}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <hr>
        <h3>Endereço</h3>
        <p><strong>Rua:</strong> ${rua}</p>
        <p><strong>Número:</strong> ${numero}</p>
        <p><strong>Bairro:</strong> ${bairro || "N/A"}</p>
        <p><strong>Cidade:</strong> ${cidade || "N/A"}</p>
        <p><strong>Estado:</strong> ${estado || "N/A"}</p>
        <p><strong>CEP:</strong> ${cep}</p>
        <hr>
        <p>Os documentos foram enviados em anexo.</p>
      `;
    } else if (cnpj) {
      // Formulário CNPJ
      emailBody += `
        <p><strong>CNPJ:</strong> ${cnpj}</p>
        <p><strong>Nome do sócio ou responsável:</strong> ${responsavel}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Data videoconferência:</strong> ${dataVideo}</p>
        <p><strong>Hora videoconferência:</strong> ${horaVideo}</p>
        <hr>
        <p>Os documentos foram enviados em anexo.</p>
      `;
    } // Configura remetente e destinatários

    const sentFrom = new Sender(
      process.env.SENDER_EMAIL,
      nomeCompleto || responsavel
    );
    const recipients = [
      new Recipient(process.env.EMAIL_DESTINO, "Admin do Site"),
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, nomeCompleto || responsavel))
      .setSubject(`Novo cadastro de ${nomeCompleto || responsavel}`)
      .setHtml(emailBody)
      .setAttachments(attachments); // Envia e-mail usando MailerSend

    await mailerSend.email.send(emailParams);

    res.status(200).send("Cadastro enviado com sucesso!");
  } catch (error) {
    console.error(
      "Erro ao enviar e-mail:",
      error.body ? error.body.errors : error
    );
    res.status(500).send("Ocorreu um erro ao enviar o e-mail.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
