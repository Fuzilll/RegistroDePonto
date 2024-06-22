// Configure o Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyCCAmx_AKf8a6I5IXJRxG7SGs-4ZvU28n4",
    authDomain: "registrodepontop.firebaseapp.com",
    databaseURL: "https://registrodepontop-default-rtdb.firebaseio.com",
    projectId: "registrodepontop",
    storageBucket: "registrodepontop.appspot.com",
    messagingSenderId: "756196331980",
    appId: "1:756196331980:web:cf695d748fb65d67c80d69"
};

// Inicialize o Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const storage = firebase.storage();

// Função para consultar o histórico de ponto de um funcionário
function consultarHistoricoDePonto(nomeFuncionario) {
    const historicoPonto = document.getElementById('historicoPonto');
    historicoPonto.innerHTML = ''; // Limpar conteúdo anterior

    const historicoRef = database.ref('registrosDeEntrada');
    historicoRef.orderByChild('nomeFuncionario').equalTo(nomeFuncionario).once('value', snapshot => {
        let encontrado = false;

        snapshot.forEach(childSnapshot => {
            const registro = childSnapshot.val();
            const item = document.createElement('div');
            item.classList.add('registro');
            item.innerHTML = `
                <p><strong>Data:</strong> ${registro.data}</p>
                <p><strong>Hora:</strong> ${registro.hora}</p>
                <p><strong>Matrícula:</strong> ${registro.matricula}</p>
                <p><strong>Imagem:</strong> <img src="${registro.imagemURL}" alt="Imagem do Ponto" style="width:100px; height:auto;"></p>
            `;
            historicoPonto.appendChild(item);
            encontrado = true;
        });

        if (!encontrado) {
            historicoPonto.innerHTML = '<p>Nenhum registro encontrado para o funcionário.</p>';
        }
    }).catch(error => {
        console.error('Erro ao consultar histórico de ponto: ', error);
    });
}

// Event listener para o botão de Consultar
document.getElementById('consultar').addEventListener('click', () => {
    const nomeFuncionario = document.getElementById('nomeConsulta').value.trim();
    if (nomeFuncionario !== '') {
        consultarHistoricoDePonto(nomeFuncionario);
    } else {
        alert('Por favor, digite o nome do funcionário para consultar.');
    }
});

// Event listener para o botão de Limpar
document.getElementById('limpar').addEventListener('click', () => {
    document.getElementById('nomeConsulta').value = '';
    document.getElementById('historicoPonto').innerHTML = '';
});
