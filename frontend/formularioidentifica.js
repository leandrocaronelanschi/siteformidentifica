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

// const selectModelCertCnpj = document.getElementById("select-model-certcnpj");

// for (const modelCnpj of modelosCnpj) {
//   const optionCertCnpj = document.createElement("option");
//   selectModelCertCnpj.appendChild(optionCertCnpj);
//   optionCertCnpj.textContent = modelCnpj;
// }

const modelosCpf = [
  "e-CPF A1 - Validade: 1 ano",
  "e-CPF A3 - Validade: 3 anos",
  "e-CPF A3 - Validade: 2 anos",
  "e-CPF A3 - Validade: 1 ano",
];

// const selectModelCert = document.getElementById("select-model-cert");

// for (const modelCpf of modelosCpf) {
//   const optionCertCpf = document.createElement("option");
//   selectModelCert.appendChild(optionCertCpf);
//   optionCertCpf.textContent = modelCpf;
// }

// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("section-cpf").classList.add("oculto");
//   document.getElementById("section-cnpj").classList.add("oculto"); // Popula select de horários corretamente

const campoUf = document.getElementById("select-estado");

//---------- Select hora CNPJ ---------

//   const hora = document.getElementById("select-hora");
//   for (let i = 0; i < horarios.length; i++) {
//     const option = document.createElement("option");
//     option.value = horarios[i];
//     option.textContent = horarios[i];
//     hora.appendChild(option);
//   }
// });

//------------Select hora CPF ------------

// const selectHora = document.getElementById("select-hora-cpf");

// for (const horas of horarios) {
//   const optionHora = document.createElement("option");
//   selectHora.appendChild(optionHora);
//   optionHora.textContent = horas;
// }

const btnCpf = document.getElementById("opcao-cpf");
const btnCnpj = document.getElementById("opcao-cnpj");

btnCnpj.addEventListener("click", function () {
  document.getElementById("section-cnpj").classList.remove("oculto");
  document.getElementById("section-cpf").classList.add("oculto");
  const containerSection = document.getElementById("container-section");

  const margemFooter = document.getElementById("container-footer");
});

// btnCpf.addEventListener("click", function () {
//   document.getElementById("section-cpf").classList.remove("oculto");
//   document.getElementById("section-cnpj").classList.add("oculto");
//   const containerSection = document.getElementById("container-section");

//   const margemFooter = document.getElementById("container-footer");
// });

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
// document.getElementById("form-cpf").addEventListener("submit", function (e) {
//   e.preventDefault();
//   enviarFormulario(e.target);
// });

// Evento submit CNPJ
// document.getElementById("form-cnpj").addEventListener("submit", function (e) {
//   e.preventDefault();
//   enviarFormulario(e.target);
// });

//--------------- Inclusão de Mascaras para os campos cnpj, cpf, tel etc..

//---- Campo cnpj ------

// const campoInput = document.getElementById("input-cnpj");
// const maskCampoInput = { mask: "00.000.000/0000-00" };
// IMask(campoInput, maskCampoInput);

// //----- Campo Telefone -----

// const campoTel = document.getElementById("input-tel");
// const maskCampoTel = { mask: "(00) 00000-0000" };
// IMask(campoTel, maskCampoTel);

// //----- Campo CPF ------

// const campoCpf = document.getElementById("input-cpf-ecpf");
// const maskCampoCpf = { mask: "000.000.000-00" };
// IMask(campoCpf, maskCampoCpf);

// //----- Campo Telefone CPF -----

// const campoTelCpf = document.getElementById("input-tel-ecpf");
// const maskCampoTelCpf = { mask: "(00) 00000-0000" };
// IMask(campoTelCpf, maskCampoTelCpf);

// //------ Inclusão da data atual no campo "Data"----------

// const data = new Date();
// const ano = data.getFullYear();
// const mes = String(data.getMonth() + 1).padStart(2, "0");
// const dia = String(data.getDate()).padStart(2, "0");
// const dataAtual = `${ano}-${mes}-${dia}`;

// // Data formulario CNPJ -----
// const campoData = document.getElementById("input-data-video");
// campoData.value = dataAtual;

// // Data formulario CPF ------

// const campoDataCpf = document.getElementById("input-datavideo-cpf");
// campoDataCpf.value = dataAtual;

// async function buscarCep(cep) {
//   const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

//   if (!response.ok) {
//     throw new Error(
//       `Erro HTTP! Status: ${response.status} - ${response.statusText}`
//     );
//   }

//   const data = await response.json();

//   if (data.erro) {
//     throw new Error("CEP não encontrado pela ViaCEP");
//   }

//   return data;
// }

// //-------- Teste para exibir os dados da Api ------

// const cepParaBuscar = 29066050;

// async function exibirCep() {
//   try {
//     const dadosDoCep = await buscarCep(cepParaBuscar);
//     console.log("Dados do CEP:", dadosDoCep);
//     console.log(dadosDoCep.logradouro);
//     console.log(dadosDoCep.bairro);
//   } catch (error) {
//     console.error("Erro na busca:", error.mensage);
//   }
// }

// exibirCep();

// const campoCep = document.getElementById("input-cep-ecpf");

// campoCep.addEventListener("blur", async () => {
//   const valorCampoCep = campoCep.value;

//   try {
//     const data = await buscarCep(valorCampoCep);

//     const campoRua = document.getElementById("input-rua-ecpf");
//     const campoBairro = document.getElementById("inputecpf-bairro");
//     const campoCidade = document.getElementById("inputecpf-cidade");
//     const campoUf = document.getElementById("select-estado");

//     campoRua.value = data.logradouro;
//     campoBairro.value = data.bairro;
//     campoCidade.value = data.localidade;
//     campoUf.value = data.uf;
//   } catch (error) {}
// });

const containerForms = document.getElementById("model-forms");

async function carregarFormulario(caminhoArquivo) {
  try {
    const response = await fetch(caminhoArquivo);

    if (!response.ok) {
      throw new Error(
        `Não foi possível carregar o formulário: ${response.status}`
      );
    }
    return await response.text();
  } catch (error) {
    console.error("Erro ao buscar o formulário:", error);
    return null;
  }
}

// const xyz = `<section id="section-cpf" class="oculto">
//         <form id="form-cpf" enctype="multipart/form-data">
//           <div id="container-dados-cpf">
//             <h1 id="titulo1-section-cpf">
//               Preencha os dados abaixo e envie os dos documentos solicitados.
//             </h1>

//             <div id="container-model-cert">
//               <label id="label-model-cert" for="select-model-cert"
//                 >Escolha o modelo do Certificado Digital</label
//               >
//               <select id="select-model-cert" name="modelo-cert-cpf"></select>
//             </div>

//             <fieldset id="container-datavideo-cpf">
//               <legend for="input-datavideo-cpf" id="label-datavideo-cpf">
//                 Escolha a data e horário da videoconferência
//               </legend>
//               <div id="container-data-hora-cpf">
//                 <input
//                   type="date"
//                   name="data-video-cpf"
//                   id="input-datavideo-cpf"
//                   required
//                 />
//                 <div id="container-label-horas-cpf">
//                   <select
//                     name="hora-video-cpf"
//                     id="select-hora-cpf"
//                     required
//                   ></select>
//                   <label for="select-hora-cpf" id="label-hora-cpf">Horas</label>
//                 </div>
//               </div>
//             </fieldset>

//             <div id="containerecpf-nome-cpf">
//               <div id="container-nome-ecpf">
//                 <label for="input-nome-ecpf" id="label-nome-ecpf"
//                   >Nome Completo:</label
//                 >
//                 <input
//                   id="input-nome-ecpf"
//                   type="text"
//                   name="nomeCompleto"
//                   placeholder="Digite seu nome completo"
//                   autofocus
//                   required
//                   autocomplete="name"
//                 />
//               </div>
//               <div id="container-cpf-ecpf">
//                 <label for="input-cpf-ecpf" id="label-cpf-ecpf">CPF:</label>
//                 <input
//                   class="no-spinner"
//                   id="input-cpf-ecpf"
//                   type="text"
//                   name="cpf"
//                   placeholder="000.000.000-00"
//                   required
//                 />
//               </div>
//             </div>

//             <div id="containerecpf-tel-email">
//               <div id="container-telefone-ecpf">
//                 <label for="input-tel-ecpf" id="label-tel-ecpf"
//                   >Telefone:</label
//                 >
//                 <input
//                   type="tel"
//                   name="telefone"
//                   id="input-tel-ecpf"
//                   placeholder="(00) 00000-0000"
//                   required
//                 />
//               </div>
//               <div id="container-email-ecpf">
//                 <label for="input-email-ecpf" id="label-email-ecpf"
//                   >E-mail:</label
//                 >
//                 <input
//                   type="email"
//                   name="email-cpf"
//                   id="input-email-ecpf"
//                   placeholder="exemplo@exemplo.com"
//                   required
//                 />
//               </div>
//             </div>

//             <div id="containerecpf-cep-rua-numero-ecpf">
//               <div id="containerecpf-cep">
//                 <label for="input-cep-ecpf" id="label-cep-ecpf">CEP:</label>
//                 <input
//                   type="number"
//                   name="cep"
//                   id="input-cep-ecpf"
//                   class="no-spinner"
//                   placeholder="0000-000"
//                   required
//                 />
//               </div>
//               <div id="container-rua-ecpf">
//                 <label for="input-rua-ecpf" id="label-rua">Nome da rua:</label>
//                 <input
//                   type="text"
//                   name="rua"
//                   id="input-rua-ecpf"
//                   placeholder="Ex: Rua Sabiá"
//                   required
//                 />
//               </div>
//               <div id="container-numero-ecpf">
//                 <label for="input-numero-ecpf" id="label-numero">Número</label>
//                 <input
//                   type="number"
//                   name="numero"
//                   id="input-numero-ecpf"
//                   placeholder="Ex: 123"
//                   required
//                 />
//               </div>
//             </div>

//             <div id="containerecpf-bairro-cidade-uf">
//               <div id="containerecpf-bairro">
//                 <label for="inputecpf-bairro" id="label-bairro">Bairro:</label>
//                 <input
//                   type="text"
//                   name="bairro"
//                   id="inputecpf-bairro"
//                   placeholder="Ex: Centro"
//                   required
//                 />
//               </div>

//               <div id="containerecpf-cidade">
//                 <label for="inputecpf-cidade" id="label-cidade">Cidade:</label>
//                 <input
//                   type="text"
//                   name="cidade"
//                   id="inputecpf-cidade"
//                   placeholder="Ex: São Paulo"
//                   required
//                 />
//               </div>

//               <div id="containerecpf-estado">
//                 <label for="select-estado" id="label-estado">UF:</label>
//                 <input type="text" name="estado" id="select-estado" placeholder="SP"></input>
//               </div>
//             </div>

//             <div id="container-cnh-ecpf">
//               <label for="input-cnh-ecpf" id="label-cnh-ecpf"
//                 >Envie sua CNH ou RG:</label
//               >
//               <input type="file" name="cnh" id="input-cnh-ecpf" required />
//             </div>
//           </div>
//           <button type="submit" id="btn-enviar2">Enviar dados</button>
//         </form>
//       </section>`;

btnCpf.addEventListener("click", async function () {
  containerForms.innerHTML = "";

  const caminhoArquivoCpf = "./formCpf.html";

  const responseForm = await carregarFormulario(caminhoArquivoCpf);

  if (responseForm) {
    containerForms.innerHTML = responseForm;
  } else {
    containerForms.innerHTML = "Não foi possível carregar o formulário.";
  }
});

// btnCpf.addEventListener("click", function () {
//   containerForms.innerHTML = "";
//   containerForms.innerHTML = xyz;
// });
