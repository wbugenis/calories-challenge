const charUrl = `http://localhost:3000/characters`
const charBar = document.querySelector('div#character-bar')
const detailView = document.querySelector('div#detailed-info')
const calorieForm = document.querySelector('form#calories-form')
const calorieSpan = document.querySelector("span#calories")

document.addEventListener("DOMContentLoaded", event => {
    fetchCharacters()
    addCharBarListener()
    addCalorieFormListener()
})

//Add Character names to "navbar" div
const displayCharacter = character => {
    const span = document.createElement('span')
    span.dataset.id = character.id
    span.textContent = character.name
    charBar.append(span)
}

//Fetch Characters from the DB, use helper fn to show on page
const fetchCharacters = () => {
    fetch(charUrl)
        .then(response => response.json())
        .then(characters => {
            displayDetail(characters[0])
            characters.forEach(displayCharacter)
        })
}

//Show a passed in character obj in detail view
const displayDetail = character => {
    detailView.querySelector("p#name").textContent = character.name
    
    const img = detailView.querySelector("img#image")
    img.src = character.image
    img.alt = character.name

    calorieSpan.textContent = character.calories
    document.querySelector("input#characterId").value = character.id
}

//Fn to add listener for clicks on character bar
const addCharBarListener = () => {
    charBar.addEventListener('click', event => {
        if(event.target.matches('span')){
            const id = parseInt(event.target.dataset.id)

            fetch(`${charUrl}/${id}`)
                .then(response => response.json())
                .then(displayDetail)
            }
    })
}

//Fn to add listener for submissions to calorie form
const addCalorieFormListener = () => {
    calorieForm.addEventListener('submit', event => {
        event.preventDefault()

        const id = event.target.characterId.value

        let calories = parseInt(calorieSpan.textContent)
        console.log(`current cals ${calories}`)
        console.log(typeof calories)
        calories += parseInt(event.target.caloriesField.value)
        console.log(`after form cals ${calories}`)
        console.log(typeof calories)

        fetch(`${charUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({calories})
            })
                .then(response => response.json())
                .then(() => calorieSpan.textContent = calories)

        calorieForm.reset()
    })

}