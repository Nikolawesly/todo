import { Schema, model, mongoose } from "mongoose";

//create user Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:[true,"Duplicate email"]
    },
    password: {
        type: String,
        required: true,
    },
    todos: [
        {
            taskName: { type: String, required: true, },
            description: { type: String, required: true },
            status: { type:String, default: "pending" }
        }
    ]

}, {
    versionKey: false,
    timestamps: true,
    strict: true
}
)

export const UserModal = model("User", UserSchema);