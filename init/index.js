const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

const initDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj)=> ({...obj, owner: "6a9a65fd44edb512adb5fc49"}))
        await Listing.insertMany(initData.data);
        console.log("data was initialized");
        // Check description
        const data = await Listing.findOne({
            title: "Secluded Beach House in Costa Rica"
        });
        // console.log("Inserted data:");

        await mongoose.connection.close();
    } catch (err) {
        console.log(err);
    }
};

initDB();