import Video from "../model/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { RestApi } from "../model/RestApi.model.js";

const VideoData = async (req, res) => {
  const findVdideo = await Video.find().populate("user", "name price");
  if (!findVdideo) {
    return res.status(404).json({ message: "No videos found" });
  }
  return res.status(200).json(findVdideo);
};

const uploadVideo = async (req, res) => {
  const { videoTitle, userId } = req.body;
  //     console.log("Incoming body:", req.body);
  // console.log("Incoming files:", req.files);

  const VideoFile = req.files?.video?.[0];

  if (!VideoFile) {
    return res.status(400).json({ message: "No video file provided" });
  }
  const user = await RestApi.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const uploadedVideo = await uploadOnCloudinary(VideoFile.buffer, "video");

  if (!uploadedVideo) {
    return res.status(500).json({ error: "Video upload failed" });
  }
  const NewVideo = await Video.create({
    // user: user._id,
    user: userId,
    videoTitle: videoTitle,
    video: uploadedVideo.secure_url,
  });
  res.status(201).json({ message: "Video uploaded", video: NewVideo });
};

const getVideoById = async (req, res) => {
  const id = req.params.id;

  const video = await Video.findById(id).populate("user", "name prince");
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }
  return res.status(200).json(video);
};

const updatedVideo = async (req, res) => {
  const { id } = req.params;
  const { videoTitle } = req.body;
  const VideoFile = req.files?.video?.[0];

  if (!VideoFile) return res.status(400).json({ error: "Video is required" });

  const uploadedVideo = await uploadOnCloudinary(VideoFile.buffer, "video");

  if (!uploadedVideo) {
    return res.status(500).json({ message: "Video upload failed" });
  }

  const upadteVideoData = await Video.findByIdAndUpdate(
    id,
    {
      videoTitle,
      video: uploadedVideo.secure_url,
    },
    { new: true }
  );

  if (!upadteVideoData) {
    return res.status(404).json({ message: "Video not found" });
  }
  return res
    .status(200)
    .json({ message: "Video updated successfully", upadteVideoData });
};
const DeleteVideo = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findByIdAndDelete(id);
  if (!video) {
    return res.status(404).json({ message: "Video not Found" });
  }
  return res.status(201).json({ message: "Video Deleted Successfully", Video });
};

const videoAggregate = async (req, res) => {
  const page = parseInt(req.query) || 1;
  const limit = parseInt(req.qeruy.limit) || 5;

  const pipeline = [
    {
      $lookup: {
        from: "restapi",
        localField: "user",
        foreignfield: "_id",
        as: "user",
      },
    },
    {
      $unwind: { // convert in array
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};

export { VideoData, uploadVideo, getVideoById, updatedVideo, DeleteVideo };

// Tumhe manually .arrayBuffer() call karna padta hai.
// Fir Buffer.from() se Node.js buffer banana padta hai.
