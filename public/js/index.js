var books = new Trie();
var windowHash = new Map();
initialRendering();
getAllProducts();


function renderTodaySales(){
  renderComponentByName('today-sales');
  var request = new XMLHttpRequest();
  request.open("GET",'/sales/getTodaySales', true);
  request.onload = function(){
    var todaySalesContainer = document.getElementById('today-sales');
    var totalAmount = 0;
    var totalProfit = 0;
    var sales = JSON.parse(this.responseText);
    sales.forEach(sales=>{
      var products="";
      sales.products.forEach(product=>{
        let temp = `<span>${product.name}</span><span style="font-weight: bold;"> Profit: ${product.profit}</span></br>`;
        products+=temp;
      });
      let temp = `<div class="today-sale">
                      <div><span>${sales.customerName}</span> - <span>${sales.customerPhone}</span></div>
                      <div style="color:red; font-weight: bold">${sales.time}</div>
                      <div style="font-weight: bold; font-size: 20px;">${sales.grandTotal} Rs.</div>
                      <div style="font-weight: bold; color: dodgerblue;">Profit: ${sales.profit} Rs.</div>
                      <div>${products}</div>
                  </div>`;
      todaySalesContainer.innerHTML+=temp;
      totalAmount+=sales.grandTotal;
      totalProfit+=sales.profit;
    });

    var x = `<div>Sales: ${totalAmount} Rs.</div><div>Profit: ${totalProfit} Rs.</div>`;
    document.getElementById('today-sales-and-profit').innerHTML+=x;
  }

  request.send();
}

window.addEventListener('hashchange', ()=>{
  if(window.location.hash.substring(1)==='Products' || window.location.hash.substring(1)==='today-sales'){
  }
  else if(windowHash.has(window.location.hash.substring(1))){
    renderComponentByName(window.location.hash.substring(1));
  }
  else {
    windowHash.set(window.location.hash.substring(1),1);
  }
});


function salesProductSuggestions(){
  var suggestionContainer = document.getElementById("sales-invoice-product-suggestions");
  suggestionContainer.innerHTML='';
  var word = document.getElementById("sales-invoice-product-search").value;
  if(word!=''){
var searches = books.find(word.toUpperCase());
  for(let i=0; i<searches.length; i++){
    var temp = `<div class="suggestion" onclick="getSalesProductFromSuggestion(this)" 
                    data-id=${searches[i].id}
                    data-name='${searches[i].name}'
                    data-mrp='${searches[i].mrp}' 
                    data-salesdiscount='${searches[i].salesDiscount}'
                    data-salesprice = ${searches[i].salesPrice}
                    data-purchaseprice=${searches[i].purchasePrice}
                    data-profit = ${Number(searches[i].salesPrice)-Number(searches[i].purchasePrice)}>
                    ${searches[i].name}
                    <div style="font-weight: bold; font-size: 14px;">Qty: ${searches[i].qty} </div>
                </div>`;
    suggestionContainer.innerHTML+=temp;
  }
  }
  
}

function getSalesProductFromSuggestion(suggestion){
var product = {
  id: suggestion.dataset.id,
  name: suggestion.dataset.name,
  mrp: Number(suggestion.dataset.mrp),
  salesDiscount: Number(suggestion.dataset.salesdiscount),
  purchasePrice: Number(suggestion.dataset.purchaseprice),
  salesPrice : Number(suggestion.dataset.salesprice),
  profit: Number(suggestion.dataset.profit)
}
addTableRow(product);
}
// Add More Rows to the Sales Invoice
function addTableRow(product){
  var container = document.getElementById("sales-invoice-table-rows");
  var temp = `<div class="table-row">
            <input type="text" hidden value=${product.id} class="sales-product-id">
            <input type="text" placeholder="Product Name" class="sales-product-name" value="${product.name}" readonly>
            <input type="number" placeholder="Qty" class="sales-product-qty" value=1 oninput="changeOthers(this, 'qty', ${product.salesPrice}, ${product.purchasePrice}, ${product.mrp})">
            <input type="number" placeholder="MRP" class="sales-product-mrp" value=${product.mrp} readonly>
            <input type="number" placeholder="Discount" class="sales-product-discount" value=${product.salesDiscount} oninput="changeOthers(this, 'discount', ${product.salesPrice}, ${product.purchasePrice}, ${product.mrp})">
            <input type="number" placeholder="Price" class="sales-product-price" value=${product.salesPrice} readonly>
            <input type="number" placeholder="Total Price" class="sales-product-total-price" value=${product.salesPrice} readonly>
            <input type="number" hidden value=${product.profit} class="sales-product-profit" readonly>
            <button onclick="removeBillRow(this.parentElement)">Remove</button>
          </div>`;
  container.innerHTML+=temp;
  changeSalesGrandTotal();
  document.getElementById("sales-invoice-product-suggestions").innerHTML = '';
}

function removeBillRow(e){
  e.remove();
  changeSalesGrandTotal();
}

// Change other values if quantity and Discount changes
function changeOthers(e, whatChanged, salesPrice, purchasePrice, mrp){
var siblings = e.parentElement.children;
var itemsToChange = {};
for(let i=0; i<siblings.length; i++){
  if(siblings[i].classList.contains('sales-product-price')){
    itemsToChange["price"] = siblings[i];
  }
  else if(siblings[i].classList.contains('sales-product-total-price')){
    itemsToChange["totalPrice"] = siblings[i];
  }
  else if(siblings[i].classList.contains('sales-product-profit')){
    itemsToChange["profit"] = siblings[i];
  }
  else if(siblings[i].classList.contains('sales-product-qty')){
    itemsToChange["qty"] = siblings [i];
  }
  else if(siblings[i].classList.contains('sales-product-discount')){
    itemsToChange["discount"] = siblings[i];
  }
}

if(whatChanged==='qty'){
itemsToChange["qty"].value = Number(e.value);
itemsToChange["totalPrice"].value = Math.ceil(Number(itemsToChange["qty"].value)*Number(salesPrice));
itemsToChange["profit"].value = Math.ceil(itemsToChange["totalPrice"].value-Number(itemsToChange["qty"].value)*Number(purchasePrice));
changeSalesGrandTotal();
}

if(whatChanged==='discount'){
  itemsToChange["discount"].value = Number(e.value);
  itemsToChange["price"].value = Math.ceil(Number(mrp)-Number(mrp)*Number(e.value)/100);
  itemsToChange["totalPrice"].value = Number(itemsToChange["qty"].value)*Number(itemsToChange["price"].value);
  itemsToChange["profit"].value = Math.ceil(itemsToChange["totalPrice"].value- Number(itemsToChange["qty"].value)*Number(purchasePrice));
  changeSalesGrandTotal();
  }
}

function changeSalesGrandTotal(){
var grandTotal = 0;
var tableRows = document.getElementsByClassName('table-row');
for(let i=0; i<tableRows.length; i++){
  var product = tableRows[i].children;
  for(let j=0; j<product.length; j++){
    if(product[j].classList.value==="sales-product-total-price"){
      grandTotal+=Math.ceil(Number(product[j].value));
    }
  }
}
document.getElementById('sales-invoice-grand-total').value = grandTotal;
}
function getBillTotalProfit(products){
  var profit = 0;
  for(let i=0; i<products.length; i++){
   profit += Math.ceil(Number(products[i]["profit"]));
  }
  return profit;
}

function generateBill(){
  var products = [];
  var tableRows = document.getElementsByClassName('table-row');
  for(let i=0; i<tableRows.length; i++){
    var product = {};
    var children = tableRows[i].children;
    for(let j=0; j<children.length; j++){
      switch(children[j].classList.value) {
        case 'sales-product-id':
          product["id"] = children[j].value;
          break;
        case 'sales-product-name':
            product["name"] = children[j].value;
            break;
        case 'sales-product-mrp':
            product["mrp"] = Number(children[j].value);
            break;
        case 'sales-product-qty':
            product["qty"] = Number(children[j].value);
            break;
        case 'sales-product-discount':
            product["discount"] = Number(children[j].value);
            break;
        case 'sales-product-price':
            product["price"] = Math.ceil(Number(children[j].value));
            break;
        case 'sales-product-total-price':
            product["totalPrice"] = Math.ceil(Number(children[j].value));
            break;
        case 'sales-product-profit':
            product["profit"] = Math.ceil(Number(children[j].value));
            break;
      }
    }
    products.push(product);
  }
  var bill = {
    customerPhone: document.getElementById('sales-invoice-customer-phone').value,
    customerName: document.getElementById('sales-invoice-customer-name').value,
    products: products,
    grandTotal: Number(document.getElementById('sales-invoice-grand-total').value),
    profit: getBillTotalProfit(products)
  }
  return bill;
}

// Save the sales bill to the database
function saveBillToDatabase(){
var bill = generateBill();
var request = new XMLHttpRequest();
request.open("POST","/sales/saveBill", true);
request.setRequestHeader("Content-Type", "application/json");
request.onload = function(){
  alert("Bill Saved Succesfully");
  console.log(JSON.parse(this.responseText));
}
request.send(JSON.stringify(bill));
}

// List all the products of a particular rackNo
function getProductsOfRack(rack){
var request = new XMLHttpRequest();
request.open("GET",`/products/getProductsByRack/${rack}`, true);
request.onload = function(){
  renderProducts(JSON.parse(this.responseText));
}
request.send();
}

// Render Only the list of products given to it
function renderProducts(products){
  console.log(products);
  renderComponentByName("Products");
  var container = document.getElementById('products');
  products.forEach(product=>{
    var html = `<div class="product">
                  <div class="product-title">${product.name}</div>
                  <div class="product-qty">Qty: ${product.qty}</div>
                  <div class="product-mrp">MRP: ${product.mrp} Rs.</div>
                </div>`;
    container.innerHTML+=html;
  });
}

// Search box used in "Get Product Location" Functionality
function search(str){
    if(str.length!=0){
        var searches = books.find(str.toUpperCase());
        clearSuggestions();
        renderSuggestions(searches);
    }
}

// Clear Suggestion used in "Get Product Location" Functionality
function clearSuggestions(){
    document.getElementById('suggestions').innerHTML = "";
}

// render Suggestions in "Get Product Location" Functionality
function renderSuggestions(suggestions){
var container = document.getElementById('suggestions');
suggestions.forEach(suggestion=>{
    var suggestion = `<div class="suggestion">
                        <div class="suggestion-title">${suggestion.name}</div>
                        <div class="stock-qty">Qty: ${suggestion.qty}</div>
                        <div class="locations">Location: ${suggestion.locations.toString()}</div>
                        <div style="font-weight: bold; font-size: 14px;">MRP: ${suggestion.mrp} Rs.</div>
                    </div>`;
    container.innerHTML+=suggestion;
});
}

// Render a Component by its name
function renderComponentByName(name){
components.forEach(component=>{
if(component.name===name){
    renderComponent(component.component);
    window.location.hash = name;
}
});
}

// Render a component given to it
function renderComponent(component){
document.body.innerHTML = component;
}

// Initial Rendering when application loads
function initialRendering(){
    renderComponentByName("Functionalities");
}



// Add More Location used in "Add New Product Functionality"
function addMoreLocation(){
    var locationsContainer = document.getElementById('locations');
    let temp1 = document.createElement('div');
    temp1.classList.add('location');

    var temp2 = document.createElement('input');
    temp2.type="text";
    temp2.placeholder="Location";
    temp2.classList.add('locationValue');

    var temp3 = document.createElement('div');
    temp3.id = "remove-location";
    temp3.addEventListener('click', function(){
      removeLocation(this);
    });
    temp3.innerHTML = "X";
    
    temp1.appendChild(temp2);
    temp1.appendChild(temp3);
    locationsContainer.appendChild(temp1);
  }
    
  // Remove a Location used in "Add New Product" Functionality
   function removeLocation(location){
     var locationsContainer = document.getElementById('locations');
     if(locationsContainer.childElementCount<2){
       alert("Not Allowed");
     }
     else {
       location.parentElement.remove();
     }
   }
    
  //  Get Product Details from the form used in "Add New Product" Functionality
   function getProductDetailsFromTheForm(){
     var locations = document.getElementsByClassName('locationValue');
     var locationValues = [];
     for(let i=0; i<locations.length; i++){
       locationValues.push(locations[i].value);
     }
     
     var details = {
       name: document.getElementById('product-name').value,
       mrp: Number(document.getElementById('mrp').value),
       qty: Number(document.getElementById('qty').value),
       purchaseDiscount: Number(document.getElementById('purchase-discount').value),
       purchasePrice: calculatePrice(document.getElementById('mrp').value, document.getElementById('purchase-discount').value),
       salesDiscount: Number(document.getElementById('sales-discount').value),
       salesPrice: calculatePrice(document.getElementById('mrp').value, document.getElementById('sales-discount').value),
       locations: locationValues,
     };

     return details;
   }

  //  Insert a product into the database used in "Add New Product" Functionality
   function insertProduct(){
     var productDetails = getProductDetailsFromTheForm();
     var request = new XMLHttpRequest();
     request.open("POST","/products/insert", true);
     request.setRequestHeader('Content-Type', "application/json");
     request.onload = function(){
         alert("Inserted Succesfully");
     }
     request.send(JSON.stringify(productDetails));
   }

  //  Calculate Price Giveb MRP and Discount
   function calculatePrice(mrp, discount){
       return mrp - (mrp*discount/100);
   }

  //  Get all the products saved in the database
   function getAllProducts(){
       var request = new XMLHttpRequest();
       request.open("GET", '/products/getAllProducts',true);
       request.onload=function(){
           var products = JSON.parse(this.responseText);
           products.forEach(product=>{
               books.insert(product);
           });
       }
       request.send();
   }


   
