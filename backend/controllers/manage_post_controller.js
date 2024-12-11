import sharp from "sharp";
import TechPostModal from "../model/TechPostModal.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
// creating of new post
export const handleCreateNewPost = async (req, res) => {
  try {
    // extract the post object from the form data passed as body from frontend
    const data = JSON.parse(req?.body.post);

    //   check if user has file
    if (req?.file) {
      // Compress and convert the image to AVIF format
      const compressedImageBuffer = await sharp(req.file.buffer)
        .resize({ width: 500 }) // Resize to a max width of 500px
        .toFormat("avif", { quality: 80 }) // Convert to AVIF with 80% quality
        .toBuffer();

      // Upload the compressed AVIF image to Cloudinary
      const result = await uploadToCloudinary(
        compressedImageBuffer,
        "metatron/post"
      );

      // getting vatar url and ID from the result of cloudinary upload
      const post_url = result.secure_url;
      const post_url_id = result.public_id;
      await TechPostModal.create({ ...data, post_url, post_url_id });
      res.status(200).send("post uploaded successfully");
    } else {
      // save the user they have no file
      await TechPostModal.create(data);
      res.status(200).send("post uploaded successfully");
    }
  } catch (error) {
    res.status(400).send("something went wrong " + error.message);
  }
};
