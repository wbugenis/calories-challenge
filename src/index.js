const charUrl = `http://localhost:3000/characters`
const charBar = document.querySelector('div#character-bar')
const detailView = document.querySelector('div#detailed-info')
const calorieForm = document.querySelector('form#calories-form')
const calorieSpan = document.querySelector("span#calories")
const idField = document.querySelector("input#characterId")
const nameForm = document.querySelector("form#name-form")
const newForm = document.querySelector("form#new-form")

//Invoke fns to populate page and add listeners after load
document.addEventListener("DOMContentLoaded", event => {
    fetchCharacters()
    addCharBarListener()
    addCalorieFormListener()
    addResetListener()
    addNameChangeListener()
    addNewFormListener()
})

//************* DISPLAY FUNCTIONS ********************/

//Add Character name to "navbar" div
const displayCharacter = character => {
    const span = document.createElement('span')
    span.dataset.id = character.id
    span.textContent = character.name
    charBar.append(span)
}

//Fetch Characters from the DB, use helpers to show in list/detail views
const fetchCharacters = () => {
    fetch(charUrl)
        .then(response => response.json())
        .then(characters => {
            displayDetail(characters[0])
            characters.forEach(displayCharacter)
        })
        .catch(error => console.log(error))
}

//Show a passed in character obj in detail view
const displayDetail = character => {
    detailView.querySelector("p#name").textContent = character.name
    
    const img = detailView.querySelector("img#image")
    img.src = character.image
    img.alt = character.name

    calorieSpan.textContent = character.calories
    idField.value = character.id
}


//****************EVENT HANDLER FUNCTIONS  ***************/

//Handle click on character names - display in detail view on click
const charClickHandler = event => {
    if(event.target.matches('span')){
        const id = parseInt(event.target.dataset.id)

        fetch(`${charUrl}/${id}`)
            .then(response => response.json())
            .then(displayDetail)
            .catch(error => console.log(error))
    }
}

//Handle calorie form input - get current cals, add new value, add to db/display on page
const calorieFormHandler = event => {
    event.preventDefault()

    const id = event.target.characterId.value

    let calories = parseInt(calorieSpan.textContent)
    calories += parseInt(event.target.caloriesField.value)

    fetch(`${charUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({calories})
    })
        .then(() => calorieSpan.textContent = calories)
        .catch(error => console.log(error))
    calorieForm.reset()   
}

//Handle reset button event - set calories to 0 in db and on page
const resetButtonHandler = event => {
    const id = parseInt(idField.value)
        
    fetch(`${charUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({calories: 0})
    })
        .then(() => calorieSpan.textContent = 0)
        .catch(error => console.log(error))
}

//Accept name change event, update db, update name in list and detail views
const handleNameChange = event => {
    event.preventDefault()
        const id = parseInt(idField.value)
        const name = event.target.nameField.value

        fetch(`${charUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({name})
        })
            .then(() => {
                document.querySelector(`[data-id="${id}"]`).textContent = name
                detailView.querySelector("p#name").textContent = name
            })
            .catch(error => console.log(error))
        
        nameForm.reset()
}

//Handle new character submission
//Add to db, add to top list, show in detail view
const handleNewCharEvent = event => {
    event.preventDefault()
        const name = event.target.newNameField.value
        const image = event.target.imageField.value

        fetch(charUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({name, image, calories:0})
        })
            .then(response => response.json())
            .then(newCharacter => {
                displayCharacter(newCharacter)
                displayDetail(newCharacter)
            })
            .catch(error => console.log(error))
        
        newForm.reset()
}


//***********ADD LISTENER FUNCTIONS *******************/

//Fn to add listener for clicks on character bar
const addCharBarListener = () => {
    charBar.addEventListener('click', charClickHandler)
}

//Fn to add listener for submissions to calorie form
const addCalorieFormListener = () => {
    calorieForm.addEventListener('submit', calorieFormHandler)
}

//Add listener on reset button
const addResetListener = () => {
    const resetBtn = document.querySelector("button#reset-btn")
    resetBtn.addEventListener('click', resetButtonHandler)
}

//Add listener on name reset form
const addNameChangeListener = () => {
    nameForm.addEventListener('submit', handleNameChange)
}

//Add listener for new character form
const addNewFormListener = () => {
    newForm.addEventListener('submit', handleNewCharEvent)
}