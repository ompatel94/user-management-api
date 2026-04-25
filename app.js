const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Simple in-memory DB
let users = [];
let idCounter = 1;

// Validation Middleware
function validateUser(req, res, next) {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }
    next();
}

// GET all users
app.get("/users", (req, res) => {
    res.json(users);
});

// GET single user
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// CREATE user
app.post("/users", validateUser, (req, res) => {
    const newUser = {
        id: idCounter++,
        name: req.body.name,
        email: req.body.email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// UPDATE user
app.put("/users/:id", validateUser, (req, res) => {
    const user = users.find(u => u.id == req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = req.body.name;
    user.email = req.body.email;

    res.json(user);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
    users = users.filter(u => u.id != req.params.id);
    res.json({ message: "User deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
