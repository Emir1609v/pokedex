require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5500", // Pas dit aan op basis van je frontend-URL
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

const mongo_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongo_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pokemons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }],
});

const User = mongoose.model("Users", userSchema); // Create User model

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

const Pokemon = mongoose.model("Pokemon", pokemonSchema, "pokémons"); // Zorg ervoor dat dit overeenkomt met je collectie naam

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Zorg ervoor dat dit pad correct is
});

// Pokémon API Routes
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

// User Registration Route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).send("User  registered successfully");
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

// User Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Attempting login for:", username);

  const user = await User.findOne({ username }).populate("pokemons");

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    console.error("Invalid credentials for user:", username);
    res.status(401).send("Invalid username or password");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
