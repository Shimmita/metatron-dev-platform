import sharp from "sharp";
import TechPostModal from "../model/TechPostModel.js";
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
    var message = `${error.message}`;
    if (message.toLowerCase().includes("cloudinary")) {
      message = "please check your internet connection";
    } else {
      message = "something went wrong try again";
    }
    res.status(400).send(message);
  }
};

// get all posts
export const handleGetAllTechiePost = async (req, res) => {
  try {
    const allPosts = await TechPostModal.find({})
    // posts not made its empty
    if (allPosts.length < 1) {
      throw new Error("currently there are no posts");
      return;
    }

    // posts are present
    res.status(200).send(allPosts);
  } catch (error) {
    res.status(400).send("something went wrong. " + error.message);
  }
};

// get specific post or one post
const handleGetSpecificPost = async () => {
  const id = req?.params.id;
};

// edit post
export const handleUpdateUserPost = async (req, res) => {
  // get the body
  const body = req?.body;
  // obtain id passed as params
  const id = req.params.id;

  try {
    await TechPostModal.findByIdAndUpdate(
      { _id: id },
      { $set: { post_body: body } }
    );

    res.status(200).send("post updated successfully");
  } catch (error) {
    res.status(400).send("failed to update post " + error.message);
  }
};

export const handleDeleteUserPost = async (req, res) => {
  // get the req params value id of the post to be deleted
  const id = req.params.id;
  console.log(id);
};
