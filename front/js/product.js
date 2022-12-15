
// let params = "http://localhost:3000/api/products?id=${product._id}";
let params = window.location.href;
console.log(window)

let url = new URL(params);

let searchParams = new URLSearchParams(url.search); 

if(searchParams.has('id')) {
    let id = searchParams.get('id');
    console.log(id);
}



/*let params = "http://localhost:3000/api/products?id=${product._id}";
let url = new URL(params);
let id = url.searchParams.get("id");
console.log(id);*/

/*let params = "http://localhost:3000/api/products?id=${product._id}";

let url = new URL(params);

let searchParams = new URLSearchParams(url.search); 

if(searchParams.has('id')) {
  let id = searchParams.get('id');
  console.log(id);
}*/

/*let urlApiProduct = 'http://localhost:3000/api/products';*/

/*fetch(params)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(products) {
    console.log(products);
    
    
  })
  .catch(function(err) {
    // Une erreur est survenue
  });*/