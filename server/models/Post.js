import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: String,
        body: String,
        // tags: { type: Array, required: false },
        // views: Number,
        // reactions: Object,
        userId: { type: String, required: true },
        // userId: {
        //     // userId- stores the id of who created the post- every post belongs to a user and every post document has a reference to who created it in the first place, the fact that every post belongs to a user is THEEE relationship between two collections
        // type: mongoose.Schema.Types.ObjectId,
        //     //   ^ this defines the TYPe of the data field- mongoDB have a SPECIAL "type" called "ObjectId" - its a 12-byte binary value, usually shown as 24 hex characters and it's automatically generated for "_id" and it's GLOBALLY unique-

        //     // each post document will have a userId field and that will store the users "_id" value- like such > "post.userId = user._id"
        //     //   this is called a reference
        //     //   MongoDB calls this a manual reference — storing another document's _id.

        //     // the _id field is accesible by using ObjectId- with the correct reference - shown below
        // ref: "User",
        // required: true,
        // },
        author: String,
        likes: { type: Object, required: true },
    },
    { timestamps: true },
);

export default mongoose.model("Post", postSchema);

// users collection
// ----------------
// _id: 665e1a8b9b23c4c01c82d4e8
// username: alice
// posts collection
// ----------------
// title: "Hello"
// userId: 665e1a8b9b23c4c01c82d4e8
