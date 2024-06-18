import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Configuração do Firebase
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

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', (event) => {
    let menusData = {}; // Objeto para armazenar os dados do menu

    // Função para ler os dados do Firebase
    const readData = () => {
        const menuRef = ref(database, 'Menu');
        get(menuRef).then((snapshot) => {
            if (snapshot.exists()) {
                menusData = snapshot.val();
                updateTable(); // Chamada inicial para carregar todos os itens
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error('Erro ao ler dados: ', error);
        });
    };

    // Função para atualizar a tabela com os dados lidos
    const updateTable = () => {
        const filterCategoria = document.getElementById('filtro-categoria').value; // Obtém o valor do filtro de categoria
        const ordemPreco = document.getElementById('ordem-preco').value; // Obtém a ordem de preço selecionada
        const ordemAlfabetica = document.getElementById('ordem-alfabetica').value; // Obtém a ordem alfabética selecionada

        // Converter os preços para números para ordenação correta
        const convertToNumber = (priceString) => {
            return parseFloat(priceString.replace(',', '.')); // Considerando que o preço possa estar no formato "1,00"
        };

        // Limpar tabelas antes de atualizar
        document.querySelectorAll('.table tbody').forEach((tbody) => {
            tbody.innerHTML = '';
        });

        // Filtrar e ordenar os dados
        let filteredMenus = Object.values(menusData).filter(menu => {
            return filterCategoria === 'Todos' || menu.categoria === filterCategoria;
        });

        // Ordenar por preço
        if (ordemPreco === 'asc') {
            filteredMenus.sort((a, b) => convertToNumber(a.price) - convertToNumber(b.price));
        } else if (ordemPreco === 'desc') {
            filteredMenus.sort((a, b) => convertToNumber(b.price) - convertToNumber(a.price));
        }

        // Ordenar por ordem alfabética do nome
        if (ordemAlfabetica === 'asc') {
            filteredMenus.sort((a, b) => a.name.localeCompare(b.name));
        } else if (ordemAlfabetica === 'desc') {
            filteredMenus.sort((a, b) => b.name.localeCompare(a.name));
        }

        // Atualizar a tabela com os dados ordenados e filtrados
        filteredMenus.forEach(menu => {
            const categoria = menu.categoria.toLowerCase();
            const tbody = document.querySelector(`.categoria-${categoria}`);

            let row = tbody.insertRow();
            let categoriaCell = row.insertCell(0);
            categoriaCell.textContent = menu.categoria;

            let nomeCell = row.insertCell(1);
            nomeCell.textContent = menu.name;

            let precoCell = row.insertCell(2);
            precoCell.textContent = menu.price;
        });
    };

    // Adicionar evento de mudança para o filtro de categoria
    document.getElementById('filtro-categoria').addEventListener('change', updateTable);

    // Adicionar evento de mudança para o filtro de ordenação por preço
    document.getElementById('ordem-preco').addEventListener('change', updateTable);

    // Adicionar evento de mudança para o filtro de ordenação alfabética
    document.getElementById('ordem-alfabetica').addEventListener('change', updateTable);

    // Chama a função para ler dados ao carregar a página
    readData();
});