import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const verifyToken = async (req, res, next) => {
    try {

        console.log(`[ INFO ] In the auth middleware verifytoken`)

        const authHeader=req.headers.authorization
        
        if (!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token = authHeader.split(" ")[1]
        console.log(`This is the token ${token}`)
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
        
    } catch (error) {
        console.log(`[ ERROR ] An error occured ${error}`)
        res.status(401).json({
            message: "Invalid or Expired Token"
        })
    }
}