// server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());

// --- CONFIGURAÇÃO ZOHO SMTP VIA NODEMAILER ---
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS,
  },
  tls: {
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
    );

    // Extração e Renomeação de campos:
    const {
      nomeCompleto,
      cpf,
      cnpj,
      responsavel,
      cep,
      rua,
      numero,
      bairro,
      cidade,
      estado,

      // Campos Renomeados:
      "email-cpf": emailCpf,
      "email-cnpj": emailCnpj,
      telefone: telefoneCpf, // name="telefone" no formulário e-CPF
      "telefone-cnpj": telefoneCnpj, // name="telefone-cnpj" no formulário e-CNPJ (CORRIGIDO no HTML)

      "modelo-cert-cpf": modeloCertCpf,
      "modelo-cert-cnpj": modeloCertCnpj,
      "data-video-cpf": dataVideoCpf,
      "hora-video-cpf": horaVideoCpf,
      "data-video": dataVideoCnpj,
      "hora-video": horaVideoHnpj,
    } = req.body;

    // Variáveis unificadas para uso na lógica de e-mail:
    let email;
    let telefone;
    let detailedContent = "";
    let subjectName = "Novo Cadastro";
    let replyToName = "";
    let modeloCertificado = "";
    let formType;

    // Limpa e valida os campos principais (melhora a identificação do formulário)
    const cleanCpf = cpf ? cpf.trim() : null;
    const cleanCnpj = cnpj ? cnpj.trim() : null;

    // --- 1. Verifica qual formulário foi enviado e monta o conteúdo detalhado ---

    if (cleanCpf) {
      // Formulário e-CPF
      formType = "e-CPF";
      email = emailCpf;
      telefone = telefoneCpf; // Usa o telefone do CPF
      subjectName = `[E-CPF] Novo Cadastro: ${nomeCompleto}`;
      replyToName = nomeCompleto;
      modeloCertificado = modeloCertCpf;

      detailedContent = `
        <h2>Dados Pessoa Física (e-CPF)</h2>
        <p><strong>Modelo do Certificado:</strong> ${
          modeloCertificado || "N/A"
        }</p>
        <p><strong>Nome Completo:</strong> ${nomeCompleto}</p>
        <p><strong>CPF:</strong> ${cleanCpf}</p>
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
    } else if (cleanCnpj) {
      // Formulário e-CNPJ
      formType = "e-CNPJ";
      email = emailCnpj;
      telefone = telefoneCnpj; // Usa o telefone do CNPJ
      subjectName = `[E-CNPJ] Novo Cadastro: ${responsavel}`;
      replyToName = responsavel;
      modeloCertificado = modeloCertCnpj;

      detailedContent = `
        <h2>Dados Empresa (e-CNPJ)</h2>
        <p><strong>Modelo do Certificado:</strong> ${
          modeloCertificado || "N/A"
        }</p>
        <p><strong>CNPJ:</strong> ${cleanCnpj}</p>
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
      // Tipo de formulário não identificado (Dispara 400 se nenhum dado principal foi enviado)
      console.error("Dados que levaram ao 400 (req.body):", req.body);
      return res
        .status(400)
        .send(
          "Erro 400: Tipo de formulário (CPF/CNPJ) não identificado. Dados principais (CPF/CNPJ) faltando."
        );
    }

    // TRATAMENTO DO ERRO 400: Validação de E-mail (Usando a variável 'email' unificada)
    if (!email || email.trim() === "") {
      return res
        .status(400)
        .send(
          "Erro 400: O campo de email está vazio. Por favor, preencha o email."
        );
    }

    // Acessa os arquivos enviados para anexar
    const cnhFile = req.files["cnh"] ? req.files["cnh"][0] : null;
    const cartaoCnpjFile = req.files["cartao-cnpj"]
      ? req.files["cartao-cnpj"][0]
      : null;
    const contratoSocialFiles = req.files["contrato-social"] || [];

    // Mapeia anexos para o formato do Nodemailer
    const nodemailerAttachments = [];

    [cnhFile, cartaoCnpjFile, ...contratoSocialFiles]
      .filter((file) => file) // Filtra arquivos nulos
      .forEach((file) => {
        nodemailerAttachments.push({
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        });
      });

    // --- 2. Monta o corpo do Email para o ADMINISTRADOR ---
    const adminEmailBody = `
      <h1>Novo Cadastro - Identifica Express</h1>
      <hr>
      ${detailedContent}
    `;

    // --- 3. Monta o corpo do Email de CONFIRMAÇÃO para o CLIENTE ---
    const userEmailBody = `
      <h1>Confirmação de Recebimento - Identifica Express</h1>
      <p>Olá ${replyToName},</p>
      <p>Recebemos sua solicitação de Certificado Digital (${formType}) com sucesso. Abaixo estão os dados que você nos enviou para conferência:</p>
      <hr>
      ${detailedContent}
      <hr>
      <p>Em breve nossa equipe entrará em contato para dar seguimento ao seu processo de certificação.</p>
      <p>Atenciosamente,</p>
      <p>Equipe Identifica Express.</p>
    `;

    // --- 4. CONFIGURAÇÕES DE ENVIOS ---
    const defaultSender = `"${replyToName || "Solicitação Site"}" <${
      process.env.ZOHO_USER
    }>`;

    // Configurações para o Administrador (com anexos)
    const mailOptionsAdmin = {
      from: defaultSender,
      to: process.env.EMAIL_DESTINO,
      replyTo: email,
      subject: subjectName,
      html: adminEmailBody,
      attachments: nodemailerAttachments, // Anexos vão APENAS para o Admin
    };

    // Configurações para o Cliente (sem anexos)
    const mailOptionsUser = {
      from: defaultSender,
      to: email, // O e-mail do cliente (variável 'email' unificada)
      subject: `Confirmação de Recebimento: ${modeloCertificado}`,
      html: userEmailBody,
    };

    // --- 5. EXECUÇÃO DOS ENVIOS ---
    await transporter.sendMail(mailOptionsAdmin);
    await transporter.sendMail(mailOptionsUser);

    console.log("--- E-MAIL ENVIADO COM SUCESSO PARA ADMIN E CLIENTE ---");
    res
      .status(200)
      .send("Cadastro enviado com sucesso! Confirmação enviada por e-mail.");
  } catch (error) {
    console.error("--- ERRO FATAL AO ENVIAR E-MAIL: ---", error);
    res
      .status(500)
      .send("Ocorreu um erro ao enviar o e-mail: " + error.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
