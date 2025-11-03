const modelosCnpj = [
  "e-CNPJ A1 - Validade: 1 ano",
  "e-CNPJ A3 - Validade: 3 anos",
  "e-CNPJ A3 - Validade: 2 anos",
  "e-CNPJ A3 - Validade: 1 ano",
];

const horarios = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const selectModelCertCnpj = document.getElementById("select-model-certcnpj");

for (const modelCnpj of modelosCnpj) {
  const optionCertCnpj = document.createElement("option");
  selectModelCertCnpj.appendChild(optionCertCnpj);
  optionCertCnpj.textContent = modelCnpj;
}

const modelosCpf = [
  "e-CPF A1 - Validade: 1 ano",
  "e-CPF A3 - Validade: 3 anos",
  "e-CPF A3 - Validade: 2 anos",
  "e-CPF A3 - Validade: 1 ano",
];

const selectModelCert = document.getElementById("select-model-cert");

for (const modelCpf of modelosCpf) {
  const optionCertCpf = document.createElement("option");
  selectModelCert.appendChild(optionCertCpf);
  optionCertCpf.textContent = modelCpf;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("section-cpf").classList.add("oculto");
  document.getElementById("section-cnpj").classList.add("oculto"); // Popula select de horários corretamente

  const estadosBr = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const campoUf = document.getElementById("select-estado");

  for (const uf of estadosBr) {
    const optionUf = document.createElement("option");
    campoUf.appendChild(optionUf);
    optionUf.textContent = uf;
  }

  //---------- Select hora CNPJ ---------

  const hora = document.getElementById("select-hora");
  for (let i = 0; i < horarios.length; i++) {
    const option = document.createElement("option");
    option.value = horarios[i];
    option.textContent = horarios[i];
    hora.appendChild(option);
  }
});

//------------Select hora CPF ------------

const selectHora = document.getElementById("select-hora-cpf");

for (const horas of horarios) {
  const optionHora = document.createElement("option");
  selectHora.appendChild(optionHora);
  optionHora.textContent = horas;
}

const btnCpf = document.getElementById("opcao-cpf");
const btnCnpj = document.getElementById("opcao-cnpj");

btnCnpj.addEventListener("click", function () {
  document.getElementById("section-cnpj").classList.remove("oculto");
  document.getElementById("section-cpf").classList.add("oculto");
  const containerSection = document.getElementById("container-section");
  // containerSection.style.marginTop = "2.5em";

  const margemFooter = document.getElementById("container-footer");
  // margemFooter.style.marginTop = "5rem";
});

btnCpf.addEventListener("click", function () {
  document.getElementById("section-cpf").classList.remove("oculto");
  document.getElementById("section-cnpj").classList.add("oculto");
  const containerSection = document.getElementById("container-section");
  // containerSection.style.marginTop = "5rem";

  const margemFooter = document.getElementById("container-footer");
  // margemFooter.style.marginTop = "5rem";
});

// Função para envio via fetch usando FormData
async function enviarFormulario(formElement) {
  try {
    const formData = new FormData(formElement);
    const response = await fetch("http://localhost:3000/enviar-email", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Cadastro enviado com sucesso!");
      formElement.reset();
    } else {
      alert("Erro ao enviar cadastro. Tente novamente.");
    }
  } catch (error) {
    alert("Erro ao enviar cadastro: " + error.message);
  }
}

// Evento submit CPF
document.getElementById("form-cpf").addEventListener("submit", function (e) {
  e.preventDefault();
  enviarFormulario(e.target);
});

// Evento submit CNPJ
document.getElementById("form-cnpj").addEventListener("submit", function (e) {
  e.preventDefault();
  enviarFormulario(e.target);
});

//--------------- Inclusão de Mascaras para os campos cnpj, cpf, tel etc..

//---- Campo cnpj ------

const campoInput = document.getElementById("input-cnpj");
const maskCampoInput = { mask: "00.000.000/0000-00" };
IMask(campoInput, maskCampoInput);

//----- Campo Telefone -----

const campoTel = document.getElementById("input-tel");
const maskCampoTel = { mask: "(00) 00000-0000" };
IMask(campoTel, maskCampoTel);

//---- Campo e-mail -------

// const campoEmail = document.getElementById("input-email");
// const maskCampoEmail = { mask: /^\S*\S*$/ };
// IMask(campoEmail, maskCampoEmail);

//----- Campo CPF ------

const campoCpf = document.getElementById("input-cpf-ecpf");
const maskCampoCpf = { mask: "000.000.000-00" };
IMask(campoCpf, maskCampoCpf);

//----- Campo Telefone CPF -----

const campoTelCpf = document.getElementById("input-tel-ecpf");
const maskCampoTelCpf = { mask: "(00) 00000-0000" };
IMask(campoTelCpf, maskCampoTelCpf);

//-------Campo CEP ----------------
// const campoCepCpf = document.getElementById("input-cep-ecpf");
// const maskCampoCepCpf = { mask: "00000-000" };
// IMask(campoCepCpf, maskCampoCepCpf);

//------ Inclusão da data atual no campo "Data"----------

const data = new Date();
const ano = data.getFullYear();
const mes = String(data.getMonth() + 1).padStart(2, "0");
const dia = String(data.getDate()).padStart(2, "0");
const dataAtual = `${ano}-${mes}-${dia}`;

// Data formulario CNPJ -----
const campoData = document.getElementById("input-data-video");
campoData.value = dataAtual;

// Data formulario CPF ------

const campoDataCpf = document.getElementById("input-datavideo-cpf");
campoDataCpf.value = dataAtual;
