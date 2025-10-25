// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
// Importa Nodemailer para enviar e-mails via SMTP (Zoho)
const nodemailer = require("nodemailer");

const app = express();
// Permite que o frontend (localhost:port) se comunique com este servidor
app.use(cors());

// --- CONFIGURAÇÃO ZOHO SMTP VIA NODEMAILER ---
// Cria o Transporter usando as credenciais do Zoho Mail
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com", // Host padrão do Zoho Mail
  port: 587, // Porta padrão para STARTTLS
  secure: false, // Não usa SSL/TLS diretamente na porta 587, usa STARTTLS
  auth: {
    user: process.env.ZOHO_USER, // Seu e-mail Zoho (definido no .env)
    pass: process.env.ZOHO_PASS, // Sua senha de app ou senha padrão (definido no .env)
  },
  tls: {
    // Permite a conexão com o servidor SMTP
    rejectUnauthorized: false,
  },
});

// Configuração do Multer para arquivos em memória e limite de 15MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Configurando os campos de arquivo esperados pelo Multer
const uploadFields = upload.fields([
  { name: "cnh", maxCount: 1 },
  { name: "cartao-cnpj", maxCount: 1 },
  { name: "contrato-social", maxCount: 10 },
]);

// Rota principal de envio de formulário
app.post("/enviar-email", uploadFields, async (req, res) => {
  try {
    // Loga os dados recebidos (útil para depuração)
    console.log("--- NOVA REQUISIÇÃO ---");
    console.log("Dados de texto recebidos (req.body):", req.body);
    console.log(
      "Arquivos recebidos (req.files):",
      req.files ? Object.keys(req.files) : "Nenhum arquivo"
    ); // Extração completa de todos os campos de texto do formulário.

    // Assumimos que o campo de e-mail de AMBOS os formulários agora usa name="email".
    const {
      nomeCompleto,
      cpf,
      telefone,
      email, // Extração direta do campo padronizado
      cnpj,
      responsavel,
      "modelo-cert-cpf": modeloCertCpf,
      "modelo-cert-cnpj": modeloCertCnpj,
      "data-video-cpf": dataVideoCpf,
      "hora-video-cpf": horaVideoCpf,
      "data-video": dataVideoCnpj,
      "hora-video": horaVideoHnpj,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,
    } = req.body; // TRATAMENTO DO ERRO 400: Validação de E-mail

    if (!email || email.trim() === "") {
      return res
        .status(400)
        .send(
          "Erro 400: O campo de email está vazio. Por favor, preencha o email."
        );
    } // Acessa os arquivos enviados para anexar

    const cnhFile = req.files["cnh"] ? req.files["cnh"][0] : null;
    const cartaoCnpjFile = req.files["cartao-cnpj"]
      ? req.files["cartao-cnpj"][0]
      : null;
    const contratoSocialFiles = req.files["contrato-social"] || []; // Mapeia anexos para o formato do Nodemailer

    const nodemailerAttachments = [];

    [cnhFile, cartaoCnpjFile, ...contratoSocialFiles]
      .filter((file) => file) // Filtra arquivos nulos (ex: cartao-cnpj no form CPF)
      .forEach((file) => {
        nodemailerAttachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        });
      });

    let detailedContent = ""; // Conteúdo detalhado (comum a admin e cliente)
    let subjectName = "Novo Cadastro";
    let replyToName = "";
    let modeloCertificado = ""; // 1. Verifica qual formulário foi enviado e monta o conteúdo detalhado

    if (cpf) {
      // Formulário e-CPF
      subjectName = `[E-CPF] Novo Cadastro: ${nomeCompleto}`;
      replyToName = nomeCompleto;
      modeloCertificado = modeloCertCpf;
      detailedContent = `
                <h2>Dados Pessoa Física (e-CPF)</h2>
                <p><strong>Modelo do Certificado:</strong> ${
        modeloCertificado || "N/A"
      }</p>
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
      modeloCertificado = modeloCertCnpj;

      detailedContent = `
                <h2>Dados Empresa (e-CNPJ)</h2>
                <p><strong>Modelo do Certificado:</strong> ${
        modeloCertificado || "N/A"
      }</p>
                <p><strong>CNPJ:</strong> ${cnpj}</p>
                <p><strong>Nome do sócio ou responsável:</strong> ${responsavel}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <hr>
                <h3>Videoconferência (e-CNPJ)</h3>
                <p><strong>Data:</strong> ${dataVideoCnpj || "N/A"}</p>
                <p><strong>Hora:</strong> ${horaVideoHnpj || "N/A"}</p>
                <hr>
                <p>Os documentos foram enviados em anexo (CNH/RG, Cartão CNPJ, Contrato Social).</p>
            `;
    } else {
      // TRATAMENTO DO ERRO 400: Tipo de formulário não identificado
      return res
        .status(400)
        .send(
          "Erro 400: Tipo de formulário (CPF/CNPJ) não identificado ou dados principais faltando."
        );
    } // --- 2. Monta o corpo do Email para o ADMINISTRADOR ---

    const adminEmailBody = `
            <h1>Novo Cadastro - Identifica Express</h1>
            <hr>
            ${detailedContent}
        `; // --- 3. Monta o corpo do Email de CONFIRMAÇÃO para o CLIENTE ---

    const userEmailBody = `
            <h1>Confirmação de Recebimento - Identifica Express</h1>
            <p>Olá ${replyToName},</p>
            <p>Recebemos sua solicitação de Certificado Digital (${
      cpf ? "e-CPF" : "e-CNPJ"
    }) com sucesso. Abaixo estão os dados que você nos enviou para conferência:</p>
            <hr>
            ${detailedContent}
            <hr>
            <p>Em breve nossa equipe entrará em contato para dar seguimento ao seu processo de certificação.</p>
            <p>Atenciosamente,</p>
            <p>Equipe Identifica Express.</p>
        `; // --- 4. CONFIGURAÇÕES DE ENVIO ---

    const defaultSender = `"${replyToName || "Solicitação Site"}" <${
      process.env.ZOHO_USER
    }>`; // Configurações para o Administrador (com anexos)

    const mailOptionsAdmin = {
      from: defaultSender,
      to: process.env.EMAIL_DESTINO,
      replyTo: email,
      subject: subjectName,
      html: adminEmailBody,
      attachments: nodemailerAttachments, // Anexos vão APENAS para o Admin
    }; // Configurações para o Cliente (sem anexos)

    const mailOptionsUser = {
      from: defaultSender,
      to: email, // O e-mail do cliente
      subject: `Confirmação de Recebimento: ${modeloCertificado}`,
      html: userEmailBody,
    }; // --- 5. EXECUÇÃO DOS ENVIOS --- // Envia para o Administrador

    await transporter.sendMail(mailOptionsAdmin); // Envia a Confirmação para o Cliente
    await transporter.sendMail(mailOptionsUser);

    console.log("--- E-MAIL ENVIADO COM SUCESSO PARA ADMIN E CLIENTE ---");
    res
      .status(200)
      .send("Cadastro enviado com sucesso! Confirmação enviada por e-mail.");
  } catch (error) {
    console.error("--- ERRO FATAL AO ENVIAR E-MAIL: ---", error); // Envia a mensagem de erro detalhada, se disponível, ou uma genérica.
    res
      .status(500)
      .send("Ocorreu um erro ao enviar o e-mail: " + error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
