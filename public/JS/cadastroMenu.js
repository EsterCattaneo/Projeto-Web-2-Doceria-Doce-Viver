import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getDatabase, ref, push, get, set, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

// Função para ler os dados do Firebase e atualizar a tabela
function readData() {
    const menuRef = ref(database, 'Menu');
    get(menuRef).then((snapshot) => {
        if (snapshot.exists()) {
            const menusData = snapshot.val();
            updateTable(menusData); // Chama a função para atualizar a tabela com os dados lidos
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error('Erro ao ler dados: ', error);
    });
}

// Função para atualizar a tabela com os dados do cardápio
function updateTable(menusData) {
    const cardapioDiv = document.getElementById('cardapio');
    cardapioDiv.innerHTML = ''; // Limpa o conteúdo anterior

    // Criar tabelas por categoria
    const categorias = {};

    // Iterar sobre os menus
    Object.keys(menusData).forEach(key => {
        const menu = menusData[key];
        const categoria = menu.categoria.toLowerCase();

        // Criar tabela se ainda não existir para essa categoria
        if (!categorias[categoria]) {
            categorias[categoria] = document.createElement('table');
            categorias[categoria].classList.add(`categoria-${categoria}`, 'table');
            categorias[categoria].innerHTML = `
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>`;
            cardapioDiv.appendChild(categorias[categoria]);
        }

        // Adicionar linha para o menu na tabela da categoria correspondente
        const tbody = categorias[categoria].querySelector('tbody');
        let row = tbody.insertRow();
        let categoriaCell = row.insertCell(0);
        categoriaCell.textContent = menu.categoria;

        let nomeCell = row.insertCell(1);
        nomeCell.textContent = menu.name;

        let precoCell = row.insertCell(2);
        precoCell.textContent = menu.price;

        // Adicionar botões de ação (editar e excluir)
        createActionsButtons(row, key);
    });
}

// Função para criar botões de ação (editar e excluir) para cada linha da tabela
function createActionsButtons(row, key) {
    let actionsCell = row.insertCell();

    // Botão Editar
    let editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('btn', 'btn-primary', 'me-1');
    editButton.onclick = () => editItem(key);

    // Botão Excluir
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.onclick = () => deleteItem(key);

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
}

// Função para adicionar um item ao cardápio
function adicionarItem(nome, preco, categoria) {
    const menusRef = ref(database, 'Menu');
    
    push(menusRef, {
        name: nome,
        price: preco,
        categoria: categoria,
        timestamp: new Date().toISOString()
    }).then(() => {
        alert('Menu adicionado com sucesso!');
        limparFormulario();
        readData(); // Após adicionar, atualiza o cardápio
    }).catch((error) => {
        console.error('Erro ao adicionar menu: ', error);
        alert('Erro ao adicionar menu. Tente novamente.');
    });
}

// Função para limpar os campos do formulário após adicionar um item
function limparFormulario() {
    document.getElementById('nameInput').value = '';
    document.getElementById('priceInput').value = '';
    document.getElementById('categoria').value = 'Salgados'; // Voltando para o padrão 'Salgados'

    // Resetar botão do formulário para ser de adicionar
    const submitButton = document.getElementById('submitButton');
    submitButton.textContent = 'Enviar';
    submitButton.onclick = handleSubmit;
}

// Função para editar um item do cardápio
function editItem(key) {
    const menuItemRef = ref(database, `Menu/${key}`);

    // Obter os dados atuais do item do cardápio
    get(menuItemRef).then((snapshot) => {
        if (snapshot.exists()) {
            const menuItem = snapshot.val();
            // Preencher o formulário com os dados atuais para edição
            document.getElementById('nameInput').value = menuItem.name;
            document.getElementById('priceInput').value = menuItem.price;
            document.getElementById('categoria').value = menuItem.categoria;
            
            // Mostrar botão de "Salvar Edição" e esconder o botão "Enviar"
            const submitButton = document.getElementById('submitButton');
            submitButton.style.display = 'none';

            const saveEditButton = document.getElementById('saveEditButton');
            saveEditButton.style.display = 'inline-block';
            saveEditButton.onclick = () => saveEditItem(key);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error('Erro ao ler dados: ', error);
    });
}

// Função para salvar as edições de um item do cardápio
function saveEditItem(key) {
    const menuItemRef = ref(database, `Menu/${key}`);

    const nome = document.getElementById('nameInput').value.trim();
    const preco = document.getElementById('priceInput').value.trim();
    const categoria = document.getElementById('categoria').value.trim();

    if (nome && preco && categoria) {
        // Atualizar os dados no Firebase
        set(menuItemRef, {
            name: nome,
            price: preco,
            categoria: categoria,
            timestamp: new Date().toISOString()
        }).then(() => {
            alert('Menu editado com sucesso!');
            limparFormulario();
            readData(); // Atualiza o cardápio após edição
        }).catch((error) => {
            console.error('Erro ao editar menu: ', error);
            alert('Erro ao editar menu. Tente novamente.');
        });
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para excluir um item do cardápio
function deleteItem(key) {
    if (confirm('Tem certeza que deseja excluir este item do cardápio?')) {
        const menuItemRef = ref(database, `Menu/${key}`);

        remove(menuItemRef).then(() => {
            alert('Menu excluído com sucesso!');
            readData(); // Atualiza o cardápio após exclusão
        }).catch((error) => {
            console.error('Erro ao excluir menu: ', error);
            alert('Erro ao excluir menu. Tente novamente.');
        });
    }
}

// Função para lidar com a submissão do formulário
function handleSubmit(event) {
    event.preventDefault(); // Evitar a submissão padrão do formulário

    const nameInput = document.getElementById('nameInput').value.trim();
    const priceInput = document.getElementById('priceInput').value.trim();
    const categoriaInput = document.getElementById('categoria').value.trim();

    if (nameInput && priceInput && categoriaInput) {
        adicionarItem(nameInput, priceInput, categoriaInput);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Aguardar o DOM ser totalmente carregado antes de adicionar listeners
document.addEventListener('DOMContentLoaded', function() {
    const menuForm = document.getElementById('menuForm');
    const submitButton = document.getElementById('submitButton');
    
    menuForm.addEventListener('submit', handleSubmit);
    
    // Chama a função para ler dados ao carregar a página
    readData();
});