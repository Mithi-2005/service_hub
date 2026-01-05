import User from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinaryUpload.js";

export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, full_name, mobile_no, dob } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (full_name) user.full_name = full_name;
    if (mobile_no) user.mobile_no = mobile_no;
    if (dob) user.dob = dob;

    if (req.file) {
      const uploadResult = await uploadCloudinary(
        req.file.buffer,
        "debate-dojo_profile_pics",
        "image"
      );
      user.profilePic = uploadResult.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        full_name: user.full_name,
        mobile_no: user.mobile_no,
        dob: user.dob,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(`EDIT PROFILE ERROR - ${error}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error, Out best minds are working on it!",
      });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User nor found" });
    }

    return res.status(200).json({
      message: "Get Profile Successfully called",
      user: {
        username: user.username,
        email: user.email,
        dob: user.dob,
        full_name: user.full_name,
        mobile_no: user.mobile_no,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(`GET PROFILE ERROR - ${error}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error, Our best minds are working on it!",
      });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUserName = req.user.username;
    const targetUserName = req.params.username;
    console.log(currentUserName);

    if (currentUserName === targetUserName) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findOne({ username: targetUserName });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUserId = targetUser._id;

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "Unfollowed successfully",
        followingCount: currentUser.following.length,
        followersCount: targetUser.followers.length,
      });
    } else {
      console.log(currentUser,targetUser)
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "Followed successfully",
        followingCount: currentUser.following.length,
        followersCount: currentUser.followers.length,
      });
    }
  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    return res
      .status(500)
      .json({
        message: "Internal Server Error, Our best minds are working on it!",
      });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.find({ username: username }).populate(
      "followers",
      "username full_name porfilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Followers fetched successfully",
      count: user.followers.length,
      followers: user.followers,
    });
  } catch (error) {
    console.error(`GET FOLLOWERS ERROR - ${error}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error, Our best minds are working on it!",
      });
  }
};
export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.find({ username: username }).populate(
      "following",
      "username full_name porfilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Following fetched successfully",
      count: user.following.length,
      following: user.following,
    });
  } catch (error) {
    console.error(`GET FOLLOWING ERROR - ${error}`);
    return res
      .status(500)
      .json({
        message: "Internal Server Error, Our best minds are working on it!",
      });
  }
};
