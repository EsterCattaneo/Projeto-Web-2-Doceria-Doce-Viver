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

// Wait for the DOM to be fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form and its fields
    const sendMessageButton = document.getElementById('sendMessageButton');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const messageInput = document.getElementById('messageInput');

    // Get a reference to the messages node in the database
    const messagesRef = ref(database, 'contactUs'); // Change 'messages' to the path where you want to store messages

    // Add an event listener to the send message button
    sendMessageButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the values from the form fields
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const message = messageInput.value.trim();

        // Check if all fields are filled
        if (name && email && phone && message) {
            // Push a new message to the database
            push(messagesRef, {
                name: name,
                email: email,
                phone: phone,
                message: message,
                timestamp: new Date().toISOString()
            }).then(() => {
                alert('Mensagem enviada com sucesso!');
                // Clear the form fields
                nameInput.value = '';
                emailInput.value = '';
                phoneInput.value = '';
                messageInput.value = '';
            }).catch((error) => {
                console.error('Erro ao enviar mensagem: ', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            });
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
});
