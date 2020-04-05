const components = [];
const date = new Date();
class Component {
    constructor(name,component){
      this.name = name;
      this.component = component;
    }
  }

components.push(new Component("Add Product Form", `<div id="add-product">
<h2>Add New Product</h2>
<input type="text" placeholder="Product Name" id="product-name" class="input" required>
<input type="number" placeholder="MRP" id="mrp" class="input" required>
<input type="number" placeholder="Qty." id="qty" class="input" required>
<input type="number" placeholder="Purchase Discount" id="purchase-discount" class="input" required>
<input type="number" placeholder="Sales Discount" id="sales-discount" class="input" required>
<div id="locations">
<div class="location">
    <input type="text" placeholder="Location" class="locationValue" required>
    <div id="remove-location" onclick="removeLocation(this)">X</div>
</div>
</div>
<button id="add-more-location" onclick="addMoreLocation()">Add More Location</button>
<button id="add-product-btn" onclick="insertProduct()">Insert Product</button>

</div>`));

components.push(new Component("Functionalities", `<div id="functionalities">
<div class="function" onclick="renderComponentByName('Get Product Location')">Get Product Location</div>
<div class="function" onclick="renderComponentByName('Add Product Form')">Add New Product</div>
<div class="function" onclick="renderComponentByName('Racks')">Show Products of Rack</div>
<div class="function" onclick="renderComponentByName('Sales-Invoice')">Create Bill</div>
<div class="function" onclick="renderTodaySales()">Today Sales</div>
</div>`));

components.push(new Component("Get Product Location", `<div id="get-location-of-product">
<input type="text" placeholder="Product Name..." id="searched-product" oninput="search(this.value)">
<div id="suggestions">
</div>
</div>`));

components.push(new Component("Racks", `<div id="racks">
<div class="rack" onclick="getProductsOfRack('A1')">A1</div>
<div class="rack" onclick="getProductsOfRack('A2')">A2</div>
<div class="rack">A3</div>
<div class="rack" onclick="getProductsOfRack('A4')">A4</div>
<div class="rack">A5</div>
<div class="rack">A6</div>
</div>`));

components.push(new Component("Products", `<div id="products"></div>`));

components.push(new Component("Sales-Invoice", `<div id="sales-invoice">
<input type="text" value='${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}' id="sales-invoice-date" readonly>
<input type="text" placeholder="Phone Number" id="sales-invoice-customer-phone" minlength="10" maxlength="10">
<input type="text" placeholder="Customer Name" id="sales-invoice-customer-name" value="Cash">

  <div id="sales-invoice-table">
      <div id="sales-invoice-table-headers">
        <div class="sales-invoice-table-header sales-invoice-product-name-header">Product Name</div>
        <div class="sales-invoice-table-header">Qty.</div>
        <div class="sales-invoice-table-header">MRP</div>
        <div class="sales-invoice-table-header">%</div>
        <div class="sales-invoice-table-header">Price</div>
        <div class="sales-invoice-table-header">Total Price</div>
      </div>
    
      <div id="sales-invoice-table-rows">
        
      </div>
  </div>

  <input type="text" placeholder="Enter the Product" id="sales-invoice-product-search" oninput="salesProductSuggestions()">
  <div id="sales-invoice-product-suggestions"></div>
<input type="number" id="sales-invoice-grand-total" value=0 readonly>
<button id="save-sales-invoice-to-the-database" onclick="saveBillToDatabase()" style="padding: 5px; border: 0px; color: white; background: dodgerblue;">Save Bill</button>
</div>
`));

components.push(new Component('today-sales', `<div id="today-sales">
    <div id="today-sales-and-profit">
     
    </div>
</div>`))