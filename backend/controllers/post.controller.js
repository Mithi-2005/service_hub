import Post from "../models/post.model.js";
import { uploadCloudinary } from "../utils/cloudinaryUpload.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    console.log("Post Controller Here");
    if (!content && !req.file) {
      return res.status(400).json({ msg: "Cannot make an empty post" });
    }

    var imageUrl = null;
    var videoUrl = null;
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video/");
      const type = isVideo ? "video" : "image";

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
      image: imageUrl,
    });

    return res.status(201).json({ msg: "Post created successfully", post });
  } catch (error) {
    console.error(`Error occured while creating post ${error}`);
    res
      .status(500)
      .json({
        msg: "Internal Server Error.Dont worry our best minds are working on it!",
      });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username full_name profilePic")
      .sort({ createdAt: -1 });

    const formatted = posts.map((post) => ({
      _id: post._id,
      content: post.content,
      image: post.image,
      video: post.video,
      author: post.author,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    }));

    return res.status(200).json({
      message: "Feed fetched successfully...",
      feed: formatted,
    });
  } catch (error) {
    console.error(`FEED ERROR: ${error}`)
    res.status(500).json({ message: 'Internal Server Error'})
  }
};

export const toggleLike = async(req, res) => {
  try{
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post){
      return res.status(404).json({message:"Post not found"});
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked){
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      await post.save();

      return res.status(200).json({
        message: "Post unliked",
        likesCount: post.likes.length
      });
    }
    else{
      post.likes.push(userId);
      await post.save();

      return res.status(200).json({
        message: "Post liked",
        likesCount: post.likes.length
      });
    }


  }
  catch(error){
    console.error("[ LIKE ERROR ] : ", error)
    res.status(500).json({ message: 'Internal Server Error'})
  }
};

export const addComment = async (req, res) => {
  try {
    const postID = req.params.id
    const userID = req.user._id
    const { text } = req.body

    if(!text || text.trim().length === 0){
        return res.status(400).json({ message: 'Comment cannot be empty'})
    }

    const post = await Post.findById(postID)

    if(!post){
      return res.status(404).json({ message: 'Post Not found'})
    }
    
    const newComment = {
      user: userID,
      text,
      
      createdAt: new Date()
    };

    post.comments.push(newComment);
    
    await post.save();

    return res.status(201).json({
      message: "Comment added",
      comment: newComment,
      commentsCount: post.comments.length
    });

    
  } catch (error) {
     console.error("[ Comment ERROR ] : ", error)
     res.status(500).json({ message: 'Internal Server Error'})
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).populate("comments.user", "username full_name profilePic");
    if (!post){
      return res.status(404).json({message: "Post not found"});
    }

    return res.status(200).json({
      message: "Comments fetched",
      comments: post.comments,
      commentsCount: post.comments.length
    });
    
  } catch(error) {
     console.error("[ Comment ERROR ] : ", error)
     res.status(500).json({ message: 'Internal Server Error'})
  }
};


export const getPostDetails = async (req,res) => {
  try{
    const postId = req.params.id;
    const post = await Post.findById(postId)
    .populate("author", "username full_name profilePic")
    .populate("comments.user", "username full_name profilePic");

    if (!post){
      return res.status(404).json({message: "Post not found"});
    }

    const formattedPost = {
      _id: post._id,
      content: post.content,
      image: post.image,
      video: post.video,
      author: post.author,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      repostsCount: post.reposts.length,
      comments: post.comments,
      createdAt: post.createdAt
    };

    return res.status(200).json({
      message: "Post fetched successfully",
      post: formattedPost
    });
  }
  catch(error){
    console.error("POST DETAILS ERROR: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};