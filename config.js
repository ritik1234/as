const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes')

module.exports = function(app){
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use('/products', productRoutes);
app.use('/sales', salesRoutes);
app.set('view engine', 'ejs');
return app; 
}