const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Simulação de banco de dados (em um sistema real, usaríamos MongoDB ou MySQL)
let products = [
    { name: "PSOne", price: "$99.99", img: "../images/psone.jpg" }
];

// Rota para pegar todos os produtos (usada no index.html)
app.get('/products', (req, res) => {
    res.json(products);
});

// Rota para receber um novo produto (usada no sell.html)
app.post('/products', (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json({ message: "Produto postado com sucesso!" });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});