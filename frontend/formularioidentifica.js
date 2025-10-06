document.addEventListener("DOMContentLoaded", function () {
  // Esconda o CNPJ e o CPF (para seguir a lógica inicial do seu JS)
  document.getElementById("section-cpf").classList.add("oculto");
  document.getElementById("section-cnpj").classList.add("oculto");

  // **Ação adicional:** Clique no botão CPF para mostrar o formulário padrão ao carregar
  // document.getElementById("opcao-cpf").click();
});

const btnCpf = document.getElementById("opcao-cpf");
const btnCnpj = document.getElementById("opcao-cnpj");

btnCnpj.addEventListener("click", function () {
  // CNPJ aparece (remove a classe oculto)
  document.getElementById("section-cnpj").classList.remove("oculto");
  // CPF some (adiciona a classe oculto)
  document.getElementById("section-cpf").classList.add("oculto");
});

btnCpf.addEventListener("click", function () {
  // CPF aparece (remove a classe oculto)
  document.getElementById("section-cpf").classList.remove("oculto");
  // CNPJ some (adiciona a classe oculto)
  document.getElementById("section-cnpj").classList.add("oculto");
});

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

for (let i = 0; i <= horarios.length; i++) {
  const option = document.createElement("option");
  option.value = `option${horarios[i]}`;
  option.textContent = horarios[i];

  hora.appendChild(option);
}
