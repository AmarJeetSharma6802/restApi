import arrPop from "../model/chek.js"
import { imagekit } from "../utils/imagekit.js"

const getData = async(req,res)=>{
    try {
        
        const foundUser = await arrPop.find()
        if(!foundUser){
            return res.json({message:"user not found"}).status(404)
        }
        return res.status(201).json({message:"user found succefully"})
    } catch (error) {
        console.log(error)
    }
}

const popUploadedVcideo  = 

export  {
    getData
}