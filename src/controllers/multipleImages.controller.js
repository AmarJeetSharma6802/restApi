import imagesData from "../model/multipleImages.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getData = async(req,res)=>{
  const findItem = await imagesData.find()

if (!findItem){
      return res.status(400).json({ message: "findItem NOT fOUND" });
    }

   res.status(200).json({ message: "item found successfully",findItem }) 
}

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

const updatedImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title } = req.body;

    if (!id) return res.status(400).json({ message: "ID is required" });

    let details = { name, title };

    const files = req.files?.images || [];
    const updates = [];

    for (let file of files) {
      const uploaded = await uploadOnCloudinary(file.buffer, file.originalname);
        updates.push(uploaded.secure_url);
    }

    if (updates.length > 0) {
      details.images = updates;
    }

    const updateById = await imagesData.findByIdAndUpdate(id, details, { new: true });

    res.status(201).json({ message: "Details updated", updateById });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export {getData, imagesUpload,updatedImages };
