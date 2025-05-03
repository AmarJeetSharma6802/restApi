import mongoose from 'mongoose'

const  connectDB = async()=>{
    try {
        // const connect = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`)
        const connect = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB connected: ${connect.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
} 

export default connectDB