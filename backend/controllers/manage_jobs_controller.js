import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import JobPostModel from "../model/JobPostModel.js";
import JobsAppliedModel from "../model/JobsAppliedModel.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

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
        "metatron/jobs/posts"
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
export const handleGetAllJobs = async (req, res) => {
  try {
    // sort them the latest first
    const allJobs = await JobPostModel.find({}).sort({ createdAt: -1 });
    // no jobs posted
    if (allJobs.length < 1) {
      throw new Error(
        "currently there are no jobs please check on this page later when jobs are populated by the recruiters."
      );
    }

    // jobs present
    res.status(200).send(allJobs);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get top 3 jobs that are lates
export const handleGetAllJobsLatest = async (req, res) => {
  try {
    // sort them the latest first
    const latestJobs = await JobPostModel.find({})
      .sort({ createdAt: -1 })
      .limit(3);
    // no jobs posted
    if (latestJobs.length < 1) {
      throw new Error(
        "currently there are no selected jobs please check on this page later."
      );
    }

    // jobs present
    res.status(200).send(latestJobs);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get verified jobs onlyd
export const handleGetVerifiedJobs = async (req, res) => {
  try {
    const allJobs = await JobPostModel.find({
      $or: [{ website: "" }, { website: null }],
    }).sort({ createdAt: -1 });
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

// handle getting of the nearby jobs=country of the user
export const handleGetNearbyJobs = async (req, res) => {
  // extract the country of the user from the request body
  const { country } = req.body;

  try {
    const allJobs = await JobPostModel.find({
      "location.country": { $regex: country, $options: "i" },
    }).sort({ createdAt: -1 });
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

// handle the searching of the job
export const handleGetAllJobsSearch = async (req, res) => {
  try {
    const { job_titles = [], datePosted, country, entry } = req.body;

    // Validate job_titles array
    if (!Array.isArray(job_titles)) {
      return res.status(400).send("job_titles should be an array");
    }

    // Initialize query
    const query = { $and: [] };

    // Handle job_titles search
    if (job_titles.length > 0) {
      query.$and.push({
        $or: [
          ...job_titles.map((term) => ({
            title: { $regex: term, $options: "i" },
          })),
          ...job_titles.map((term) => ({
            skills: { $elemMatch: { $regex: term, $options: "i" } },
          })),
        ],
      });
    }

    // Handle datePosted filter
    if (datePosted) {
      const now = new Date();
      let startDate = null;
      let endDate = null;

      if (datePosted === "Today") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
      } else if (datePosted === "Yesterday") {
        startDate = new Date(now.setDate(now.getDate() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (datePosted === "Three Days") {
        startDate = new Date(now.setDate(now.getDate() - 2));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (datePosted === "One Week") {
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
      } else if (datePosted === "Two Weeks") {
        startDate = new Date(now.setDate(now.getDate() - 14));
        endDate = new Date();
      }

      if (startDate || endDate) {
        const dateQuery = {};
        if (startDate) dateQuery.$gte = startDate;
        if (endDate) dateQuery.$lt = endDate;

        query.$and.push({ createdAt: dateQuery });
      }
    }

    // Handle country filter
    if (country) {
      query.$and.push({
        "location.country": { $regex: country, $options: "i" },
      });
    }

    // Handle entry filter
    if (entry) {
      query.$and.push({ "entry.level": { $regex: entry, $options: "i" } });
    }

    // Fetch jobs from the database latest first on the search results
    const searchResults = await JobPostModel.find(query).sort({
      createdAt: -1,
    });

    // no job found
    if (searchResults.length < 1) {
      return res.status(404).json("No matching jobs found.");
    }

    // return matching jobs
    res.status(200).json({
      message: `Found ${searchResults.length} ${
        searchResults.length > 1 ? "jobs" : "job"
      }.`,
      data: searchResults,
    });
  } catch (error) {
    res.status(500).json(error.message);
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

// handle job application. cloud is supabase for CV and Cover letter
export const handleJobApplication = async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // extract the post object from the form data passed as body from frontend
    const dataBody = JSON.parse(req?.body.jobItem);
    const file = req?.file;
    // will be used to update the main job respective values
    const jobID = dataBody?.jobID;
    const gender = dataBody?.applicant?.gender?.trim()?.toLowerCase();

    //   check if user has file
    if (file) {
      const { file } = req;
      const { originalname, buffer } = file;

      // Upload to Supabase folder jobs/application
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(`jobs/application/${Date.now()}-${originalname}`, buffer, {
          cacheControl: "5000",
          upsert: false,
        });

      // error encountered during file upload
      if (error) {
        throw new Error(error.message);
      }
      // getting the public URl for saving
      // Extracting the public URL string for saving
      const { publicUrl } = supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(data.path).data;

      // update the target job its respective applicants info.
      const jobTarget = await JobPostModel.findById({ _id: jobID });
      // reject the application process
      if (!jobTarget) {
        throw new Error("job does not exist");
      }

      // update the detais of applicants present in the job attribute
      var { total, male, female, other } = jobTarget.applicants;
      // add +1 for total
      jobTarget.applicants.total = total + 1;
      // update male, female and other counts
      if (gender === "male") {
        // male
        jobTarget.applicants.male = male + 1;
      } else if (gender === "female") {
        // female
        jobTarget.applicants.female = female + 1;
      } else {
        // other gender
        jobTarget.applicants.other = other + 1;
      }

      // save the target and updated job results
      await jobTarget.save();

      //save the applican job request in the database
      await JobsAppliedModel.create({
        ...dataBody,
        cvLink: publicUrl,
      });
      res.status(200).send("job application successful");
    } else {
      //revoke job application, user must provide a cv
      throw new Error("please provide your cv");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(`woops ${error.message}!`);
  }
};
