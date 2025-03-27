// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pokemonForm');
    const pokemonList = document.getElementById('pokemonList');

    // Fetch Pokémon on page load
    fetchPokemons();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPokemon = {
            name: document.getElementById('name').value,
            type: document.getElementById('type').value.split(',').map(item => item.trim()),
            abilities: document.getElementById('abilities').value.split(',').map(item => item.trim()),
            stats: {
                hp: parseInt(document.getElementById('hp').value),
                attack: parseInt(document.getElementById('attack').value),
                defense: parseInt(document.getElementById('defense').value),
                speed: parseInt(document.getElementById('speed').value),
            },
            moves: document.getElementById('moves').value.split(',').map(item => item.trim()),
            image_url: document.getElementById('image_url').value,
        };

        // Send the new Pokémon to the server
        try {
            const response = await fetch('/api/pokemon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPokemon),
            });

            if (response.ok) {
                const addedPokemon = await response.json();
                // Add the new Pokémon to the list
                addPokemonToList(addedPokemon);
                // Clear the form
                form.reset();
            } else {
                console.error('Error adding Pokémon:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Function to fetch Pokémon from the server
    async function fetchPokemons() {
        try {
            const response = await fetch('/api/pokemon');
            const pokemons = await response.json();
            pokemons.forEach(addPokemonToList);
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    }

    // Function to add a Pokémon to the list in the UI
    function addPokemonToList(pokemon) {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.image_url}" alt="${pokemon.name}" style="width: 100px;">
            <p>Type: ${pokemon.type.join(', ')}</p>
            <p>Abilities: ${pokemon.abilities.join(', ')}</p>
            <p>Stats: HP: ${pokemon.stats.hp}, Attack: ${pokemon.stats.attack}, Defense: ${pokemon.stats.defense}, Speed: ${pokemon.stats.speed}</p>
            <p>Moves: ${pokemon.moves.join(', ')}</p>
        `;
        pokemonList.appendChild(li);
    }
});

let currentSound = null; // Store the currently playing audio

document.querySelectorAll('.gif').forEach(gif => {
    gif.addEventListener('mouseenter', () => {
        let soundFile = gif.getAttribute('data-sound');
        console.log("Trying to play:", soundFile);

        if (soundFile) {
            // Stop any currently playing sound before playing a new one
            if (currentSound) {
                currentSound.pause();
                currentSound.currentTime = 0; // Reset audio to start
            }

            currentSound = new Audio(soundFile);
            currentSound.play().catch(error => console.error("Audio Error:", error));
        }
    });

    gif.addEventListener('mouseleave', () => {
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0; // Reset audio to start
            currentSound = null; // Clear the reference
        }
    });
});

document.querySelectorAll(".gif").forEach(img => {
    img.addEventListener("click", function () {
        let chosenPokemon = this.alt; // Get Pokémon name
        let imageSrc = this.src; // Get Pokémon image source
        let sound = new Audio(this.getAttribute("data-sound")); 

    
        let collection = document.getElementById("pokemon-collection");

        
        let pokemonCard = document.createElement("div");
        pokemonCard.classList.add("pokemon-card");

        
        let imgElement = document.createElement("img");
        imgElement.src = imageSrc;
        imgElement.alt = chosenPokemon;
        imgElement.classList.add("pokemon-img");

        
        let nameElement = document.createElement("p");
        nameElement.innerText = chosenPokemon;
        nameElement.classList.add("pokemon-name");

       
        pokemonCard.appendChild(imgElement);
        pokemonCard.appendChild(nameElement);

        
        collection.appendChild(pokemonCard);

        
        sound.play();
    });
});

document.querySelectorAll(".gif").forEach(img => {
    img.addEventListener("click", function () {
        let chosenPokemon = {
            name: this.alt,
            image: this.src
        };

        // Get existing Pokédex from localStorage or create a new one
        let pokedex = JSON.parse(localStorage.getItem("pokedex")) || [];
        pokedex.push(chosenPokemon); // Add new Pokémon
        localStorage.setItem("pokedex", JSON.stringify(pokedex)); // Save to storage

        // Redirect to the Pokédex page
        window.location.href = "pokedex.html";
    });
});



