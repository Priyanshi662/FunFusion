async function fetchContributors(owner,repo){
    try{
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
        const data = await response.json();
        return data;
        if(!response.ok){
            throw new Error('Request Failed!');
        }
        const contributors= await response.json();
        return contributors;
    }catch(error){
        console.log(error.message);
    }
    return[];
}

async function displayContributors(contributors){
    const contributorsList = document.getElementById('contributors-list');
    for (const contributor of contributors){
        const li = document.createElement('li');
        li.innerHTML = `
            <img class="contributor-image" src="${contributor.avatar_url}" alt="${contributor.login}" width="100" height="100">
            <a href="https://github.com/${contributor.login}" target="_blank">${contributor.login}</a>
        `;
        contributorsList.append(li);
    }
}
const owner='Priyanshi662';
const repo='FunFusion';
fetchContributors(owner,repo)
    .then(contributors => displayContributors(contributors))
    .catch(error => console.log(error.message));
