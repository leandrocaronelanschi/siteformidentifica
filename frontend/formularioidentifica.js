document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("section-cpf").classList.add("oculto");
  document.getElementById("section-cnpj").classList.add("oculto"); // Popula select de horários corretamente

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

  const hora = document.getElementById("select-hora");
  for (let i = 0; i < horarios.length; i++) {
    const option = document.createElement("option");
    option.value = horarios[i];
    option.textContent = horarios[i];
    hora.appendChild(option);
  }
});

const btnCpf = document.getElementById("opcao-cpf");
const btnCnpj = document.getElementById("opcao-cnpj");

btnCnpj.addEventListener("click", function () {
  document.getElementById("section-cnpj").classList.remove("oculto");
  document.getElementById("section-cpf").classList.add("oculto");
});

btnCpf.addEventListener("click", function () {
  document.getElementById("section-cpf").classList.remove("oculto");
  document.getElementById("section-cnpj").classList.add("oculto");
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
