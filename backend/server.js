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
// As chaves de arquivos (cnh, cartao-cnpj, contrato-social) estão corretas.
const uploadFields = upload.fields([
  { name: "cnh", maxCount: 1 },
  { name: "cartao-cnpj", maxCount: 1 },
  { name: "contrato-social", maxCount: 10 },
]);

app.post("/enviar-email", uploadFields, async (req, res) => {
  try {
    // --- CORREÇÃO APLICADA AQUI: Extração de todos os campos de texto ---
    const {
      // Campos de Identificação (Comuns, mas alguns específicos)
      nomeCompleto,
      cpf,
      telefone, // Usado em ambos os formulários
      email, // Usado em ambos os formulários
      cnpj,
      responsavel, // Campos de Modelo de Certificado (Chaves novas do HTML)

      "modelo-cert-cpf": modeloCertCpf,
      "modelo-cert-cnpj": modeloCertCnpj, // Campos de Videoconferência (Tratados separadamente para CPF e CNPJ)

      "data-video-cpf": dataVideoCpf,
      "hora-video-cpf": horaVideoCpf,
      "data-video": dataVideoCnpj, // Data CNPJ
      "hora-video": horaVideoCnpj, // Hora CNPJ // Campos de Endereço (Apenas CPF no HTML)

      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
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
    });

    let emailBody = `<h1>Novo Cadastro - Identifica Express</h1><hr>`;
    let subjectName = "Novo Cadastro";
    let replyToName = ""; // Verifica qual formulário foi enviado (o campo CPF ou CNPJ estará preenchido)

    if (cpf) {
      // Formulário e-CPF
      subjectName = `[E-CPF] Novo Cadastro: ${nomeCompleto}`;
      replyToName = nomeCompleto;
      emailBody += `
        <h2>Dados Pessoa Física (e-CPF)</h2>
        <p><strong>Modelo do Certificado:</strong> ${modeloCertCpf || "N/A"}</p>
        <p><strong>Nome Completo:</strong> ${nomeCompleto}</p>
        <p><strong>CPF:</strong> ${cpf}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <hr>
        <h3>Videoconferência (e-CPF)</h3>
        <p><strong>Data:</strong> ${dataVideoCpf || "N/A"}</p>
        <p><strong>Hora:</strong> ${horaVideoCpf || "N/A"}</p>
        <hr>
        <h3>Endereço</h3>
        <p><strong>CEP:</strong> ${cep}</p>
        <p><strong>Rua:</strong> ${rua}</p>
        <p><strong>Número:</strong> ${numero}</p>
        <p><strong>Bairro:</strong> ${bairro || "N/A"}</p>
        <p><strong>Cidade:</strong> ${cidade || "N/A"}</p>
        <p><strong>Estado (UF):</strong> ${estado || "N/A"}</p>
        <hr>
        <p>Os documentos (CNH/RG) foram enviados em anexo.</p>
      `;
    } else if (cnpj) {
      // Formulário e-CNPJ
      subjectName = `[E-CNPJ] Novo Cadastro: ${responsavel}`;
      replyToName = responsavel;
      emailBody += `
        <h2>Dados Empresa (e-CNPJ)</h2>
        <p><strong>Modelo do Certificado:</strong> ${
        modeloCertCnpj || "N/A"
      }</p>
        <p><strong>CNPJ:</strong> ${cnpj}</p>
        <p><strong>Nome do sócio ou responsável:</strong> ${responsavel}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <hr>
        <h3>Videoconferência (e-CNPJ)</h3>
        <p><strong>Data:</strong> ${dataVideoCnpj || "N/A"}</p>
        <p><strong>Hora:</strong> ${horaVideoCnpj || "N/A"}</p>
        <hr>
        <p>Os documentos foram enviados em anexo (CNH/RG, Cartão CNPJ, Contrato Social).</p>
      `;
    } else {
      // Caso o request chegue sem identificação de CPF ou CNPJ
      return res
        .status(400)
        .send("Dados incompletos ou tipo de formulário inválido.");
    } // Configura remetente e destinatários

    const sentFrom = new Sender(
      process.env.SENDER_EMAIL,
      replyToName || "Solicitação Site"
    );
    const recipients = [
      new Recipient(process.env.EMAIL_DESTINO, "Admin do Site"),
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, replyToName))
      .setSubject(subjectName)
      .setHtml(emailBody)
      .setAttachments(attachments);

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
