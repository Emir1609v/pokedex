require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Debugging: Check current directory
console.log("Current directory:", __dirname);

const mongo_URI =
  "mongodb+srv://erikmeulenberg:Jf3r9n!dWN5Qqae@cluster0.uspc7.mongodb.net/pokédex?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongo_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Pokémon Schema
const pokemonSchema = new mongoose.Schema({
  name: String,
  type: [String],
  abilities: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  moves: [String],
  image_url: String,
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema, "pokémons"); // Ensure this matches your collection name

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Ensure this path is correct
});

app.get("/api/pokemon", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (err) {
    console.error("Error fetching Pokémon:", err);
    res.status(500).send("Error fetching Pokémon data");
  }
});

app.post("/api/pokemon", async (req, res) => {
  const { name, type, abilities, stats, moves, image_url } = req.body;

  const newPokemon = new Pokemon({
    name,
    type,
    abilities,
    stats,
    moves,
    image_url,
  });

  try {
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (err) {
    console.error("Error adding Pokémon:", err);
    res.status(500).send("Error adding Pokémon");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
