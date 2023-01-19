//Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
const productId = new URL(window.location.href).searchParams.get("orderid");

if(!productId){
    location.href = "index.html";
}
//Sélection de l'élément html dans lequel on veut afficher le numéro de commande
const orderId = document.getElementById("orderId");
//Insertion du numéro de commande dans le html
orderId.innerHTML = productId;

//Supprime toutes les paires clé/valeur, s'il y en a. 
//Distribue un événement de stockage sur les objets Window contenant un objet Storage équivalent.
localStorage.clear();