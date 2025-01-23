import mongoose from "mongoose";
import NetworkModel from "../model/NetworkModel.js";
import personalModel from "../model/personalModel.js";
import RequestConnectModel from "../model/RequestConnectModel.js";

// handles creation of connection request
export const handleCreateNewConnectionRequest = async (req, res) => {
  try {
    // extract data from the body
    const data = req?.body;

    // add the targetID of the user into the friends of the sending user
    const senderId = data.senderId;

    // get the targetID from the body
    const targetId = data.targetId;

    // get current user details for validating they exist or not
    const currentUserDetails = await personalModel.findById({
      _id: senderId,
    });

    if (!currentUserDetails) {
      throw new Error("user not found!");
    }

    // locate the networks model where all users friends and connections are saved.
    // the user Id will be the senderID and value of network be targetID as friend being added
    // check if useID already present means user already has friends else create new one for the first time
    const networkUser = await NetworkModel.findOne({ userID: senderId });

    if (!networkUser) {
      // user not yet have connection, create one
      const newConnection = {
        userID: senderId,
        networkID: [targetId],
      };

      // update the network count present in the personal modal
      currentUserDetails.network_count = currentUserDetails.network_count + 1;

      // resave the user with updated details of network count
      await currentUserDetails.save();

      // save new connection
      await NetworkModel.create(newConnection);

      // become the requester by sending your details to the user with their targetID
      // that you should be friends in request connect model
      await RequestConnectModel.create(data);

      // send response to the frontend successful
      res.status(200).send("user added to your network");
    } else {
      // user already has connection its just add more new connection by check if targetID exist or not
      if (
        !networkUser.networkID.some((availableIDs) => availableIDs === targetId)
      ) {
        // update the network count present in the personal modal
        currentUserDetails.network_count = currentUserDetails.network_count + 1;

        // resave the user with updated details of network count
        await currentUserDetails.save();

        // user not available add them to the network
        networkUser.networkID = [...targetId, ...networkUser.networkID];

        // save the network
        await networkUser.save();

        // become the requester by sending your details to the user with their targetID
        // that you should be friends in request connect model
        await RequestConnectModel.create(data);
      }

      // send response to the frontend that user has been added to your network
      res.status(200).send("user added to your network");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("failed to initiate request");
  }
};

// handles fetching of all possible connection request
export const handleGetAllConnectionRequest = async (req, res) => {
  try {
    // retrieves all connect request aimed to the target user if any
    const targetId = req?.params.id;
    // fetching the first 20 requests and in based on latest first
    const requestsAvailable = await RequestConnectModel.find({ targetId })
      .sort({ createdAt: -1 })
      .limit(20);

    //   send the results to the frontend
    res.status(200).send(requestsAvailable);
  } catch (error) {
    console.log(error);
    res.status(400).send("failed to fetch results");
  }
};

// handle getting of top 10 users who aint friend to the currently userId
// in the network array
export const handleGetTopUsersToConnect = async (req, res) => {
  try {
    const userId = req?.params.id;

    // Return all IDs of networks connected to the userID
    const networkData = await NetworkModel.findOne(
      { userID: userId },
      { networkID: 1, _id: 0 }
    );

    // Obtain the whole array of network IDs
    const currentUserNetwork = networkData ? networkData.networkID : [];

    // Convert all network IDs and the current user ID to ObjectId
    // Map network IDs to ObjectId. Exclude also current user ID as ObjectId
    const excludedIds = [
      ...[userId],
      ...currentUserNetwork.map((id) => new mongoose.Types.ObjectId(id)),
    ];

    // Return users not in the network and exclude the current owner ID
    // Exclude the current user and their network IDs
    const nonFriends = await personalModel.find(
      {
        _id: { $nin: excludedIds },
      },
      { name: 1, specialisationTitle: 1, country: 1, county: 1, avatar: 1 }
    );

    // Respond with the non-friends
    res.status(200).send(nonFriends);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
};
