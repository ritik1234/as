const router = require('express').Router();
const controller = require('../controllers/sales');

router.post('/saveBill', controller.saveBill);
router.get('/getTodaySales', controller.getTodaySales);
module.exports = router;  