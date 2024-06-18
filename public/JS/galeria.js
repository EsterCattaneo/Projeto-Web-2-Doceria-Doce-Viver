import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpBnCkpajOWyVap7A02-KqhLTNI7sZJLA",
    authDomain: "doce-viver.firebaseapp.com",
    databaseURL: "https://doce-viver-default-rtdb.firebaseio.com",
    projectId: "doce-viver",
    storageBucket: "doce-viver.appspot.com",
    messagingSenderId: "864856783042",
    appId: "1:864856783042:web:43f8e1a26b1364da60e35b",
    measurementId: "G-DNR3HEP91P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

//Card 1
document.addEventListener('DOMContentLoaded', function() {
    const sendMessageButton1 = document.getElementById('sendMessageButton1');
    const commentInput1 = document.getElementById('commentInput1');
    const likeButtons = document.querySelectorAll('.like-button');
    
    const messagesRef = ref(database, 'comments/card1'); // Verifique o caminho correto no banco de dados

    sendMessageButton1.addEventListener('click', function(event) {
        event.preventDefault();

        const comment = commentInput1.value.trim();

        if (comment) {
            push(messagesRef, {
                comment: comment,
                timestamp: new Date().toISOString()
            }).then(() => {
                alert('Mensagem enviada com sucesso!');
                commentInput1.value = '';
            }).catch((error) => {
                console.error('Erro ao enviar comentário: ', error);
                alert('Erro ao enviar comentário. Tente novamente.');
            });
        } else {
            alert('Por favor, preencha o campo de comentário.');
        }
    });
    
});
document.addEventListener('DOMContentLoaded', function() {
    const likeButton1 = document.getElementById('likeButton1');
    const likeCount1 = document.getElementById('likeCount1');

    // Função para atualizar a contagem de likes no banco de dados
    const updateLikeCount = (newCount) => {
        const cardRef = ref(database, 'likes/card1');
        set(cardRef, {
            count: newCount
        }).catch(error => {
            console.error('Erro ao atualizar contagem de likes no banco de dados: ', error);
        });
    };

    // Adiciona o listener para o botão de curtir
    likeButton1.addEventListener('click', function() {
        // Obtém o contador atual de likes
        let currentCount = parseInt(likeCount1.textContent);
        
        // Incrementa o contador
        currentCount++;

        // Atualiza a interface com o novo valor
        likeCount1.textContent = currentCount;

        // Atualiza a contagem no banco de dados
        updateLikeCount(currentCount);
    });
});


//Card 2
document.addEventListener('DOMContentLoaded', function() {
    const sendMessageButton2 = document.getElementById('sendMessageButton2');
    const commentInput2 = document.getElementById('commentInput2');

    const messagesRef = ref(database, 'comments/card2'); // Verifique o caminho correto no banco de dados

    sendMessageButton2.addEventListener('click', function(event) {
        event.preventDefault();

        const comment = commentInput2.value.trim();

        if (comment) {
            push(messagesRef, {
                comment: comment,
                timestamp: new Date().toISOString()
            }).then(() => {
                alert('Mensagem enviada com sucesso!');
                commentInput2.value = '';
            }).catch((error) => {
                console.error('Erro ao enviar comentário: ', error);
                alert('Erro ao enviar comentário. Tente novamente.');
            });
        } else {
            alert('Por favor, preencha o campo de comentário.');
        }
    });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const likeButton2 = document.getElementById('likeButton2');
        const likeCount2 = document.getElementById('likeCount2');
    
        // Função para atualizar a contagem de likes no banco de dados
        const updateLikeCount = (newCount) => {
            const cardRef = ref(database, 'likes/card2');
            set(cardRef, {
                count: newCount
            }).catch(error => {
                console.error('Erro ao atualizar contagem de likes no banco de dados: ', error);
            });
        };
    
        // Adiciona o listener para o botão de curtir
        likeButton2.addEventListener('click', function() {
            // Obtém o contador atual de likes
            let currentCount = parseInt(likeCount2.textContent);
            
            // Incrementa o contador
            currentCount++;
    
            // Atualiza a interface com o novo valor
            likeCount2.textContent = currentCount;
    
            // Atualiza a contagem no banco de dados
            updateLikeCount(currentCount);
        });
    });
    
//Card 3
document.addEventListener('DOMContentLoaded', function() {
    const sendMessageButton3 = document.getElementById('sendMessageButton3');
    const commentInput3 = document.getElementById('commentInput3');

    const messagesRef = ref(database, 'comments/card3'); 

    sendMessageButton3.addEventListener('click', function(event) {
        event.preventDefault();

        const comment = commentInput3.value.trim();

        if (comment) {
            push(messagesRef, {
                comment: comment,
                timestamp: new Date().toISOString()
            }).then(() => {
                alert('Mensagem enviada com sucesso!');
                commentInput3.value = '';
            }).catch((error) => {
                console.error('Erro ao enviar comentário: ', error);
                alert('Erro ao enviar comentário. Tente novamente.');
            });
        } else {
            alert('Por favor, preencha o campo de comentário.');
        }
    });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const likeButton3 = document.getElementById('likeButton3');
        const likeCount3 = document.getElementById('likeCount3');
    
        // Função para atualizar a contagem de likes no banco de dados
        const updateLikeCount = (newCount) => {
            const cardRef = ref(database, 'likes/card3');
            set(cardRef, {
                count: newCount
            }).catch(error => {
                console.error('Erro ao atualizar contagem de likes no banco de dados: ', error);
            });
        };
    
        // Adiciona o listener para o botão de curtir
        likeButton3.addEventListener('click', function() {
            // Obtém o contador atual de likes
            let currentCount = parseInt(likeCount3.textContent);
            
            // Incrementa o contador
            currentCount++;
    
            // Atualiza a interface com o novo valor
            likeCount3.textContent = currentCount;
    
            // Atualiza a contagem no banco de dados
            updateLikeCount(currentCount);
        });
    });
    
    
