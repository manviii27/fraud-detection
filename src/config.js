const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
    .catch(() => {
        console.log("Database cannot be Connected");
    })

// Create User Schema
const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create Profile Schema
const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const TransactionSchema = new mongoose.Schema({
    step: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        default: "PAYMENT"
    },
    amount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0 && value >= this.oldbalanceOrg;
            },
            message: "Insufficient balance"
        }
    },
    oldbalanceOrg: {
        type: Number,
        validate: {
            validator: async function (value) {
                const profile = await profileModel.findOne();
                return value === profile.balance;
            },
            message: "Balance does not match with profile"
        }
    },
    newbalanceOrg: {
        type: Number,
        default: function () {
            return this.oldbalanceOrg - this.amount;
        },
        validate: {
            validator: async function (value) {
                const profile = await profileModel.findOne();
                return value === this.oldbalanceOrg - this.amount;
            },
            message: "Insufficient balance"
        }
    },
    oldbalanceDest: {
        type: Number,
        deafult: 0
    },
    newbalanceDest: {
        type: Number,
        deafult: 0
    }
});

// Create User Model
const userModel = new mongoose.model("users", LoginSchema);
const profileModel = new mongoose.model("profile", ProfileSchema);
const transactionModel = new mongoose.model("transactions", TransactionSchema);

module.exports = {
    userModel,
    profileModel,
    transactionModel
};