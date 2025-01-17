import { v2 as cloudinary } from "cloudinary";
import ffmpeg from "fluent-ffmpeg";
import sharp from "sharp";
import { Readable } from "stream";
import CourseModel from "../model/CourseModel.js";
import TechPostModal from "../model/TechPostModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// creating of new course
export const handleCreateNewCourse = async (req, res) => {
  try {
    const course_video_url = "";
    const course_video_url_id = "";

    const course_logo_url = "";
    const course_logo_url_id = "";

    // extract the post object from the form data passed as body from frontend
    const data = JSON.parse(req?.body?.course);
    const files = req?.files;

    if (!files) {
      throw new Error("provide course video file");
    }

    // video file is the only sent
    if (files.length < 2) {
      const inputBuffer = files[0].buffer;
      // convert buffer to readable stream for ffmpeg
      const inputStream = new Readable();
      inputStream.push(inputBuffer);
      // no more data to push in the input stream
      inputStream.push(null);

      // creating an outputBuffer
      const outputChunks = [];

      // creating the output stream

      // creating output stream
      const outputStream = new Readable({
        read() {
          if (outputChunks.length) {
            this.push(outputChunks.shift());
          } else {
            // is no more data
            this.push(null);
          }
        },
      });

      // process the video now using ffmpeg compressor
      ffmpeg(inputStream)
        .outputOptions(["-vcodec libx264", "-crf 28", "-preset fast"])
        .format("mp4")
        .on("data", (chunk) => outputChunks.push(chunk))
        .on("end", async () => {
          // upload video to cloudinary
          const uploadResponse = await cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: "metatron/course/videos" },
            async (err, result) => {
              if (err) {
                throw new Error("uploading the course video failed");
              }

              // extract the upload url and ID from the results and save it in a database
              course_video_url = result.secure_url;
              course_video_url_id = result.public_id;

              // begin upload of the logo file
              const logofile = files[1];
              //Compress logo image and convert the image to AVIF format
              const compressedImageBuffer = await sharp(logofile.buffer)
                .resize({ width: 500 }) // Resize to a max width of 500px
                .toFormat("avif", { quality: 70 }) // Convert to AVIF with 80% quality
                .toBuffer();

              // Upload the compressed AVIF image to Cloudinary
              const result2 = await uploadToCloudinary(
                compressedImageBuffer,
                "metatron/course/logos"
              );

              // getting vatar url and ID from the result of cloudinary upload
              course_logo_url = result2.secure_url;
              course_logo_url_id = result2.public_id;

              // finally  save the information to the database
              await CourseModel.create({
                ...data,
                course_video_url,
                course_video_url_id,
                course_logo_url,
                course_logo_url_id,
              });

              // send the response to the frontend
              res
                .status(200)
                .send(
                  "course uploaded successfully and awaits technical review from our officials. you will get notified once review is complete via email or inbox"
                );
            }
          );

          // piping the results
          outputStream.pipe(uploadResponse);
        })
        .on("error", (err) => {
          throw new Error("video compression failed:" + err);
        })
        .pipe(outputStream, { end: true });
    } else {
      // contains video and logo for the course
      // upload video to to cloud first
      const inputBuffer = files[0].buffer;
      // convert buffer to readable stream for ffmpeg
      const inputStream = new Readable();
      inputStream.push(inputBuffer);
      // no more data to push in the input stream
      inputStream.push(null);

      // creating an outputBuffer
      const outputChunks = [];

      // creating output stream
      const outputStream = new Readable({
        read() {
          if (outputChunks.length) {
            this.push(outputChunks.shift());
          } else {
            // is no more data
            this.push(null);
          }
        },
      });

      // process the video now using ffmpeg compressor
      ffmpeg(inputStream)
        .outputOptions(["-vcodec libx264", "-crf 28", "-preset fast"])
        .format("mp4")
        .on("codecData", (chunk) => outputChunks.push(chunk))
        .on("end", async () => {
          // upload video to cloudinary
          const uploadResponse = await cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: "metatron/course/videos" },
            async (err, result) => {
              if (err) {
                throw new Error("uploading the course video failed");
              }

              // extract the upload url and ID from the results and save it in a database
              course_video_url = result.secure_url;
              course_video_url_id = result.public_id;

              // begin upload of the logo file
              const logofile = files[1];
              //Compress logo image and convert the image to AVIF format
              const compressedImageBuffer = await sharp(logofile.buffer)
                .resize({ width: 500 }) // Resize to a max width of 500px
                .toFormat("avif", { quality: 70 }) // Convert to AVIF with 80% quality
                .toBuffer();

              // Upload the compressed AVIF image to Cloudinary
              const result2 = await uploadToCloudinary(
                compressedImageBuffer,
                "metatron/course/logos"
              );

              // getting vatar url and ID from the result of cloudinary upload
              course_logo_url = result2.secure_url;
              course_logo_url_id = result2.public_id;

              // finally  save the information to the database
              await CourseModel.create({
                ...data,
                course_video_url,
                course_video_url_id,
                course_logo_url,
                course_logo_url_id,
              });

              // send the response to the frontend
              res
                .status(200)
                .send(
                  "course uploaded successfully and awaits technical review from our officials. you will get notified once review is complete via email or inbox"
                );
            }
          );

          // piping the results
          outputStream.pipe(uploadResponse);
        })
        .on("error", (err) => {
          throw new Error("video compression failed:" + err);
        })
        .pipe(outputStream, { end: true });
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
