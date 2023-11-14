/**
 * Faire le lien entre un produit de la page d’accueil et la page Produit
 */
const productId = new URL(window.location.href).searchParams.get("id"); 
console.log(productId);

/**
 * Envoi d'une requête utilisateur fetch Api depuis l'ID du produit pour récupérer les données au format JSON
 * @param {string} url Product id
 * @param {string} method Get
 * @param {object} body 
 * @return {Promise} 
 */
fetch("/api/products/" + productId)
  .then((response) => response.json())
  .then((apiData) => htmlRendering(apiData)); 

/**
 * Récupérer les clés du produit depuis l'Api et déclaration de la fonction principale
 * @param {*} productInfos 
 * @param {string} imageUrl of product
 * @param {string} altTxt of product
 * @param {string} name of product
 * @param {number} price of product
 * @param {string} description of product
 * @param {array of string} colors of product
 */
function htmlRendering(productInfos) {
  const { imageUrl, altTxt, name, price, description, colors } = productInfos; 
  getProductImage(imageUrl, altTxt);
  getProductTitle(name);
  getProductPrice(price);
  getProductDescription(description);
  getProductColors(colors);
}

/**
 * Récupérer et afficher l'image du produit ainsi que son texte alternatif
 * @param {string} imageUrl 
 * @param {string} altTxt 
 */
function getProductImage(imageUrl, altTxt) {
  const productImage = document.querySelector(".item__img");
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  productImage.appendChild(image);
}

/**
 * Récupérer et afficher le nom du produit
 * @param {string} name 
 */
function getProductTitle(name) {
  const title = document.querySelector("title");
  title.textContent = name;
  const productName = document.getElementById("title");
  productName.textContent = name;
}

/**
 * Récupérer et afficher le prix du produit
 * @param {number} price 
 */
function getProductPrice(price) {
  const productPrice = document.querySelector("#price");
  productPrice.textContent = price;
}

/**
 * Récupérer et afficher le descriptif du produit
 * @param {string} description 
 */
function getProductDescription(description) {
  const productDescription = document.querySelector("#description");
  productDescription.textContent = description;
}

/**
 * Récupérer et afficher les différentes options de couleurs disponibles pour le produit
 * @param {string} colors 
 */
function getProductColors(colors) {
  const selectColor = document.querySelector("#colors");
  colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    selectColor.appendChild(option);
  });
}

const addButton = document.querySelector("#addToCart");
 //Au clique du bouton "ajouter au panier" envoi des produits dans le localstorage
addButton.addEventListener("click", () => {
 //La commande JSON Parse analyse (parse) le contenu d’une chaîne formatée en JSON et en extrait des valeurs que vous pouvez stocker dans un champ ou une variable 4D. Cette commande désérialise des données JSON (transforme du json en javascript compréhensible) ; elle effectue l’action inverse de la commande JSON Stringify.
 //Création du panier de produits puis récupère du JSON sous forme de javascript depuis le local storage
  let ProductsCart = JSON.parse(localStorage.getItem("products")) || [];
 //Récupération des couleurs choisies
  let selectedColor = document.querySelector("#colors").value; 
 //Récupération de la quantité de produit défini par l'utilisateur
  let productQuantity = document.querySelector("#quantity").value;
 //Définition des conditions pour que le message d'alerte s'affiche
  if (
    productQuantity == undefined ||
    productQuantity == null ||
    productQuantity < 1 ||
    productQuantity > 100 ||
    selectedColor === "" ||
    selectedColor == null ||
    selectedColor == undefined
  )
  {
    alert("Veuillez sélectionner une couleur et une quantité (entre 1 et 100) du produit");
  } else {
 
  //ajout du produit avec les 3 références de la documentation
  const addedProduct = {
    id: productId,
    quantity: productQuantity,
    color: selectedColor
  };
  
  // Vérification dans le local storage de l'existance d'un produit avec le même identifiant et la même couleur
  const identicalProductSearch = ProductsCart.find(
    (element) => element.id == productId && element.color == selectedColor
  );
  //ParseInt est une fonction javascript qui convertit une chaîne de caractère en nombre entier
  //Si produits identiques différents de "non défini" alors est égal à la "quantité totale"
  if (identicalProductSearch != undefined) {
    const totalQuantity = parseInt(identicalProductSearch.productQuantity) + parseInt(productQuantity);
    identicalProductSearch.productQuantity = totalQuantity;
  //Sinon on enregistre les nouveaux produits dans le local storage
  } else {
    ProductsCart.push(addedProduct);
  } 
  //La syntaxe localStorage.setItem() permet de stocker une donnée
  //JSON.stringify transforme du javascript en format JSON stockable dans le local storage ou dans un serveur 
  localStorage.setItem("products", JSON.stringify(ProductsCart)); 
  alert ("Le produit a été ajouté au panier")
}});