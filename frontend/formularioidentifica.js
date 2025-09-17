document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("section-cpf").style.display = "none";
  document.getElementById("section-cnpj").style.display = "none";
});

const btnCpf = document.getElementById("opcao-cpf");
const btnCnpj = document.getElementById("opcao-cnpj");

btnCnpj.addEventListener("click", function () {
  document.getElementById("section-cnpj").style.display = "flex";
  document.getElementById("section-cpf").style.display = "none";
});

btnCpf.addEventListener("click", function () {
  document.getElementById("section-cpf").style.display = "flex";
  document.getElementById("section-cnpj").style.display = "none";
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
