async function fetchUserInfo() {
    const username = document.getElementById('username').value;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();

    if (userData.message === 'Not Found') {
        document.getElementById('error').innerText = 'User not found!';
        document.getElementById('info').innerText = '';
        document.getElementById('repos').innerText = '';
        return;
    }

    document.getElementById('error').innerText = '';

    const infoContainer = document.getElementById('info');
    infoContainer.innerHTML = `
        <h2>${userData.name}</h2>
        <img id="avatar" src="${userData.avatar_url}" alt="Avatar">
        <p>${userData.bio || 'No bio available'}</p>
    `;

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await reposResponse.json();
    const reposList = document.getElementById('repos');
    reposList.innerHTML = '';

    reposData.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || 'No description available'}</p>
            <p><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
            <p><strong>Last Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
        `;
        reposList.appendChild(repoItem);
    });
}