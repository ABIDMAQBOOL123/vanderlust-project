const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const mongo_url ="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB")
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url)
}



const initDB = async () => {
    try {
        // Delete all existing listings
        await Listing.deleteMany({});

        // Modify data to include the owner field
        const modifiedData = initData.data.map(obj => ({ ...obj, Owner: '658d763ff910d54013218170' }));

        // Insert the modified data into the database
        await Listing.insertMany(modifiedData);

        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// Call the initDB function to initialize the database
initDB();



