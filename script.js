const input = document.querySelector('.input__form');
const autocomplete = document.querySelector('.input__autocomplete');
const repositories = document.querySelector('.repositories');


function debounce(fn, debounceTime) {
    let timer;
    return function() {
        const funcCall = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timer);
        timer = setTimeout(funcCall, debounceTime)
    }
};

function onInput(e) {
    const queryString = 'q=' + encodeURIComponent(`${e.target.value} is:public`);
    
    fetch(`https://api.github.com/search/repositories?${queryString}&per_page=5`)
        .then(response => response.json())
        .then(response => {
            autocomplete.innerHTML = '';
            for (let repository of response.items) {
                const elem = document.createElement('li');
                elem.textContent = `${repository.name}`;
                autocomplete.appendChild(elem);
                elem.addEventListener('click', () => {
                    input.value = '';
                    autocomplete.innerHTML = '';

                    const rep = document.createElement('div');
                    const repName = document.createElement('span');
                    repName.textContent = `Name: ${repository.name}`;
                    const repOwner = document.createElement('span');
                    repOwner.textContent = `Owner: ${repository.owner.login}`;
                    const repStars = document.createElement('span');
                    repStars.textContent = `Stars: ${repository.stargazers_count}`;
                    const closeBtn = document.createElement('button')
                    closeBtn.addEventListener('click', (e) => {
                        repositories.removeChild(e.target.closest('div'))
                    })
                    rep.appendChild(repName);
                    rep.appendChild(repOwner);
                    rep.appendChild(repStars);
                    rep.appendChild(closeBtn);
                    repositories.appendChild(rep);
                })
            }
        })
}

onInput = debounce(onInput, 500);

input.addEventListener('keyup', onInput);