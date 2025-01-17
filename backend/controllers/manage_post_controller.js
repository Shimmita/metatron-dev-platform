import sharp from "sharp";
import {
  default as PostReactionModal,
  default as PostReactionModel,
} from "../model/PostReactionModel.js";
import {
  default as TechPostModal,
  default as TechPostModel,
} from "../model/TechPostModel.js";
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
    // retrieve all posts in order of latest first
    const allPosts = await TechPostModal.find({})
      .sort({ createdAt: -1 })
      .limit(20);
    // posts not made its empty
    if (allPosts.length < 1) {
      throw new Error(
        "currently there are no posts made by the users on the platform kindly try again later."
      );
    }

    // posts are present
    res.status(200).send(allPosts);
  } catch (error) {
    res.status(400).send(error.message);
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

// delete post
export const handleDeleteUserPost = async (req, res) => {
  // get the req params value id of the post to be deleted
  const id = req.params.id;
  console.log(id);
};

// increment like
export const handlePostLiking = async (req, res) => {
  try {
    const data = req?.body;
    const post = await TechPostModel.findById({ _id: data.postId });

    // will save the id user currently liking the post in clickers
    const userId = data.userId;

    // saved in the notification collection
    const notificationPostData = {
      postId: data.postId,
      ownerId: data.ownerId,
      userId: data.userId,
      name: data.name,
      title: data.title,
      avatar: data.avatar,
      message: data.message,
      minimessage: data.minimessage,
    };

    if (!post) {
      throw new Error("something went wrong");
    }
    // if userId not present in the clickers, increment clicks else reverse
    if (
      !post.post_liked.clickers.some((clickerId) => clickerId === data.userId)
    ) {
      // increment post likes
      post.post_liked.clicks = post.post_liked.clicks + 1;

      // add userId to the clikers array
      post.post_liked.clickers.push(userId);

      // save the updated post
      await post.save();

      // save the details of the user liking the post in the reaction section
      await PostReactionModal.create(notificationPostData);

      const results = {
        post: post,
        reaction: "liked",
      };
      // send the response to the frontend
      res.status(200).send(results);
    } else {
      // decrement post likes and remove the user details from the clickers array
      post.post_liked.clicks =
        post.post_liked.clicks > 0 ? post.post_liked.clicks - 1 : 0;
      // remove the userId from clickers array
      post.post_liked.clickers = post.post_liked.clickers.filter(
        (clickerId) => clickerId !== data.userId
      );

      // save the updated post
      await post.save();
      // remove the current user details in the postreactions details
      await PostReactionModal.findOneAndDelete({ userId });

      const results = {
        post: post,
        reaction: "disliked",
      };

      // send response to the frontend
      res.status(200).send(results);
    }

    // resave the post with the latest updates
  } catch (error) {
    res.status(400).send("something went wrong");
    console.log(error.message);
  }
};

// get all posts reactions from the backend
export const handleGetAllPostsReactions = async (req, res) => {
  try {
    // use the userID against ownersIDs in the notif if match result response
    const currentUserId = req?.params?.id;

    // fetch all matching likes collection
    const postLikes = await PostReactionModel.find({
      ownerId: currentUserId,
    }).sort({ createdAt: -1 });
    // fetch all matching comments collection etc

    // send response to the frontend
    res.status(200).send(postLikes);
  } catch (error) {
    res
      .status(400)
      .send("something went wrong refresh the page " + error.message);
  }
};

// handle the deleteion of the reaction of a given post posted by the current user.
export const handleDeletePostReaction = async (req, res) => {
  const post_reactionID = req?.params.id;

  try {
    await PostReactionModel.findByIdAndDelete({ _id: post_reactionID });
    res.status(200).send("Deleted Successfully");
  } catch (error) {
    res.status(400).send("Something Went Wrong " + error.message);
  }
};
