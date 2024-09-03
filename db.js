const mongoose = require('mongoose');
require('dotenv').config(); // Import and configure dotenv

// Specify the database URI from environment variables
const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB and the Foodie database");

    // Fetch the food_items collection
    const fetched_data = mongoose.connection.db.collection("food_items");
    // Convert the cursor to an array
    const data = await fetched_data.find({}).toArray();

    // Fetch the foodcategory collection
    const foodCategory = mongoose.connection.db.collection("foodcategory");
    const data1 = await foodCategory.find({}).toArray();

    global.food_items = data;
    global.foodCategory = data1;

  } catch (err) {
    console.error("Error while connecting to MongoDB or fetching data:", err.message);
  }
};

module.exports = mongoDB;
