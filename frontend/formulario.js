


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