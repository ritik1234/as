const router = require('express').Router();
const controller = require('../controllers/products');

router.post('/insert', controller.insert);
router.get('/getAllProducts', controller.getAllProducts);
router.get('/getProductsByRack/:rackNo', controller.getProductsByRack);
module.exports = router; 