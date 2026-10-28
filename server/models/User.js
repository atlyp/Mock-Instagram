import mongoose from "mongoose";
// ^ need to find database structures

const userSchema = new mongoose.Schema({
    // this will describe how a user looks- like what fields exist, all users "doucments" or objects will follow this format/structure
    username: String,
    // ^ this is a schema field- the field name is name and the type most be a javascript string!
    email: String,
    password: String,
    followers: {
        count: { type: Number },
        list: { type: String },
    },
    following: {
        count: { type: Number },
        list: { type: String }, 
    },
    age: Number,
    phone: String,
    university: String,
    birthDate: String,
    height: Number,
    weight: Number,
    firstName: String,
    lastName: String,
    gender: String,
    company: Object,
    image: String,
    id: Number,
});

export default mongoose.model("User", userSchema);

// ^ here we compile  the schema into a model- the model name "User" maps to collection users, which provides database methods like ".find()"

// ^ this is  how we will save read and delete users mongo db will store them in a collection
