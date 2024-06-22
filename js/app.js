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

firebase.initializeApp(firebaseConfig); // Inicialize o Firebase

const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage


// Função para enviar dados para o Firebase
function enviarDadosParaFirebase(tipoRegistro) {
    const nomeFuncionario = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nomeFuncionario: nomeFuncionario,
                    matricula: matricula,
                    data: data,
                    hora: hora,
                    tipo: tipoRegistro, // Identifica se é Entrada ou Saída
                    imagemURL: downloadURL // Salva a URL da imagem
                };

                // Determina o caminho no banco de dados Firebase com base no tipo de registro
                let path = '';
                if (tipoRegistro === 'entrada') {
                    path = 'registrosDeEntrada';
                } else if (tipoRegistro === 'saida') {
                    path = 'registrosDeSaida';
                }

                // Salva os dados no Firebase
                database.ref(path).push(dados)
                    .then(() => {
                        alert(`Registro de ${tipoRegistro} enviado com sucesso!`);
                        // Limpar campos após envio
                        document.getElementById('nome').value = '';
                        document.getElementById('matricula').value = '';
                        document.getElementById('data').value = '';
                        document.getElementById('hora').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error(`Erro ao enviar o registro de ${tipoRegistro}: `, error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

// Função para consultar o histórico de ponto de um funcionário
function consultarHistoricoDePonto(nomeFuncionario) {
    const historicoRef = database.ref('registrosDeEntrada'); // Considerando apenas registros de entrada neste exemplo
    historicoRef.orderByChild('nomeFuncionario').equalTo(nomeFuncionario).once('value', snapshot => {
        const historicoPonto = document.getElementById('historicoPonto');
        historicoPonto.innerHTML = ''; // Limpar conteúdo anterior

        let encontrado = false;

        snapshot.forEach(childSnapshot => {
            const registro = childSnapshot.val();
            const item = document.createElement('div');
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



function cadastrarFuncionario() {
    const nomeFuncionario = document.getElementById('nome').value;
    const setor = document.getElementById('setor').value;
    const numeroDeMatricula = document.getElementById('numeroDeMatricula').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nomeFuncionario: nomeFuncionario,
                    setor: setor,
                    numeroDeMatricula: numeroDeMatricula,
                    imagemURL: downloadURL // Salva a URL da imagem
                };

                database.ref('registrosDeFuncionarios').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('setor').value = '';
                        document.getElementById('numeroDeMatricula').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

function consultarFuncionarioPorNome() {
    const nomeBusca = document.getElementById('nomeConsulta').value.trim().toLowerCase(); // Convertendo para minúsculas para busca case insensitive
    const funcionariosRef = database.ref('funcionarios');
    funcionariosRef.once('value', snapshot => {
        const lista = document.getElementById('listaFuncionarios');
        lista.innerHTML = ''; // Limpar lista anterior
        let encontrado = false;

        snapshot.forEach(childSnapshot => {
            const funcionario = childSnapshot.val();
            // Verifica se o nome do funcionário inclui o texto buscado
            if (funcionario.nomeFuncionario.toLowerCase().includes(nomeBusca)) {
                encontrado = true;
                const item = document.createElement('li');
                item.innerHTML = `Nome: ${funcionario.nomeFuncionario}, Setor: ${funcionario.setor}, Matrícula: ${funcionario.numeroDeMatricula}, Imagem: <img src="${funcionario.imagemURL}" alt="Imagem do Funcionário" style="width:100px; height:auto;">`;
                lista.appendChild(item);
            }
        });

        if (!encontrado) {
            lista.innerHTML = '<li>Nenhum funcionário encontrado com esse nome.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar funcionários: ', error);
    });
}


// Event listener para o botão de Registrar Entrada
document.getElementById('btnRegistrarEntrada').addEventListener('click', () => {
    enviarDadosParaFirebase('entrada');
});

// Event listener para o botão de Registrar Saída
document.getElementById('btnRegistrarSaida').addEventListener('click', () => {
    enviarDadosParaFirebase('saida');
});

// Event listener para o botão de Consultar
document.getElementById('consultar').addEventListener('click', () => {
    const nomeFuncionario = document.getElementById('nomeConsulta').value.trim().toLowerCase();
    consultarHistoricoDePonto(nomeFuncionario);
});

// Event listener para exibir o histórico de ponto ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Aqui você pode definir um funcionário específico ou deixar vazio para uma consulta inicial
    const nomeFuncionario = ''; // Deixe vazio ou substitua pelo nome do funcionário desejado
    if (nomeFuncionario) {
        consultarHistoricoDePonto(nomeFuncionario);
    }
});

// Event listener para o botão de Consultar
document.getElementById('consultar').addEventListener('click', () => {
    const nomeFuncionario = document.getElementById('nomeConsulta').value.trim().toLowerCase();
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