import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
        author : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },

        content : {
            type : String,
            required : true,
            trim : true,
        },

        image : {
            type : String,
            default : null
        },
        video: {
            type: String,   
            default: null,
        },
        likes : [
            {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
            }
        ],

        comments : [
            {
                user: {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                    required : true
                },
                text: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        reposts: [
            {
                user: {
                    type:mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },

                repostedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
    },
    {timestamps: true}
);

const Post = mongoose.model("Post",postSchema)

export default Post