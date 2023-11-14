let urlApi = '/api/products';

fetch(urlApi)

  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((products) => {
    console.log(products);
    
    let HTML = document.getElementById("items")

    products.forEach(product => {
      // console.log(product.imageUrl);
      // console.log(product.name);
      // console.log(product.description);


      let card = document.createElement("a");
      card.href = `./product.html?id=${product._id}`;

      let cardArticle = document.createElement("article");
      card.appendChild(cardArticle);

      let cardImg = document.createElement("img");
      cardImg.src = product.imageUrl;
      cardImg.alt = product.altTxt;
      cardArticle.appendChild(cardImg);

      let cardProductName = document.createElement("h3");
      cardProductName.classList.add("productName");
      cardProductName.textContent = product.name;
      cardArticle.appendChild(cardProductName);

      let cardProductDescription = document.createElement("p");
      cardProductDescription.classList.add("productDescription");
      cardProductDescription.textContent = product.description;
      cardArticle.appendChild(cardProductDescription);

      HTML.appendChild(card);

    });
  })
  .catch((err) => {
    // Une erreur est survenue
  });

