import Post from "../models/post.model.js";
import { uploadCloudinary } from "../utils/cloudinaryUpload.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    
    console.log("Post Controller Here")
    if (!content && !req.file) {
      return res.status(400).json({ msg: "Cannot make an empty post" });
    }

    var imageUrl = null;
    var videoUrl = null;
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video/")
      const type = isVideo ? "video":"image"
    
        const uploadResult = await uploadCloudinary(
            req.file.buffer,
            "debate-dojo_posts",
            type
        );

        if (type === "video") videoUrl = uploadResult.secure_url;
        else imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
        author: req.user._id,
        content: content,
        video: videoUrl,
        image: imageUrl
    });

    return res.status(201).json({msg: "Post created successfully",post})
  } catch (error) {
    console.error(`Error occured while creating post ${error}`)
    res.status(500).json({msg : "Internal Server Error.Dont worry our best minds are working on it!"})
  }
};

