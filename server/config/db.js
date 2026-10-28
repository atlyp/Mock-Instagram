import mongoose from "mongoose";
// import the mongoose Object Document Model module^
// it's grabbed from "node_modules"
//  we are loading the MONGODB helper library^ mongoose is how your server talks to your database, need this above line before connecting to your database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to ${connection.connection.name}`);
    } catch (error) {
        console.log("there was an error connecting to db", error);
        process.exit(1);
    }
};
/**Above is calling the mongoose connection method
 * establishes a connection pool to mongo DB, after this- our server can store data
 */

export default connectDB;
