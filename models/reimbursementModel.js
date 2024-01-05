const mongoose = require("mongoose")

const reimbursementSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    reason:{
        type:String,
        required:[true,"Please specify reason for reimbursement"]
    },
    status:{
        type:String,
        default:"PENDING",
        enum:["PENDING", "ACCEPTED","REJECTED"]
    },
    raisedAt:{
        type:Number
    }
})

module.exports = mongoose.model("Reimbursement", reimbursementSchema)