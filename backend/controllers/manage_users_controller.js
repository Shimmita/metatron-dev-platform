import personalModel from "../model/personalModel.js";

// controls sending the request to the deployed Ai model for response
export const handleGetSpecifcUser = async (req, res) => {
  try {
    // extract the id passed in req
    const userId = req?.params.id;
    // look for a user with the matching id and return
    const user = await personalModel.findById({ _id: userId });
    if (!user) {
      throw new Error(
        "user not found they may be suspended or deleted from the platform!"
      );
    }

    // return the results to the frontend
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
