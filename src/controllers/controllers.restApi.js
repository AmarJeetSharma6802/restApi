import {RestApi} from "../model/RestApi.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const GetItem = async(req,res)=>{
    const findItem = await RestApi.find()
    
    res.status(200).json(findItem)

}

// const UploadItem = async (req, res) => {
//     const { name, price } = req.body;
//     const file = req.file;
//     console.log("file :" , file)

//     if (!file) {
//         return res.status(400).json({ error: "Image is required" });
//     }

//     if (!name || !price) {
//         return res.status(400).json({ message: "Name and price are required" });
//     }

//     // Upload image to Cloudinary
//     const uploadImage = await uploadOnCloudinary(file.path);
//     console.log("uploadImage : ", uploadImage)

//     if (!uploadImage) {
//         return res.status(500).json({ error: "Upload failed" });
//     }

//     // Save item to the database
//     const user = await RestApi.create({
//         name,
//         price,
//         image: uploadImage.secure_url,
//     });

//     return res.json({ message: "Item created successfully", user }).status(200);
// };

const UploadItem = async (req, res) => {
    const { name, price } = req.body;
     const file = req.files?.image?.[0];

    // console.log("Body:", req.body);
    // console.log("File:", file);

    if (!file) {
        return res.status(400).json({ error: "Image is required" });
    }

    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required" });
    }

    let uploadImage;
    try {
        uploadImage = await uploadOnCloudinary(file.buffer);
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ error: "Upload failed at Cloudinary" });
    }

    if (!uploadImage) {
        return res.status(500).json({ error: "Upload failed" });
    }

    const user = await RestApi.create({
        name,
        price,
        image: uploadImage.secure_url,
    });

    return res.status(200).json({ message: "Item created successfully", user });
};


const ShowItem = async(req,res)=>{
    const id  = req.params.id

    try {
        const findItem = await RestApi.findById(id)

        if(!findItem){
            return res.json({message:"item not found "}).status(404)
        }
        return res.status(200).json({
            message: "Item found successfully",
            item: findItem
        });
    } catch (error) {
        return res.json({message:"Invalid ID or database error" } ).status(404)
    }
}

const UpdateImage = async (req, res) => {
    const { id } = req.params;
    
        const file = req.files?.image?.[0];

    const{name,price} = req.body

    if (!file) return res.status(400).json({ error: "Image is required" });

    // const uploadedImage = await uploadOnCloudinary(file.path);
    const uploadedImage = await uploadOnCloudinary(file.buffer);

    if (!uploadedImage) return res.status(500).json({ error: "Image upload failed" });

    const updatedItem = await RestApi.findByIdAndUpdate(
        id,
        { 
            image: uploadedImage.secure_url,
            name,
            price
         },
        { new: true }
    );

    if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Image updated successfully", updatedItem });
};


const DeleteItem = async(req,res)=>{

    const id  = req.params.id

    const findItem = await RestApi.findByIdAndDelete(id)

    if(!findItem){
        return res.json({message:"item not find"}).status(404)
    }

    return res.json({message:"item delete succefully", findItem}).status(201)
}

const SearchItems  = async (req,res)=>{
    const {query} = req.query

    try {
        const  results = await RestApi.find({
            name: { $regex: query, $options: "i" } // case-insensitive search
        })
        res.status(200).json({
            message: "Search results",
            results,
        });
    } catch (error) {
        res.status(500).json({ message: "Search failed", error });
    }
}
// http://localhost:3000/itemApi/search?query=nike

export {
    GetItem,
    UploadItem,
    ShowItem,
    UpdateImage,
    DeleteItem,
    SearchItems
}