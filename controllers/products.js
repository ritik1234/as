var ObjectID = require('mongodb').ObjectID;
module.exports = {
    insert: (req,res)=>{
        var db = req.app.locals.db;
        var productDetails = req.body;
        db.collection('products').insertOne(productDetails).then(product=>{
            res.json(product.ops);
        }).catch(err=>{
            console.log(err);
        });
    },

    getAllProducts: (req,res)=>{
        var db = req.app.locals.db;
        db.collection('products').find({}).toArray().then(products=>{
            res.json(products);
        }).catch(err=>{
            console.log(err);
        });
    },

    getProductsByRack: (req,res)=>{
        var db = req.app.locals.db;
        var rack = req.params.rackNo;
        db.collection('products').find({locations: rack}).sort([['name',1]]).toArray().then(products=>{
            res.json(products);
        }).catch(err=>{
            console.log(err);
        })
    }
}