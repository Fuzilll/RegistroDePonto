import { auth } from '../config/firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

document.getElementById('cadastroFuncionarios').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'index.html'; // Redirecionar após cadastro bem-sucedido
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Erro no cadastro: ${errorMessage}`);
        });
});
