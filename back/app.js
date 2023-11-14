const express = require('express');
const path = require('path');
const productRoutes = require('./routes/product');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Ajout pour servir les fichiers statiques
app.use('/css', express.static(path.join(__dirname,'..', 'front', 'css')));
app.use('/images', express.static(path.join(__dirname,'..', 'front', 'images')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname,'..', 'front', 'js')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/products', productRoutes);

// Route pour servir index.html
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'front', 'html', 'index.html'));
});

//Route pour servir cart.html 
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'html', 'cart.html'));
});

//Route pour servir confirmation.html
app.get('/confirmation.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'html', 'confirmation.html'));
});

// Route pour servir product.html
app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'html', 'product.html'));
});


module.exports = app;
