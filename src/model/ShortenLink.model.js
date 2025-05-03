import mongoose from 'mongoose';

const ShortenLinkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true 
});

const ShortenLink = mongoose.model('ShortenLink', ShortenLinkSchema);

export default ShortenLink;
