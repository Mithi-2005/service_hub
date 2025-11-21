import User from "../models/user.model.js";
import { genToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";


const SALT_ROUNDS=parseInt(process.env.SALT_ROUNDS)

export const loginUser = async (req, res) => {
  try {
    console.log("[ INFO ] Login controller called");
    const { email, password } = req.body;
    const existing = await User.findOne({
      $and: [{ email }],
    });

    if (!existing) {
      return res.status(400).json({
        message: "User with this email does not exist!",
      });
    }
    const bool_password = await bcrypt.compare(password, existing.password);

    if (!bool_password) {
      return res.status(400).json({
        message: "Incorrect Password!",
      });
    }
    
    return res.status(200).json({
            message: "Login successful!",
            token: genToken(existing._id),
            user : {
                username: existing.username,
                email: existing.email
            }

        })
  } catch (error) {
    console.error(`[ ERROR ] Error occured - ${error}`);

    res.status(500).json({
      message:
        "Internal Server Error! Dont worry it is not your fault. Our best minds are working on it",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    console.log("[ INFO ] Signup controller used");
    const { username, email, password, dob, full_name, mobile_no } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { mobile_no }, { username }],
    });

    if (existing) {
      return res.status(400).json({
        message: "User with this email/mobile/username already exists!",
      });
    }

    const hashed_password =await bcrypt.hash(password, parseInt(SALT_ROUNDS));

    const newUser = await User.create({
      username,
      mobile_no,
      dob,
      email,
      full_name,
      password:hashed_password,
    });

    return res.status(200).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(`[ ERROR ] Error occured - ${error}`);

    res.status(500).json({
      message:
        "Internal Server Error! Dont worry it is not your fault. Our best minds are working on it",
    });
  }
};
