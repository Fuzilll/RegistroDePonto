// Referência ao banco de dados Firebase
const database = firebase.database();

// Função para consultar registros por nome do funcionário
document.getElementById('consultar').addEventListener('click', async () => {
    const nomeFuncionario = document.getElementById('nomeConsulta').value.trim();

    if (nomeFuncionario === '') {
        alert('Por favor, insira um nome para consulta.');
        return;
    }

    try {
        const registrosDeEntradaRef = database.ref('registrosDeEntrada');
        const registrosDeSaidaRef = database.ref('registrosDeSaida');

        // Consulta registros de entrada
        const entradaSnapshot = await consultarRegistrosPorNome(registrosDeEntradaRef, nomeFuncionario, 'Entrada');
        // Consulta registros de saída
        const saidaSnapshot = await consultarRegistrosPorNome(registrosDeSaidaRef, nomeFuncionario, 'Saída');

        exibirRegistros(entradaSnapshot, saidaSnapshot);
    } catch (error) {
        console.error('Erro ao consultar registros:', error);
        alert('Erro ao consultar registros. Verifique o console para mais detalhes.');
    }
});

// Função para consultar registros por nome e tipo (entrada ou saída)
async function consultarRegistrosPorNome(ref, nomeFuncionario, tipo) {
    const consulta = ref.orderByChild('nomeFuncionario').equalTo(nomeFuncionario);
    const snapshot = await consulta.once('value');
    return snapshot;
}

// Função para exibir os registros na página HTML
function exibirRegistros(entradaSnapshot, saidaSnapshot) {
    const historicoPonto = document.getElementById('historicoPonto');
    historicoPonto.innerHTML = ''; // Limpa o conteúdo anterior

    // Exibe registros de entrada
    if (entradaSnapshot.exists()) {
        historicoPonto.innerHTML += `<h2>Registros de Entrada</h2>`;
        entradaSnapshot.forEach((childSnapshot) => {
            const registro = childSnapshot.val();
            historicoPonto.innerHTML += criarRegistroHTML(registro);
        });
    }

    // Exibe registros de saída
    if (saidaSnapshot.exists()) {
        historicoPonto.innerHTML += `<h2>Registros de Saída</h2>`;
        saidaSnapshot.forEach((childSnapshot) => {
            const registro = childSnapshot.val();
            historicoPonto.innerHTML += criarRegistroHTML(registro);
        });
    }

    // Se nenhum registro foi encontrado
    if (!entradaSnapshot.exists() && !saidaSnapshot.exists()) {
        historicoPonto.innerHTML = `<p>Nenhum registro encontrado para o funcionário ${nomeFuncionario}.</p>`;
    }
}

// Função para criar o HTML de um registro
function criarRegistroHTML(registro) {
    return `
        <div class="registro">
            <p><strong>Data:</strong> ${registro.data}</p>
            <p><strong>Hora:</strong> ${registro.hora}</p>
            <p><strong>Imagem:</strong> <br><img src="${registro.imagemURL}" alt="Imagem do registro"></p>
        </div>
    `;
}

// Limpar formulário
document.getElementById('limpar').addEventListener('click', () => {
    document.getElementById('nomeConsulta').value = '';
    document.getElementById('historicoPonto').innerHTML = '';
});
