const searchInput = document.getElementById('searchInput')
const autocompleteList = document.getElementById('autocompleteList')
const repositoriesList = document.getElementById('repositoriesList')

const debounceFetch = debounce(fetchRepositories, 600)

searchInput.addEventListener('input', ()=> {
	debounceFetch(searchInput.value)
})

autocompleteList.addEventListener('click', event => {
	if (event.target.tagName == 'LI') {
		addRepositoryToTheList(event.target)
	}
})

repositoriesList.addEventListener('click', (event) => {
	if (event.target.tagName == 'BUTTON') {
		removeRepository(event.target.parentElement)
	}
})

function debounce (fn, delay) {
	let timer

	return function (...args) {
		clearTimeout(timer)

		timer = setTimeout( ()=> {
			fn.apply(this, args)
		}, delay)
	}
}

function fetchRepositories (query) {
	if (!query.trim()) {
		autocompleteList.innerHTML = ''
		return
	}

	fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
		.then(res => res.json())
		.then(data => {
			items = data.items || []
			displayAutocompleteItems(items)			
		})
		.catch(error => console.error('Error fetching repositories: ', error))
}

function displayAutocompleteItems(items) {
	autocompleteList.innerHTML = ''

	items.forEach(item => {
		const li = document.createElement('li')
		li.textContent = item.name

		li.addEventListener('click', event => {
				addRepositoryToTheList(item)
				searchInput.value = ''
				autocompleteList.innerHTML = ''
		})

		autocompleteList.appendChild(li)
	})
}

function addRepositoryToTheList (repo) {
	const li = document.createElement('li')
	li.innerHTML = `
			<div>
				<p>Name: ${repo.name}</p=>
				<p>Owner: ${repo.owner.login}</p>
				<p>Stars: ${repo.stargazers_count}</p>
			</div>
			<button class="btn-remove"></button>
	`

	repositoriesList.appendChild(li)
}

function removeRepository (repo) {
	repo.remove()
}
