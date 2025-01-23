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

// get all tech posts of a user based on their ID
export const handleGetAllPostsUserSpecific = async (req, res) => {
  try {
    const userId = req?.params.id;
    // fetch first 20 posts from the database, latest first
    const posts = await TechPostModel.find({
      "post_owner.ownerId": userId,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // send the results to the frontend
    res.status(200).send(posts);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("something went wrong");
  }
};

// get a specific post regardless of the owner
export const handleGetSpecificPostDetails = async (req, res) => {
  try {
    //extract post id from request params
    const { id: postId } = req?.params;
    console.log(postId)

    // fetch the post from the database
    const post = await TechPostModel.findById({ _id: postId });
    if (!post) {
      throw new Error("post not found!");
    }
    console.log(post)
    // send the response to the frontend
    res.status(200).send(post);
  } catch (error) {
    console.log(error.message);
    res.status(400).send('something went wrong');
  }
};

// edit tech post
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

// delete tech post
export const handleDeleteUserPost = async (req, res) => {
  // get the req params value id of the post to be deleted
  const id = req.params.id;
  console.log(id);
};

// increment likes of a tech post
export const handlePostLiking = async (req, res) => {
  try {
    const data = req?.body;
    const post = await TechPostModel.findById({ _id: data.postId });

    // will save the id user currently liking the post in clickers of likes
    const userId = data.userId;

    // saved in the notification collection
    const notificationPostData = {
      postId: data.postId,
      ownerId: data.ownerId,
      userId: data.userId,
      name: data.name,
      title: data.title,
      comments: 0,
      likes: 0,
      github: 0,
      avatar: data.avatar,
      message: data.message,
      minimessage: data.minimessage,
    };

    if (!post) {
      throw new Error("post not found!");
    }
    // if userId not present in the clickers, increment clicks else reverse
    if (
      !post.post_liked.clickers.some((clickerId) => clickerId === data.userId)
    ) {
      // increment post likes
      post.post_liked.clicks = post.post_liked.clicks + 1;

      // add userId to the clikers array
      post.post_liked.clickers.push(userId);

      // save the updated tech post
      await post.save();

      // extract the github, likes and comments of the saved post
      const { clicks: likes } = post.post_liked;
      const { clicks: github } = post.post_github;
      const { count: comments } = post.post_comments;

      // save the details of the user liking the  tech post in the reaction section
      await PostReactionModal.create({
        ...notificationPostData,
        likes,
        github,
        comments,
      });

      const results = {
        post: post,
        reaction: "liked",
      };
      // send the response to the frontend
      res.status(200).send(results);
    } else {
      // decrement tech post likes and remove the user details from the clickers array
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

    // resave the tech post with the latest updates
  } catch (error) {
    res.status(400).send("something went wrong");
  }
};

// increment github clicks once for all when visited
export const handleGithubIncremental = async (req, res) => {
  try {
    const data = req?.body;
    const post = await TechPostModel.findById({ _id: data.postId });
    // will save the id user currently liking the post in clickers of github
    const userId = data.userId;

    // saved in the notification collection
    const notificationPostData = {
      postId: data.postId,
      ownerId: data.ownerId,
      userId: data.userId,
      name: data.name,
      comments: 0,
      likes: 0,
      github: 0,
      title: data.title,
      avatar: data.avatar,
      message: data.message,
      minimessage: data.minimessage,
    };

    if (!post) {
      throw new Error("post not found!");
    }
    // if userId not present in the clickers of github, increment clicks
    if (
      !post.post_github.clickers.some((clickerId) => clickerId === data.userId)
    ) {
      // increment post likes
      post.post_github.clicks = post.post_github.clicks + 1;

      // add userId to the clikers array of github
      post.post_github.clickers.push(userId);

      // save the updated tech post
      await post.save();

      // extract the github, likes and comments of the saved post
      const { clicks: likes } = post.post_liked;
      const { clicks: github } = post.post_github;
      const { count: comments } = post.post_comments;

      // save the details of the user clicking the github  in the reaction section
      await PostReactionModal.create({
        ...notificationPostData,
        likes,
        github,
        comments,
      });
    }

    // send the response of the non mutated tech post object to the frontend
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
};

// update post comment on the post and also reflect on notification
export const handlePostCommentsCreate = async (req, res) => {
  try {
    const data = req?.body;
    console.log(data);
    // searching for post best on the postID passed
    const post = await TechPostModel.findById({ _id: data.postId });

    // saved in the post itself user comments, contains full comment
    const commentToSave = {
      userId: data.userId,
      name: data.name,
      title: data.title,
      avatar: data.avatar,
      minimessage: data.minimessage,
      country: data.country,
    };

    // saved in the notification collection, contains truncate comment
    // message has two fields separeted by comma, the message and post tiltle
    const notificationPostData = {
      postId: data.postId,
      ownerId: data.ownerId,
      userId: data.userId,
      name: data.name,
      comments: 0,
      likes: 0,
      github: 0,
      title: data.title,
      avatar: data.avatar,
      message: data.message?.split(".")[0],
      minimessage: `${
        data.message?.split(".")[1]
      } — " ${data.minimessage?.substring(0, 25)}..."`,
    };

    if (!post) {
      throw new Error("post not found!");
    }

    // increment comment counts
    post.post_comments.count = post.post_comments.count + 1;

    // add comment to the comments array
    post.post_comments.comments = [
      commentToSave,
      ...post.post_comments.comments,
    ];

    // save the updated tech post
    await post.save();

    // extract the github, likes and comments of the saved post
    const { clicks: likes } = post.post_liked;
    const { clicks: github } = post.post_github;
    const { count: comments } = post.post_comments;

    // save the details of the user making the comment in the reaction database
    await PostReactionModal.create({
      ...notificationPostData,
      likes,
      github,
      comments,
    });

    // send the response to the frontend the objecte mutated
    res.status(200).send(post);

    // resave the tech post with the latest updates
  } catch (error) {
    res.status(400).send("something went wrong");
    console.log(error.message);
  }
};

// get all tech posts reactions from the backend
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

// handle the deleteion of the reaction of a given  tech post posted by the current user.
export const handleDeletePostReaction = async (req, res) => {
  const post_reactionID = req?.params.id;

  try {
    await PostReactionModel.findByIdAndDelete({ _id: post_reactionID });
    res.status(200).send("Deleted Successfully");
  } catch (error) {
    res.status(400).send("Something Went Wrong " + error.message);
  }
};
