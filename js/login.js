import { auth } from '../config/firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

document.getElementById('login_usuario').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Login realizado com sucesso!');
            window.location.href = 'registrosDePonto1.html'; // Redirecionar para a página de registros de ponto
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Erro no login: ${errorMessage}`);
        });
});
