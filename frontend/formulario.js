
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