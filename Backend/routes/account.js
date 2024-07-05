const {Router} = require('express');
const authMiddleware = require('../middleware');
const { Account } = require('../db/db');
const mongoose = require('mongoose')

const router = Router();

// get balance route
router.get("/balance", authMiddleware, async (req,res)=>{
    const user = await Account.findOne({
        userId : req.userId
    })

    if(!user){
        return res.status(411).json({
            msg : "Invalid account"
        })
    }

    res.json({
        balance : user.balance
    })
})

// transaction route
router.post("/transfer",authMiddleware, async (req,res)=>{

    const session = await mongoose.startSession();

    session.startTransaction();
    const toAccount = req.body.to;
    const amount = req.body.amount;

    const acc = await Account.findOne({
        userId : toAccount
    })

    if(!acc){
        session.abortTransaction();
        return res.status(404).json({
            msg : "Invalid account"
        })
    }

    const fromAccount = await Account.findOne({
        userId : req.userId
    })

    if(fromAccount.balance < amount){
        session.abortTransaction();
        return res.status(400).json({
            msg :  "Insufficient balance"
        })
    }

    await Account.updateOne({
        userId : req.userId
    },{
        "$inc":{
            balance : -amount
        }
    }).session(session);

    await Account.updateOne({
        userId : toAccount
    },{
        "$inc":{
            balance : amount
        }
    }).session(session);

    await session.commitTransaction();
    res.json({
        msg : "Transfer successful"
    });



    
})

module.exports = router;