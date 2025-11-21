import multer from "multer";

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/mkv",
  "video/x-msvideo"
]

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only Images and Videos are allowed"), false)
};

const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize: 200*1024*1024}
})

export default upload