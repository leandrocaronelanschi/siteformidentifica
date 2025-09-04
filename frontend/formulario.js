
const estadosBr = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'ES', 'GO', 'MA', 'MT', 'MS', 
    'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  

for(const estados of estadosBr) {

    const elementOption = document.createElement('option');

    elementOption.value = estados;
    elementOption.text = estados;

    const selectEstados = document.getElementById('select-estado');
    selectEstados.appendChild(elementOption);

}

const form = document.getElementById('form-1');

form.addEventListener('submit', async function (formulario) {
    formulario.preventDefault();

    const formData = new FormData(form);

    try {

        const response = await fetch('http://localhost:3000/enviar-email', {
           method: 'POST',
           body: formData, 
        })


    } catch (erro) {
        alert('Erro ao enviar documentos!')
        console.error('Erro ao enviar documentos')
    }
    
})



const date = new Date();
const diaSemana = date.getDay();
const diaMes = date.getDay();
const mesAno = date.getMonth();
const anoAtual = date.getFullYear();

const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const nomeDia = dias[diaSemana]


const selectNomedia = document.getElementById('select-nome-dia');

// for (let i = 0; i < dias.length; i++) {
//     const criaoption = document.createElement('option');
//     criaoption.textContent = dias[i];
//     criaoption.className = 'option-nome-dia';
//     const valueoption = String(i);
//     criaoption.id = `option-nome-${valueoption}`
//     criaoption.value = valueoption;  
//     selectNomedia.appendChild (criaoption);
// }


console.log(`${date} - ${nomeDia} - ${diaMes} - ${mesAno} - ${anoAtual}`);

const nomeDiaSemana = new Date(document.getElementById('input-data-video').value);


console.log(nomeDiaSemana);

const horarios = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30",
    "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
    "17:30","18:00"]

    for (let i = 0; i <= horarios.length; i++) {

        const selectHora = document.getElementById('select-hora');
        const optionHora = document.createElement('option');
        optionHora.id = `option-hora-${i}`
        optionHora.value = `String(${i})`
        optionHora.textContent = horarios[i]

        selectHora.appendChild(optionHora);
    }