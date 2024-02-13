addEventListener('DOMContentLoaded', () => {
    const urlPost = 'https://jsonplaceholder.typicode.com/posts';
    const loadingElement = document.getElementById('loading');
    const postsContainer = document.getElementById('post-containers');

    const postPage = document.getElementById('post');
    const contentPost = document.getElementById('post-container');
    const commentsPost = document.getElementById('comments-container');

    // Get id from URL 
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    // Getting all posts 
    async function getPosts() {
        const response = await fetch(urlPost);

        const datePosts = await response.json();

        loadingElement.classList.add('hidden');

        datePosts.map((post) => {
            const divNew = document.createElement('div');
            const title = document.createElement('h2');
            const body = document.createElement('p');
            const linkPost = document.createElement('a');

            // Adicionando a classe post-card ao divNew
            divNew.classList.add('post-card');

            title.innerText = post.title;
            body.innerText = post.body;

            linkPost.innerText = "Read";
            linkPost.setAttribute('href', `./post/post.html?id=${post.id}`);

            divNew.appendChild(title);
            divNew.appendChild(body);
            divNew.appendChild(linkPost);

            postsContainer.appendChild(divNew);
        });
    }

    // Get individual post
    async function getPost(id) {
        const [responsePost, responseComments] = await Promise.all([
            fetch(`${urlPost}/${id}`),
            fetch(`${urlPost}/${id}/comments`)
        ]);
        const dataPost = await responsePost.json();
        const dataComments = await responseComments.json();

        postPage.classList.remove('hidden');

        const title = document.createElement('h1');
        const body = document.createElement('p');

        title.innerText = dataPost.title;
        body.innerText = dataPost.body;

        contentPost.appendChild(title);
        contentPost.appendChild(body);

        commentsPost.innerHTML = '';

        dataComments.map((comment) => {
            createComment(comment);
        });
    }

    // Create Comments
    function createComment(comment) {
        const div = document.createElement('div');
        const nameComment = document.createElement('span');
        const email = document.createElement('span');
        const commentBody = document.createElement('p');

        nameComment.innerText = comment.name;
        email.innerText = comment.email;
        commentBody.innerText = comment.body;

        div.appendChild(nameComment);
        div.appendChild(email);
        div.appendChild(commentBody);

        commentsPost.appendChild(div);
    }

    async function postComment(comment) {
        const response = await fetch(`${urlPost}/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: comment
        });
        const data = await response.json();
        createComment(data);
    }

    // Verify that all id's
    if (!postId) {
        getPosts();
    } else {
        getPost(postId);

        const form = document.getElementById('comment-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let comment = {
                email: emailInput.value,
                name: nameInput.value,
                body: bodyInput.value
            };
            comment = JSON.stringify(comment);
            postComment(comment);
            emailInput.value = '';
            nameInput.value = '';
            bodyInput.value = '';
        });
    }
});
