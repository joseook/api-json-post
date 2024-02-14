// Aguarda o carregamento completo do DOM antes de executar o código
addEventListener('DOMContentLoaded', () => {
    // URL base da API JSONPlaceholder
    const urlPost = 'https://jsonplaceholder.typicode.com/posts';

    // Elementos do DOM
    const loadingElement = document.getElementById('loading'); // Elemento de carregamento
    const postsContainer = document.getElementById('post-containers'); // Container de postagens

    // Elementos de postagem individual
    const postPage = document.getElementById('post'); // Página de postagem
    const contentPost = document.getElementById('post-container'); // Container de conteúdo da postagem
    const commentsPost = document.getElementById('comments-container'); // Container de comentários da postagem

    // Obtém o ID da postagem da URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Função assíncrona para obter todas as postagens
    async function getPosts() {
        // Faz uma solicitação para a API para obter todas as postagens
        const response = await fetch(urlPost);
        // Converte a resposta em JSON
        const datePosts = await response.json();

        // Esconde o elemento de carregamento
        loadingElement.classList.add('hidden');

        // Mapeia todas as postagens retornadas
        datePosts.map((post) => {
            // Cria elementos DOM para exibir cada postagem
            const divNew = document.createElement('div');
            const title = document.createElement('h2');
            const body = document.createElement('p');
            const linkPost = document.createElement('a');

            // Adiciona uma classe ao novo elemento div
            divNew.classList.add('post-card');

            // Define o texto e conteúdo dos elementos
            title.innerText = post.title;
            body.innerText = post.body;

            // Configura o link para a postagem individual
            linkPost.innerText = "Read";
            linkPost.setAttribute('href', `./post/post.html?id=${post.id}`);

            // Adiciona os elementos ao DOM
            divNew.appendChild(title);
            divNew.appendChild(body);
            divNew.appendChild(linkPost);

            postsContainer.appendChild(divNew);
        });
    }

    // Função assíncrona para obter uma postagem individual com seus comentários
    async function getPost(id) {
        // Faz solicitações para a API para obter a postagem e seus comentários
        const [responsePost, responseComments] = await Promise.all([
            fetch(`${urlPost}/${id}`),
            fetch(`${urlPost}/${id}/comments`)
        ]);
        // Converte as respostas em JSON
        const dataPost = await responsePost.json();
        const dataComments = await responseComments.json();

        // Remove a classe "hidden" para exibir a página de postagem
        postPage.classList.remove('hidden');

        // Cria elementos DOM para exibir a postagem
        const title = document.createElement('h1');
        const body = document.createElement('p');

        // Define o texto e conteúdo dos elementos
        title.innerText = dataPost.title;
        body.innerText = dataPost.body;

        // Adiciona os elementos ao DOM
        contentPost.appendChild(title);
        contentPost.appendChild(body);

        // Limpa o contêiner de comentários
        commentsPost.innerHTML = '';

        // Mapeia todos os comentários retornados e os exibe
        dataComments.map((comment) => {
            createComment(comment);
        });
    }

    // Função para criar elementos DOM para exibir um comentário
    function createComment(comment) {
        const div = document.createElement('div');
        const nameComment = document.createElement('span');
        const email = document.createElement('span');
        const commentBody = document.createElement('p');

        // Define o texto e conteúdo dos elementos
        nameComment.innerText = comment.name;
        email.innerText = comment.email;
        commentBody.innerText = comment.body;

        // Adiciona os elementos ao DOM
        div.appendChild(nameComment);
        div.appendChild(email);
        div.appendChild(commentBody);

        commentsPost.appendChild(div);
    }

    // Função assíncrona para adicionar um comentário à postagem atual
    async function postComment(comment) {
        // Faz uma solicitação POST para adicionar o comentário à postagem
        const response = await fetch(`${urlPost}/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: comment
        });
        // Converte a resposta em JSON
        const data = await response.json();
        // Cria e exibe o novo comentário
        createComment(data);
    }

    // Verifica se há um ID de postagem na URL
    if (!postId) {
        // Se não houver, obtém todas as postagens
        getPosts();
    } else {
        // Se houver, obtém a postagem e seus comentários correspondentes
        getPost(postId);

        // Obtém o formulário de comentário
        const form = document.getElementById('comment-form');

        // Adiciona um ouvinte de evento para o envio do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtém os valores dos campos de entrada do formulário
            let comment = {
                email: emailInput.value,
                name: nameInput.value,
                body: bodyInput.value
            };
            // Converte o comentário em formato JSON
            comment = JSON.stringify(comment);
            // Envia o comentário para ser adicionado à postagem
            postComment(comment);
            // Limpa os campos do formulário
            emailInput.value = '';
            nameInput.value = '';
            bodyInput.value = '';
        });
    }
});
