const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Lets-Out";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
    // Add owner to each listing
    const listingsWithOwner = initData.data.map((obj) => ({
      ...obj,
      owner: "67ea3059db478d5e65a7fe96" // Replace with actual user ID
  }));
// Insert the modified listings
await Listing.insertMany(listingsWithOwner);
  
  console.log("data was initialized");
 };

initDB();
