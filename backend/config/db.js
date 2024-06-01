const mongoose = require("mongoose");


const connectDB = async()=>{
    try{
        const connectDB = await mongoose.connect(process.env.Mongo_URL, {
            useNewUrlParser : true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected ${connectDB.connection.host}`);
    }
    catch (error){
        console.log(`Error : ${error.message}`);
        process.exit();
    }
}

module.exports = connectDB;