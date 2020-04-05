var ObjectID = require('mongodb').ObjectID;
var moment = require('moment');
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: 'adbf189f',
  apiSecret: 'wG0NhiZVNWhDdnWz',
});

module.exports = {
    saveBill: (req,res)=>{
        var bill = req.body; //complete bill
        var products = bill.products;
        var text = 'Thanks for Shopping with Abhishek Book World \n';
        products.forEach(product=>{
            var x = `${product.name} \n Qty: ${product.qty} Total-Price: ${product.totalPrice} \n`;
            text+=x;
        });

        var productIdsAndQtys = products.map((product=>{
            return {
                id: new ObjectID(product.id),
                qty: Number(product.qty)
            }
        }));
        var queries = [];
        productIdsAndQtys.forEach(ele=>{
            var temp = {
                updateOne: {
                    "filter": {"_id": ele.id},
                    "update": {$inc: {"qty": -ele.qty}}
                }
            }
            queries.push(temp);
        });
        console.log(queries);
        bill.date = moment().format('MMMM Do YYYY');
        bill.time = moment().utcOffset("+05:30").format("LT");
        var db = req.app.locals.db;
        db.collection('sales').insertOne(bill)
        .then((sales)=>{
            db.collection("products").bulkWrite(queries).then(()=>{
                nexmo.message.sendSms('ABW', '919410622915', text,(err, responseData)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(responseData.messages);
                    }
                });
                res.json(sales.ops);
            }).catch(err=>{
                console.log(err);
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }, 

    getTodaySales: (req,res)=>{
        var todayDate = moment().format('MMMM Do YYYY');
        var db = req.app.locals.db;
        db.collection('sales').find({"date": todayDate}).toArray().then(sales=>{
            res.json(sales);
        }).catch(err=>{
            console.log(err);
        });

    }
}