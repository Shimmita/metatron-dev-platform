import sharp from "sharp";
import CourseModel from "../model/CourseModel.js";
import TechPostModal from "../model/TechPostModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
// creating of new course
export const handleCreateNewCourse = async (req, res) => {
  try {
    // extract the post object from the form data passed as body from frontend
    const data = JSON.parse(req?.body?.course);
    const files = req?.files;

    if (!files) {
      throw new Error("upload video file");
    }

    // video file is the only sent
    if (files.length < 2) {
      // Upload video file to the cloud, consider video compression
      const result = await uploadToCloudinary(
        files[0],
        "metatron/course/video"
      );

      // getting video url and ID from the result of cloudinary upload
      const course_video_url = result.secure_url;
      const course_video_url_id = result.public_id;

      //   posting text information to the backend

      await CourseModel.create({
        ...data,
        course_video_url,
        course_video_url_id,
      });

      res
        .status(200)
        .send(
          "Course uploaded successfully.You will be notified once approved by the official team via email or platform message inbox."
        );
    } else {
      // files sent are two video and logo of the course
      const course_video_url = "";
      const course_video_url_id = "";

      const course_logo_url = "";
      const course_logo_url_id = "";

      // files video and logo
      const videoFile = files[0];
      const logofile = files[1];
      // Upload video file to the cloud, consider video compression
      const result = await uploadToCloudinary(
        videoFile,
        "metatron/course/video"
      );

      // getting video url and ID from the result of cloudinary upload
      course_video_url = result.secure_url;
      course_video_url_id = result.public_id;



      // Compress logo image and convert the image to AVIF format
    //   const compressedImageBuffer = await sharp(logofile.buffer)
    //     .resize({ width: 500 }) // Resize to a max width of 500px
    //     .toFormat("avif", { quality: 80 }) // Convert to AVIF with 80% quality
    //     .toBuffer();

    //   // Upload the compressed AVIF image to Cloudinary
    //   const result2 = await uploadToCloudinary(
    //     compressedImageBuffer,
    //     "metatron/course/logo"
    //   );

    //   // getting vatar url and ID from the result of cloudinary upload
    //   course_logo_url = result2.secure_url;
    //   course_logo_url_id = result2.public_id;

      // finally  save the information to the database
      await CourseModel.create({
        ...data,
        course_video_url,
        course_video_url_id,
        course_logo_url,
        course_logo_url_id,
      });

      res
        .status(200)
        .send(
          "Course uploaded successfully.You will be notified once approved by the official team via email or message inbox."
        );
    }
  } catch (error) {
    var message = `${error.message}`;
    if (message.toLowerCase().includes("cloudinary")) {
      message = "please check your internet connection";
    } else {
      console.log(message);
      message = "something went wrong try again";
    }
    res.status(400).send(message);
  }
};

// get all courses
export const handleGetAllCourses = async (req, res) => {
  try {
    // retrieve all posts in order of latest first
    const allPosts = await TechPostModal.find({})
      .sort({ createdAt: -1 })
      .limit(20);
    // posts not made its empty
    if (allPosts.length < 1) {
      throw new Error("sorry, there are no courses uploaded yet");
    }

    // posts are present
    res.status(200).send(allPosts);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get specific post or one post
const handleGetSpecificCourse = async () => {
  const id = req?.params.id;
};

// edit post
export const handleUpdateCourse = async (req, res) => {
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

export const handleDeleteCourse = async (req, res) => {
  // get the req params value id of the post to be deleted
  const id = req.params.id;
  console.log(id);
};
