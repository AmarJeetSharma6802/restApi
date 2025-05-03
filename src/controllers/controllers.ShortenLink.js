import ShortenLink from "../model/ShortenLink.model.js";

// const OriginalLink = async (req, res) => {
//   try {
//     const { originalUrl, shortUrl } = req.body;

//     if (!originalUrl || !shortUrl) {
//       return res.status(400).json({ message: "Please enter both links" });
//     }

//     const existingUrl = await ShortenLink.findOne({ shortUrl });

//     if (existingUrl) {
//       return res.json({
//         message: "Link already exists",
//         shortUrl: existingUrl.shortUrl,
//       });
//     }

//     const newUrl = await ShortenLink.create({ originalUrl, shortUrl });

//     // console.log("New URL Created:", newUrl);

//     return res.status(201).json({
//       message: "Link converted successfully",
//       shortUrl: `${process.env.CONVERT_URL}/${shortUrl}`,
//       success: true,
//       newUrl
//     });
//   } catch (error) {
//     console.error("Error in URL Conversion:", error);
//     return res.status(500).json({
//       message: "Error while creating new link",
//       error: error.message,
//     });
//   }
// };

const OriginalLink = async (req, res) => {
  try {
    const { originalUrl, shortUrl } = req.body;

    if (!originalUrl || !shortUrl) {
      return res.status(400).json({ message: "Please enter both links" });
    }

    const fullShortUrl = `${process.env.CONVERT_URL}/${shortUrl}`;

    const existingUrl = await ShortenLink.findOne({ shortUrl: fullShortUrl });

    if (existingUrl) {
      return res.json({
        message: "Link already exists",
        shortUrl: existingUrl.shortUrl,
      });
    }

    const newUrl = await ShortenLink.create({ originalUrl, shortUrl: fullShortUrl });

    return res.status(201).json({
      message: "Link converted successfully",
      shortUrl: fullShortUrl,
      success: true,
      newUrl
    });
  } catch (error) {
    console.error("Error in URL Conversion:", error);
    return res.status(500).json({
      message: "Error while creating new link",
      error: error.message,
    });
  }
};

// const getUrl = async (req, res) => {
//   try {
//     const { shortUrl } = req.params;
//     const findSecondUrl = await ShortenLink.findOne({ shortUrl });

//     if (!findSecondUrl) {
//       return res.status(404).json({ message: "Link not found" });
//     }

//     res.set("Access-Control-Allow-Origin", "*");
//     res.redirect(findSecondUrl.originalUrl);

//   } catch (error) {
//     console.error("Error fetching URL:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const getUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const fullShortUrl = `${process.env.CONVERT_URL}/${shortUrl}`;

    // console.log("Searching for:", fullShortUrl); 

    const findSecondUrl = await ShortenLink.findOne({ shortUrl: fullShortUrl });

    if (!findSecondUrl) {
      return res.status(404).json({ message: "Link not found" });
    }

    // console.log("Found URL:", findSecondUrl.originalUrl); 

    res.set("Access-Control-Allow-Origin", "*");
    res.redirect(findSecondUrl.originalUrl);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export { OriginalLink, getUrl };
