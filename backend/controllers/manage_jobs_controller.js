import fs from "fs";
import { Storage } from "megajs";
import sharp from "sharp";
import JobPostModel from "../model/JobPostModel.js";

// // initialise mega drive
// const mega = new Storage({
//   email: process.env.MEGADRIVE_EMAIL,
//   password: process.env.MEGADRIVE_PASS,
//   autoload: true,
// });

// creating of new post
export const handleCreateJob = async (req, res) => {
  try {
    // extract the post object from the form data passed as body from frontend
    const data = JSON.parse(req?.body.job);

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
        "metatron/jobs"
      );

      // getting vatar url and ID from the result of cloudinary upload
      const logo = result.secure_url;
      const logoID = result.public_id;
      await JobPostModel.create({ ...data, logo, logoID });
      res.status(200).send("post uploaded successfully");
    } else {
      // save the user they have no file especially logo
      await JobPostModel.create(data);
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

// get all jobs
export const handleGetAllobs = async (req, res) => {
  try {
    const allJobs = await JobPostModel.find({});
    // no jobs posted
    if (allJobs.length < 1) {
      throw new Error("currently there are no jobs");
    }

    // jobs present
    res.status(200).send(allJobs);
  } catch (error) {
    res.status(400).send("something went wrong");
  }
};

// get specific post or one post
export const handleGetSpecificJobPost = async (req, res) => {
  try {
    const id = req?.params.id;
    const job = await JobPostModel.findById({ _id: id });
    // job found
    res.status(200).send(job);
  } catch (error) {
    res.status(400).send("job not found");
  }
};

// delete the job post
export const handleDeleteJobPost = async (req, res) => {
  // get the req params value id of the post to be deleted
  const id = req.params.id;
  console.log(id);
};

// handle job application

// delete the job post
export const handleJobApplication = async (req, res) => {
  try {
    // extract the post object from the form data passed as body from frontend
    const data = JSON.parse(req?.body.jobItem);
    // extracting files
    const files = req.files;
    if (files) {
    
      console.log(files);
      res.status(200).send("files is present");
    } else {
      res.status(200).send("files is absent");
    }
  } catch (error) {
    res.status(200).send("something went wrong");
  }
};
