import { getDatabase, ref, get, push, set, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

document.addEventListener('DOMContentLoaded', (event) => {
    let menusData = {}; // Objeto para armazenar os dados do menu
    let comandaAtual = 1; // Variável para controlar o número da comanda atual
    let totalComandas = {}; // Objeto para armazenar os totais de cada comanda

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "SUA_API_KEY",
        authDomain: "doce-viver.firebaseapp.com",
        databaseURL: "https://doce-viver-default-rtdb.firebaseio.com",
        projectId: "doce-viver",
        storageBucket: "doce-viver.appspot.com",
        messagingSenderId: "SEU_SENDER_ID",
        appId: "SEU_APP_ID",
        measurementId: "SEU_MEASUREMENT_ID"
    };

    // Inicialização do Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    const readData = () => {
        const comandasRef = ref(database, 'comandas');
        get(comandasRef).then((snapshot) => {
            if (snapshot.exists()) {
                // Encontrar a última comanda cadastrada
                const comandas = snapshot.val();
                const ultimaComanda = Object.keys(comandas).length;
                comandaAtual = ultimaComanda + 1; // Próxima comanda disponível

                // Atualizar o número da comanda na interface
                document.getElementById('comanda').textContent = comandaAtual;
            } else {
                // Se não houver comandas, começar com a comanda 1 (como no estado inicial)
                comandaAtual = 1;
                document.getElementById('comanda').textContent = comandaAtual;
            }
        }).catch((error) => {
            console.error('Erro ao ler dados de comandas: ', error);
        });

        // Continuar com a leitura dos dados do menu
        const menuRef = ref(database, 'Menu');
        get(menuRef).then((snapshot) => {
            if (snapshot.exists()) {
                menusData = snapshot.val();
                updateTable(); // Chamada inicial para carregar todos os itens
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error('Erro ao ler dados do menu: ', error);
        });
    };

    const updateTable = () => {
        const filterCategoria = document.getElementById('filtro-categoria').value;
        const ordemPreco = document.getElementById('ordem-preco').value;
        const ordemAlfabetica = document.getElementById('ordem-alfabetica').value;

        const convertToNumber = (priceString) => {
            return parseFloat(priceString.replace(',', '.'));
        };

        document.querySelectorAll('.table tbody').forEach((tbody) => {
            tbody.innerHTML = '';
        });

        let filteredMenus = Object.values(menusData).filter(menu => {
            return filterCategoria === 'Todos' || menu.categoria === filterCategoria;
        });

        if (ordemPreco === 'asc') {
            filteredMenus.sort((a, b) => convertToNumber(a.price) - convertToNumber(b.price));
        } else if (ordemPreco === 'desc') {
            filteredMenus.sort((a, b) => convertToNumber(b.price) - convertToNumber(a.price));
        }

        if (ordemAlfabetica === 'asc') {
            filteredMenus.sort((a, b) => a.name.localeCompare(b.name));
        } else if (ordemAlfabetica === 'desc') {
            filteredMenus.sort((a, b) => b.name.localeCompare(a.name));
        }

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

            let acaoCell = row.insertCell(3); // Célula para o ícone de "+"
            let addButton = document.createElement('button');
            addButton.innerHTML = '<i class="fas fa-plus"></i>'; // Ícone de "+" (exemplo)
            addButton.classList.add('btn', 'btn-primary', 'btn-sm'); // Classes do Bootstrap para o botão
            addButton.addEventListener('click', () => {
                addItemToPedido(menu.categoria, menu.name, menu.price);
            });
            acaoCell.appendChild(addButton);
        });
    };

    const addItemToPedido = (categoria, nome, preco) => {
        const itensSelecionados = document.getElementById('itens-selecionados');
        const total = document.getElementById('total');

        // Criar elemento li para o novo item
        const newItem = document.createElement('li');
        newItem.textContent = `${nome} - R$ ${preco}`;

        // Criar botão de remover
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira (exemplo)
        removeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2'); // Classes do Bootstrap para o botão
        removeButton.addEventListener('click', () => {
            removeItemFromPedido(newItem, preco);
        });

        // Adicionar botão de remover ao item
        newItem.appendChild(removeButton);

        // Adicionar o item à lista de itens selecionados na interface
        itensSelecionados.appendChild(newItem);

        // Atualizar o total na interface
        let currentTotal = parseFloat(total.textContent);
        currentTotal += parseFloat(preco);
        total.textContent = currentTotal.toFixed(2);

        // Adicionar ao total da comanda atual no objeto totalComandas
        if (!totalComandas.hasOwnProperty(comandaAtual)) {
            totalComandas[comandaAtual] = 0;
        }
        totalComandas[comandaAtual] += parseFloat(preco);

        // Atualizar o número da comanda na interface
        document.getElementById('comanda').textContent = comandaAtual;

        // Atualizar no Firebase Realtime Database
        const comandasRef = ref(database, `comandas/${comandaAtual}`);
        const novoItemRef = push(comandasRef); // Cria uma nova chave única para o item

        // Armazenar a chave do novo item junto com os dados
        const newItemKey = novoItemRef.key;

        set(novoItemRef, {
            categoria: categoria,
            nome: nome,
            preco: preco,
            firebaseKey: newItemKey // Armazenar a chave no Firebase 
        }).then(() => {
            console.log('Item adicionado ao Firebase: ', nome);
        }).catch((error) => {
            console.error('Erro ao adicionar item ao Firebase: ', error);
        });
    };

    const removeItemFromPedido = (itemElement, preco) => {
        const itensSelecionados = document.getElementById('itens-selecionados');
        const total = document.getElementById('total');

        // Remover o item da interface
        itensSelecionados.removeChild(itemElement);

        // Atualizar o total na interface
        let currentTotal = parseFloat(total.textContent);
        currentTotal -= parseFloat(preco);
        total.textContent = currentTotal.toFixed(2);

        // Atualizar o total da comanda atual no objeto totalComandas
        if (totalComandas.hasOwnProperty(comandaAtual)) {
            totalComandas[comandaAtual] -= parseFloat(preco);
        }

        // Remover o item do Firebase Realtime Database usando sua chave
        const itemKey = itemElement.getAttribute('data-firebase-key'); // Supondo que você tenha armazenado a chave como um atributo

        if (itemKey) {
            const itemRef = ref(database, `comandas/${comandaAtual}/${itemKey}`);
            remove(itemRef).then(() => {
                console.log('Item removido do Firebase');
            }).catch((error) => {
                console.error('Erro ao remover item do Firebase: ', error);
            });
        }
    };

    const limparPedido = () => {
        const itensSelecionados = document.getElementById('itens-selecionados');
        const total = document.getElementById('total');

        itensSelecionados.innerHTML = '';
        total.textContent = '0.00';
    };

    document.getElementById('fechar-comanda').addEventListener('click', () => {
        comandaAtual++;
        limparPedido();
    });

    document.getElementById('gerar-comprovante').addEventListener('click', () => {
        const comprovanteText = document.getElementById('comprovante-text');
        comprovanteText.value = `Comanda ${comandaAtual} - Total: R$ ${totalComandas[comandaAtual].toFixed(2)}`;

        document.getElementById('comprovante').style.display = 'block';
    });

    document.getElementById('download-comprovante').addEventListener('click', () => {
        const comprovanteText = document.getElementById('comprovante-text').value;
        // Lógica para download do comprovante, por exemplo, criar um arquivo .txt e forçar download
    });

    // Adicionar evento de mudança para o filtro de categoria
    document.getElementById('filtro-categoria').addEventListener('change', updateTable);

    // Adicionar evento de mudança para o filtro de ordenação por preço
    document.getElementById('ordem-preco').addEventListener('change', updateTable);

    // Adicionar evento de mudança para o filtro de ordenação alfabética
    document.getElementById('ordem-alfabetica').addEventListener('change', updateTable);

    // Chama a função para ler dados ao carregar a página
    readData();
});
