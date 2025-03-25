document.addEventListener('DOMContentLoaded', async () => {
    const pokemonList = document.getElementById('pokemonList');
    const addRandomPokemonButton = document.getElementById('addRandomPokemonButton');
    const token = localStorage.getItem("token");
    
    if (!token) {
        // Redirect to login if no token is found
        window.location.href = "login.html";
        return;
    }

    // Fetch and display user's Pokémon
    await fetchUserPokémons(); // Corrected function call

    // Event listener for adding a random Pokémon
    addRandomPokemonButton.addEventListener('click', async () => {
        await addRandomPokemon();
    });

    async function fetchUserPokémons() { // Corrected function name
        try {
            const response = await fetch("http://localhost:5000/api/personal-pokemon", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Fout bij het ophalen van persoonlijke Pokémon");
            }

            const pokemons = await response.json();
            pokemons.forEach(addPokemonToList);
        } catch (error) {
            console.error("Error fetching personal Pokémon:", error);
        }
    }

    async function addRandomPokemon() {
        try {
            const response = await fetch("http://localhost:5000/api/random-pokemon", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Fout bij het ophalen van een random Pokémon");
            }

            const randomPokemon = await response.json();
            await collectPokemon(randomPokemon); // Pass the entire Pokémon object
        } catch (error) {
            console.error("Error adding random Pokémon:", error);
        }
    }

    async function collectPokemon(pokemon) {
        try {
            const response = await fetch(`http://localhost:5000/api/collect-pokemon`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pokemonId: pokemon._id }) // Send the Pokémon ID
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Pokémon verzameld:", data);
                alert("Pokémon succesvol verzameld!");
                addPokemonToList(pokemon); // Add the Pokémon to the list
            } else {
                throw new Error("Fout bij het verzamelen van Pokémon");
            }
        } catch (error) {
            console.error("Error collecting Pokémon:", error);
            alert("Er is een fout opgetreden bij het verzamelen van Pokémon.");
        }
    }

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