/**
 * Fonction qui récupère les données du local storage 
 * Si le panier est vide, un message d'alerte indique "Votre panier est vide"
 * Sinon il retourne le contenu du local storage en JSON converti en objet javascript
 * @returns {json.parse} of selected products
 */
function getCart () {
    const cart = localStorage.getItem("products");
    console.table(cart);
    if (cart === null) {
        document.querySelector("#cartAndFormContainer > h1").textContent = "Votre panier est vide";
    } else {
        return JSON.parse(cart);
    }
}

getCart()

function cartProductsInfos () {
    const cartProductInfos = getCart();
    for (const cart of cartProductInfos) {
        fetch("http://localhost:3000/api/products/" + cart.id)
        .then((Response) => Response.json())
        .then((product) => showProductCart(product, cart))
    }
}

cartProductsInfos ()

function showProductCart (product, cart) {
    const section = document.getElementById("cart__items");
    const article = document.createElement("article");
    article.className = "cart__item";
    article.setAttribute("data-id", product._id);
    article.setAttribute("data-color", cart.color);
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
    h2.textContent = product.name ;
    cartItemContentDescription.appendChild(h2);

    const colorParagraph = document.createElement("p");
    colorParagraph.textContent = cart.color;
    cartItemContentDescription.appendChild(colorParagraph);

    const priceParagraph = document.createElement("p");
    priceParagraph.textContent = product.price + "€";
    cartItemContentDescription.appendChild(priceParagraph);
    
    //Créer une div "cart__item__content__settings" et afficher son contenu
    const cartItemContentSettings = document.createElement("div");
    cartItemContentSettings.classList.add("cart__item__content__settings");
    cartItemContent.appendChild(cartItemContentSettings);

    //Créer une div "cart__item__content__settings__quantity" et afficher son contenu
    const cartItemsContentSettingsQuantity = document.createElement("div");
    cartItemsContentSettingsQuantity.classList.add("cart__item__content__settings__quantity");
    cartItemContentSettings.appendChild(cartItemsContentSettingsQuantity);
    
    const quantityParagraph = document.createElement("p");
    quantityParagraph.textContent = "Qté :";
    cartItemsContentSettingsQuantity.appendChild(quantityParagraph);

    const itemQuantity = document.createElement("input");
    //"Element.closest" Renvoie le premier ancêtre inclusif (à partir de l'élément) qui correspond aux sélecteurs, et null sinon.
    //"Dataset. permet de stocker des donnnées à l'intérieur de balise HTML"
    const quantityDataId = quantityParagraph.closest(".cart__items").dataset.id;
    const quantityDataColor = quantityParagraph.closest(".cart__items").dataset.color;

    itemQuantity.setAttribute("type", "number");
    itemQuantity.setAttribute("class", "itemQuantity");
    itemQuantity.setAttribute("name", "itemQuantity");
    itemQuantity.setAttribute("min", "1");
    itemQuantity.setAttribute("max", "100");
    itemQuantity.setAttribute("value", cart.quantity);
    cartItemsContentSettingsQuantity.appendChild(itemQuantity);

    //Mise à jour du changement de la quantité tenant compte de l'id et de la couleur du produit
    itemQuantity.addEventListener("change", (Event) => {
        quantityUpdating(Event, quantityDataId, quantityDataColor);
    });

    //Si la quantité est inférieure à 0 ou supérieur à 100 mettre "1" comme valeur
    itemQuantity.addEventListener("change", (Event) => {
        //"target" Renvoie l'objet vers lequel l'événement est envoyé (sa cible).
        //"value" Renvoie la valeur des données à la position actuelle du curseur.
        if (Event.target.value < 0 || Event.target.value > 100) {
            itemQuantity.value = 1;
        }
    });

    //Appel des fonctions
    changeQuantity();
    totalQuantity();
    totalPrice();

    //Créer une div "cart__item__content__settings__delete" et afficher son contenu
    const cartItemContentSettingsDelete = document.createElement("div");
    cartItemContentSettingsDelete = classList.add("cart__item__content__settings__delete");
    cartItemContentSettings.appendChild(cartItemContentSettingsDelete);

    const deleteParagraph = document.createElement("p");
    deleteParagraph.classList.add("deleteItem");
    deleteParagraph.textContent = "Supprimer";
    cartItemContentSettingsDelete.appendChild(deleteParagraph);

    //Récupérer produit au clique
    const dataId = deleteParagraph.closest(".cart__items").dataset.id;
    const dataColor = deleteParagraph.closest(".cart__items").dataset.color;
    deleteParagraph.addEventListener("click", (Event) => {
     deleteItem(dataId, dataColor);
    });
}

function changeQuantity () {
    const itemsQuantity = document.querySelector(".itemQuantity");

    itemsQuantity.forEach((itemQuantity) => {
       itemQuantity.addEventListener("change", () => {
        const newQuantity = Number(itemQuantity.value);
        itemQuantity.textContent = newQuantity;
        
        //Parcours les produits afin d'identifié celui qui subit un changement
        const article = itemQuantity.closest("article");
        //Récupération du panier
        const cart = JSON.parse(localStorage.getItem("products"));
        //Constante pour récupérer l'id
        const getId = article.getAttribute("data-id");
        //COnstante pour récupérer la couleur
        const getColor = article.getAttribute("data-color");
        //
        for (let index = 0; index < cart.length; index++) {
            const localstorageProduct = cart[index];

            if (getId === localstorageProduct.id && getColor === localstorageProduct.color) {
                localstorageProduct.quantity = newQuantity;
                localStorage.setItem("products", JSON.stringify(cart));
            }
        }
        //Réactualise la page 
        window.location.reload()
       }); 
    });
}

function quantityUpdating(Event, quantityDataId, quantityDataColor) {
    const cart = JSON.parse(localStorage.getItem("products"));

    for (let article of cart) {
        if (article.id === quantityDataId && article.color === quantityDataColor) {
            if (article.quantity > 0 && article.quantity < 100) {
                article.quantity = Event.target.value;
            } else {
                alert("Merci de saisir une quantité valide");
                article.quantity = 1;
            }
            localStorage.setItem("products", JSON.stringify(cart));
            location.reload();
        }
    }
}

//
function deleteProduct (dataId, dataColor) {
    const cart = JSON.parse(localStorage.getItem("products"));
    const cartFilter = cart.filter (
        (article) => 
        (article.id !== dataId && article.color !== dataColor) ||
        (article.id === dataId && article.color !== dataColor)
    );
    const newCart = cartFilter;
    localStorage.setItem("products", JSON.stringify(newCart));
    location.reload();
}

//
function totalQuantity () {
    const getTotalQuantity = document.getElementById("totalQuantity");
    const cart = JSON.parse(localStorage.getItem("products"));
    const totalQuantity = [];
    let quantity = 0 ;
    for (let article of cart) {
        quantity += article.quantity;
    }
    totalQuantity.push(quantity);

    getTotalQuantity.innerText = quantity;
}

//
function totalPrice () {
    const getTotalPrice = document.getElementById("totalPrice");
    const getQuantity = document.querySelectorAll(".itemQuantity");
    const getPrices = document.querySelectorAll("cart__item__content__description");

    const productPrice = 0;
    for (let i = 0; i < getPrices.length; i++) {
        productPrice += parseInt(getPrices[i].lastElementChild.textContent) * getQuantity[i].value;
    }
    getTotalPrice.innerText = productPrice;
}

const products = [] ;
const cart = JSON.parse(localStorage.getItem("products"));
for (const Element of cart) {
    products.push(Element.id);
}

const submitButton = document.getElementById("order");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const textRegex = /^([A-Za-z]{3,20}-{0,1})?([A-Za-z]{3,20})$/;
const adressRegex = /^(.){2,50}$/;
const cityRegex = /^[a-zA-Zéèàïêç\-\s]{2,30}$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i

const contact = {};

const regexnames = (value) => {
    return /^[A-Za-zéèêëàçâ-]{3,30}$/.test(value);
};

const regexAdressAndCity = (value) => {
    return /^[a-zA-Zçéèêôùïâàû0-9\s, '-]{3,60}$/.test(value);
};

const regexEmail = (value) => {
  return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(value);
};

function firstNameCheck () {
    const inputFirstName = document.getElementById("firstName").value;
    if (regexnames(inputFirstName)) {
        firstNameErrorMsg.textContent = "Prénom enregistré";
        return true;
    } else {
        firstNameErrorMsg.textContent = "Veuillez renseigner un prénom valide";
        return false;
    }
}

function lastNameCheck () {
    const inputLastName = document.getElementById("lastName").value;
    if (regexnames(inputLastName)) {
        lastNameErrorMsg.textContent = "Nom enregistré";
        return true;
    } else {
        lastNameErrorMsg.textContent = "Veuillez renseigner un nom valide";
        return false; 
    }
}

function adressCheck () {
    const inputAdress = document.getElementById("adress").value;
    if (regexAdressAndCity(inputAdress)) {
        addressErrorMsg.textContent = "Adresse enregistrée";
        return true;
    } else {
        addressErrorMsg.textContent = "Veuillez renseigner une adresse valide";
        return false;
    }
}

function cityCheck () {
    const inputCity = document.getElementById("city").value;
    if (regexAdressAndCity(inputCity)) {
        cityErrorMsg.textContent = "Ville enregistrée";
        return true;
    } else {
        cityErrorMsg.textContent = "Veuillez renseigner une ville valide";
        return false;
    }
}

function emailCheck () {
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

    contact = {
        firstName : document.getElementById("firstName").value,
        lastName : document.getElementById("lastName").value,
        address : document.getElementById("adress").value,
        city : document.getElementById("city").value,
        email : document.getElementById("email").value, 
    };

    send();
});

function send () {
    let cart = JSON.parse(localStorage.getItem("products"));

    if (cart !== null &&
        firstNameCheck() &&
        lastNameCheck() &&
        adressCheck() &&
        cityCheck() &&
        emailCheck()
        ) 
        {
            console.log(cart);

            fetch("http://localhost:3000/api/products/order", {method: "POST", body: JSON.stringify({contact, products: products,}),
        headers: {Accept: "application/json", "Content-Type": "application/json",},
     })

     .then((Response) => {
        return Response.json();
     })

    .then((server) => {
        const orderId = server.orderId;

        if (orderId != "") {
            location.href = "confirmation.html?orderid=" + orderId;
        }
    })
    }
}