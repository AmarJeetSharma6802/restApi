import imagesData from "../model/multipleImages.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const imagesUpload = async (req, res) => {
  try {
    const { name, title } = req.body;

    if (!name || !title) {
      return res.status(400).json({ message: "All fields required" });
    }

    const files = req.files?.images || [];

    if (files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const uploadedImages = [];

    for (let file of files) {
      const uploaded = await uploadOnCloudinary(file.buffer);
      uploadedImages.push(uploaded.secure_url);
    }

    const details = await imagesData.create({
      name,
      title,
      images: uploadedImages,
    });

    res.status(201).json({ message: "Details Created", details });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export { imagesUpload };
