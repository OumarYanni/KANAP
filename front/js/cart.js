/**
 * Fonction qui récupère les données du local storage
 * Si le panier est vide, un message d'alerte indique "Votre panier est vide"
 * Sinon il retourne le contenu du local storage en JSON converti en objet javascript
 * @returns {json.parse} of selected products
 */
function getCart() {
  const cart = localStorage.getItem("products");
  console.table(cart);
  if (cart === null) {
    document.querySelector("#cartAndFormContainer > h1").textContent =
      "Votre panier est vide";
  } else {
    return JSON.parse(cart);
  }
}

let cart = getCart();

function cartProductsInfos() {
  for (const product of cart) {
    fetch("/api/products/" + product.id)
      .then((Response) => Response.json())
      .then((productApi) => {
        product.price = productApi.price;
        product.imageUrl = productApi.imageUrl;
        product.name = productApi.name;

        showProductCart(product);
        totalQuantityAndPrice();
      });
  }
}
if(cart){
    cartProductsInfos();
}


/**
 * @function showProductCart
 * @param {Object} product - The product to be displayed in the cart.
 * @description Creates and displays the HTML for a single product in the cart.
 */
function showProductCart(product) {
  const section = document.getElementById("cart__items");
  const article = document.createElement("article");
  article.className = "cart__item";
  article.setAttribute("data-id", product.id);
  article.setAttribute("data-color", product.color);
  section.appendChild(article);

  //HTML créer et afficher l'image
  const cartItemImg = document.createElement("div");
  cartItemImg.classList.add("cart__item__img");
  article.appendChild(cartItemImg);

  const image = document.createElement("img");
  image.src = product.imageUrl;
  image.alt = product.altTxt;
  cartItemImg.appendChild(image);

  // HTML créer une div "cart__item__content"
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");
  article.appendChild(cartItemContent);

  //Créer une div "cart__item__content__description" et afficher son contenu
  const cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.classList.add("cart__item__content__description");
  cartItemContent.appendChild(cartItemContentDescription);

  const h2 = document.createElement("h2");
  h2.textContent = product.name;
  cartItemContentDescription.appendChild(h2);

  const colorParagraph = document.createElement("p");
  colorParagraph.textContent = product.color;
  cartItemContentDescription.appendChild(colorParagraph);

  const priceParagraph = document.createElement("p");
  priceParagraph.textContent = product.price + " €";
  cartItemContentDescription.appendChild(priceParagraph);

  //Créer une div "cart__item__content__settings" et afficher son contenu
  const cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.classList.add("cart__item__content__settings");
  cartItemContent.appendChild(cartItemContentSettings);

  //Créer une div "cart__item__content__settings__quantity" et afficher son contenu
  const cartItemsContentSettingsQuantity = document.createElement("div");
  cartItemsContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  cartItemContentSettings.appendChild(cartItemsContentSettingsQuantity);

  const quantityParagraph = document.createElement("p");
  quantityParagraph.textContent = "Qté :";
  cartItemsContentSettingsQuantity.appendChild(quantityParagraph);

  const itemQuantity = document.createElement("input");
  //"Element.closest" Renvoie le premier ancêtre inclusif (à partir de l'élément) qui correspond aux sélecteurs, et null sinon.
  //"Dataset. permet de stocker des donnnées à l'intérieur de balise HTML"

  itemQuantity.setAttribute("type", "number");
  itemQuantity.setAttribute("class", "itemQuantity");
  itemQuantity.setAttribute("name", "itemQuantity");
  itemQuantity.setAttribute("min", "1");
  itemQuantity.setAttribute("max", "100");
  itemQuantity.setAttribute("value", product.quantity);
  cartItemsContentSettingsQuantity.appendChild(itemQuantity);

  //Créer une div "cart__item__content__settings__delete" et afficher son contenu
  const cartItemContentSettingsDelete = document.createElement("div");
  cartItemContentSettingsDelete.classList.add(
    "cart__item__content__settings__delete"
  );
  cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

  const deleteParagraph = document.createElement("p");
  deleteParagraph.classList.add("deleteItem");
  deleteParagraph.textContent = "Supprimer";
  cartItemContentSettingsDelete.appendChild(deleteParagraph);

  //Supprime les produits au clique
  deleteParagraph.addEventListener("click", (Event) => {
    const dataId = deleteParagraph.closest("article").dataset.id;
    const dataColor = deleteParagraph.closest("article").dataset.color;
    deleteParagraph.closest("article").remove();
    deleteProduct(dataId, dataColor);
  });

  //Mise à jour du changement de la quantité tenant compte de l'id et de la couleur du produit
  itemQuantity.addEventListener("change", (Event) => {
    const quantityDataId = quantityParagraph.closest("article").dataset.id;
    const quantityDataColor =
      quantityParagraph.closest("article").dataset.color;
    quantityUpdating(Event, quantityDataId, quantityDataColor);
  });
}

//
function quantityUpdating(Event, quantityDataId, quantityDataColor) {
  //   const cart = JSON.parse(localStorage.getItem("products"));

  const ProductSearch = cart.find(
    (element) =>
      element.id == quantityDataId && element.color == quantityDataColor
  );

  if (ProductSearch) {
    ProductSearch.quantity = Event.target.value;
    saveCart(cart);
    totalQuantityAndPrice();
    // localStorage.setItem("products", JSON.stringify(cart));
  }
}

//
function deleteProduct(dataId, dataColor) {
  //   const cart = JSON.parse(localStorage.getItem("products"));
  cart = cart.filter(
    (article) =>
      (article.id !== dataId && article.color !== dataColor) ||
      (article.id === dataId && article.color !== dataColor)
  );

  saveCart(cart);

  //Lancer la fonction calcule du prix
  totalQuantityAndPrice();
}

function saveCart(cartFilter) {
  let newCart = [];
  for (const product of cartFilter) {
    const color = product.color;
    const quantity = product.quantity;
    const id = product.id;
    newCart.push({
      color,
      quantity,
      id,
    });
  }
  console.log(cartFilter, newCart);
  localStorage.setItem("products", JSON.stringify(newCart));
}

function totalQuantityAndPrice() {
  console.log(cart);
  let quantity = 0;
  let price = 0;
  for (const product of cart) {
    quantity += Number(product.quantity);
    price += product.price * Number(product.quantity);
    console.log(product.price);
  }

  const eltTotalPrice = document.getElementById("totalPrice");
  const eltTotalQuantity = document.getElementById("totalQuantity");

  eltTotalPrice.textContent = price;
  eltTotalQuantity.textContent = quantity;
}


const submitButton = document.getElementById("order");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const textRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
const adressRegex = /^[a-zA-Z0-9\s,'-]{5,50}$/;
const cityRegex = /^[a-zA-Z\s-]{3,30}$/;
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const contact = {};

const regexnames = (value) => {
  return /^[A-Za-zéèêëàçâ-]{3,30}$/.test(value);
};

const regexAdressAndCity = (value) => {
  return /^[a-zA-Zçéèêôùïâàû0-9\s, '-]{3,60}$/.test(value);
};

const regexEmail = (value) => {
  return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(
    value
  );
};

function firstNameCheck() {
  const inputFirstName = document.getElementById("firstName").value;
  if (regexnames(inputFirstName)) {
    firstNameErrorMsg.textContent = "Prénom enregistré";
    return true;
  } else {
    firstNameErrorMsg.textContent = "Veuillez renseigner un prénom valide";
    return false;
  }
}

function lastNameCheck() {
  const inputLastName = document.getElementById("lastName").value;
  if (regexnames(inputLastName)) {
    lastNameErrorMsg.textContent = "Nom enregistré";
    return true;
  } else {
    lastNameErrorMsg.textContent = "Veuillez renseigner un nom valide";
    return false;
  }
}

function adressCheck() {
  const inputAdress = document.getElementById("address").value;
  if (regexAdressAndCity(inputAdress)) {
    addressErrorMsg.textContent = "Adresse enregistrée";
    return true;
  } else {
    addressErrorMsg.textContent = "Veuillez renseigner une adresse valide";
    return false;
  }
}

function cityCheck() {
  const inputCity = document.getElementById("city").value;
  if (regexAdressAndCity(inputCity)) {
    cityErrorMsg.textContent = "Ville enregistrée";
    return true;
  } else {
    cityErrorMsg.textContent = "Veuillez renseigner une ville valide";
    return false;
  }
}

function emailCheck() {
  const inputEmail = document.getElementById("email").value;
  if (regexEmail(inputEmail)) {
    emailErrorMsg.textContent = "Email enregistré";
    return true;
  } else {
    emailErrorMsg.textContent = "Veuillez renseigner une adresse email valide";
    return false;
  }
}

submitButton.addEventListener("click", (Event) => {
  Event.preventDefault(Event);
  send();
});

function send() {
    //vérification en haut de la fonction, pour vérifier si le panier est null ou a une longueur de 0. 
    //Si c'est vrai, la fonction alertera l'utilisateur que le panier est vide et le redirigera vers la page d'accueil en utilisant location.href = "index.html"
    let cart = JSON.parse(localStorage.getItem("products"));
    if (cart === null || cart.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    //Ensuite, création d'une nouvelle variable products qui est un tableau des identifiants de produits, en mappant le tableau du panier et en extrayant la propriété id de chaque produit
    let products = cart.map(product => product.id);

    if (
      firstNameCheck() &&
      lastNameCheck() &&
      adressCheck() &&
      cityCheck() &&
      emailCheck()
    ) {
      const contact = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        };
      console.log(cart);
    
      let data = { contact, products }
  
      fetch("/api/products/order", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((Response) => {
          return Response.json();
        })
  
        .then((server) => {
          const orderId = server.orderId;
  
          if (orderId != "") {
            location.href = "confirmation.html?orderid=" + orderId;
          }
        });
    }
  }
  