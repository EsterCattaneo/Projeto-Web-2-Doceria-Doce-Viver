 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";


 const firebaseConfig = {
     apiKey: "AIzaSyCpBnCkpajOWyVap7A02-KqhLTNI7sZJLA",
     authDomain: "doce-viver.firebaseapp.com",
     projectId: "doce-viver",
     storageBucket: "doce-viver.appspot.com",
     messagingSenderId: "864856783042",
     appId: "1:864856783042:web:43f8e1a26b1364da60e35b",
     measurementId: "G-DNR3HEP91P"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);


 // Buttons
 var authEmailPassButton = document.getElementById('authEmailPassButton');
 var authGoogleButton = document.getElementById('authGoogleButton');
 var authAnonymouslyButton = document.getElementById('authAnonymouslyButton');
 var createUserButton = document.getElementById('createUserButton');
 var logOutButton = document.getElementById('logOutButton');


 // Inputs
 var emailInput = document.getElementById('emailInput');
 var passwordInput = document.getElementById('passwordInput');


 // Displays
 var displayName = document.getElementById('displayName');


 // Criar novo usuário
 createUserButton.addEventListener('click', function () {
     firebase
         .auth()
         .createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
         .then(function () {
             alert('Bem vindo ' + emailInput.value);
         })
         .catch(function (error) {
             console.error(error.code);
             console.error(error.message);
             alert('Falha ao cadastrar, verifique o erro no console.')
         });
 });


 // Autenticar com E-mail e Senha
 authEmailPassButton.addEventListener('click', function () {
    firebase
        .auth()
        .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
        .then(function (result) {
            var userEmail = result.user.email;

            sessionStorage.setItem("autenticado", true);
            sessionStorage.setItem("usuario", userEmail);
            displayName.innerText = 'Bem vindo, ' + userEmail;
            alert('Autenticado ' + userEmail);

            // Verifica se o email é de administrador
            if (userEmail === "adm@doceviver.com") {
                // Se for o email de administrador, redireciona para cadastrarMenu.html
                window.location.href = 'cadastroMenu.html';
            } else {
                // Caso contrário, redireciona para pedido.html (ou outra página de usuário comum)
                window.location.href = 'pedido.html';
            }
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar, verifique o erro no console.');
        });
});

 // Logout
 logOutButton.addEventListener('click', function () {
     firebase
         .auth()
         .signOut()
         .then(function () {
             displayName.innerText = 'Você não está autenticado';
             alert('Você se deslogou');
         }, function (error) {
             console.error(error);
         });
 });


 // Autenticar Anônimo
 authAnonymouslyButton.addEventListener('click', function () {
     firebase
         .auth()
         .signInAnonymously()
         .then(function (result) {
             // console.log(result);
             displayName.innerText = 'Bem vindo, desconhecido';
             alert('Autenticado Anonimamente');

             window.location.href = 'pedido.html';
         })
         .catch(function (error) {
             console.error(error.code);
             console.error(error.message);
             alert('Falha ao autenticar, verifique o erro no console.')
         });
 });


 // Autenticar com Google
 authGoogleButton.addEventListener('click', function () {
     // Providers
     var provider = new firebase.auth.GoogleAuthProvider();
     firebase
     .auth()
     .signInWithPopup(provider)
     .then(function (result) {
             // console.log(result);
             var token = result.credential.accessToken;
             displayName.innerText = 'Bem vindo, ' + result.user.displayName;

             window.location.href = 'pedido.html';
         }).catch(function (error) {
             console.log(error);
             alert('Falha na autenticação');
         });
 });


 // Configura a persistência de autenticação para local
 firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
 .then(function() {
     // Agora, faça o login do usuário
     // Isso garante que a autenticação permaneça persistente
 })
 .catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;
     console.error("Erro ao configurar persistência de autenticação:", errorCode, errorMessage);
 });



