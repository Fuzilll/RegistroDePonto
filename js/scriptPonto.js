import { database, storage } from '../config/firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";

document.getElementById('btnRegistrarEntrada').addEventListener('click', () => {
    registrarPonto('entrada');
});
document.getElementById('btnRegistrarSaida').addEventListener('click', () => {
    registrarPonto('saida');
});

function registrarPonto(tipoRegistro) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            enviarDadosParaFirebase(tipoRegistro, latitude, longitude);
        }, (error) => {
            console.error('Erro ao obter localização: ', error);
            alert('Não foi possível obter sua localização. Por favor, tente novamente.');
        });
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }
}

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase(tipoRegistro, latitude, longitude) {
    const nomeFuncionario = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = ref(storage, 'imagens/' + imagem.name);
        uploadBytes(storageRef, imagem).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                const dados = {
                    nomeFuncionario: nomeFuncionario,
                    matricula: matricula,
                    data: data,
                    hora: hora,
                    tipo: tipoRegistro, // Identifica se é Entrada ou Saída
                    imagemURL: downloadURL, // Salva a URL da imagem
                    latitude: latitude, // Salva a latitude
                    longitude: longitude // Salva a longitude
                };

                console.log(dados); // Log para verificar os dados antes do envio

                // Determina o caminho no banco de dados Firebase com base no tipo de registro
                let path = '';
                if (tipoRegistro === 'entrada') {
                    path = 'registrosDeEntrada';
                } else if (tipoRegistro === 'saida') {
                    path = 'registrosDeSaida';
                }

                // Salva os dados no Firebase
                push(ref(database, path), dados)
                    .then(() => {
                        alert(`Registro de ${tipoRegistro} enviado com sucesso!`);
                        // Limpar campos após envio
                        document.getElementById('nome').value = '';
                        document.getElementById('matricula').value = '';
                        document.getElementById('data').value = '';
                        document.getElementById('hora').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch((error) => {
                        console.error(`Erro ao enviar o registro de ${tipoRegistro}: `, error);
                    });
            });
        }).catch((error) => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}
