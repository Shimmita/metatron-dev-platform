import mongoose from "mongoose";
import personalModel from "../model/personalModel.js";
import RequestConnectModel from "../model/RequestConnectModel.js";

// handles creation of connection request
export const handleCreateNewConnectionRequest = async (req, res) => {
  try {
    // extract data from the body
    const data = req?.body;

    // add the targetID of the user into the friends of the sending user
    const senderId = new mongoose.Types.ObjectId(data?.senderId);

    // get the targetID from the body
    const targetId = new mongoose.Types.ObjectId(data.targetId);

    // get current user details for validating they exist or not
    var currentUserDetails = await personalModel.findById({
      _id: senderId,
    });

    if (!currentUserDetails) {
      throw new Error("initiating user records not found!");
    }

    // check if target user exists or not
    const targetUser = await personalModel.findById({ _id: targetId });

    if (!targetUser) {
      throw new Error("target user records not found!");
    }

    // check if the exact senderId and targetId already present in request connect db
    const requestObject = await RequestConnectModel.findOne({
      $and: [{ senderId }, { targetId }],
    });

    // the current user previously initiated connect request and probly not yet resolved by target
    if (requestObject) {
      throw new Error("you have a previous pending request");
    }

    // locate the networks array where all users friends and connections are saved.
    // the user Id will be the senderID and value of network be targetID as friend being added
    // check if the targetId is present in the friends of the sender id or not to add them.
    var friendsArraySender = currentUserDetails.network;

    var friendsArrayTargetUser = targetUser.network;

    // checking the existance of target userId in the friends of sender
    if (friendsArraySender.includes(targetId)) {
      throw new Error("You already friends!");
    }

    // checking the existance of senderId in the friends of target user
    if (friendsArrayTargetUser.includes(senderId)) {
      throw new Error("You already friends!");
    }

    // become the requester by sending your details to the user with their targetId
    // that you should be friends in request connect model
    await RequestConnectModel.create(data);

    // send response to the frontend successful
    res.status(200).send("connect request sent");
  } catch (error) {
    // debug check
    console.log(error);

    // error forwarding to the frontend
    res.status(400).send(error.message);
  }
};

// previous sender added the target user in their friends space before
// sending for connect. now target user should add the sender ID to theirs
export const handleAcceptPreviousConnectRequest = async (req, res) => {
  // the params is in the order of (senderID/targetID)
  try {
    // extract the connectRequestID from the params
    const connectRequestID = new mongoose.Types.ObjectId(
      req?.params.connectRequestID
    );
    // extract the senderId and cast  it to mongoose object type for iDs
    const senderUserID = new mongoose.Types.ObjectId(req?.params.senderID);

    // extract the target user id from the params, this is the current user logged in
    const targetUserID = new mongoose.Types.ObjectId(req?.params.targetID);

    // check if the sender user is registered on the platform
    const senderUser = await personalModel.findById({ _id: senderUserID });

    if (!senderUser) {
      // sender not exist
      throw new Error("user not exist in the system!");
    }

    // check if the target user already registered in the system or not
    const targetUser = await personalModel.findById({ _id: targetUserID });

    if (!targetUser) {
      // user not registered
      throw new Error("user not exist in the system!");
    }

    // fetch the target user networks and add the senderId if not exists
    var targetUserNetwork = targetUser.network.map((friendID) => friendID);
    var finalUpdatedNetworkTargetUser = [];
    // check is sender user exists in the network  of target or not
    if (!targetUserNetwork.some((networkID) => networkID === senderUserID)) {
      finalUpdatedNetworkTargetUser = [senderUserID, ...targetUserNetwork];
    }

    // win win situation target accepts both increment their networks by 1.
    // fetch the sender network and check if targets exists or not and do the same for network add
    // this time adding the target into the senders network and incremant senders network by 1
    var senderUserNetwork = senderUser.network.map((friendID) => friendID);
    var finalUpdatedNetworkSender = [];
    if (!senderUserNetwork.some((networkID) => networkID === targetUserID)) {
      finalUpdatedNetworkSender = [targetUserID, ...senderUserNetwork];
    }

    // update the final networks of the target and sender user
    targetUser.network = finalUpdatedNetworkTargetUser;
    senderUser.network = finalUpdatedNetworkSender;

    // increasing the network counter of the targetUser and sender user
    targetUser.network_count = targetUser.network_count + 1;
    senderUser.network_count = senderUser.network_count + 1;

    // saving the updated  target and sender users
    await targetUser.save();
    await senderUser.save();

    // delete from the request connect model since that request is no longer valid by passing
    // the request connectID
    await RequestConnectModel.findByIdAndDelete({ _id: connectRequestID });

    const results = {
      message: "You are now connected",
      targetUser,
    };

    // send response to the frontend and it be target user object since they are the currently logged in
    res.status(200).send(results);
  } catch (error) {
    // debug
    console.log(error);
    res
      .status(400)
      .send(
        error.message?.includes("24")
          ? "arguments supplied are invalid "
          : error.message
      );
  }
};

// handle reject accepting connect request from a sender. will just delete the connectRequest record
//from the collection database.
export const handleRejectAcceptingConnectRequest = async (req, res) => {
  try {
    const connectRequestID = new mongoose.Types.ObjectId(
      req?.params.connectRequestID
    );

    // first checking if the connectrequest object exists or not
    const connectRequest = await RequestConnectModel.findById({
      _id: connectRequestID,
    });

    if (!connectRequest) {
      throw new Error("connection request does not exist!");
    }

    // exists thus lets delete
    await RequestConnectModel.findByIdAndDelete({ _id: connectRequestID });

    // send response to the frontend user that operation successful
    res.status(200).send("successfully cancelled the request");
  } catch (error) {
    // debug
    console.log(error);
    res.status(400).send("operation failed," + error.message);
  }
};

// handle unfriending or disconneting a user from your network
export const handleUnfriendConnection = async (req, res) => {
  try {
    // Extract sender and target IDs from params
    const senderID = new mongoose.Types.ObjectId(req?.params.senderID);
    const targetID = new mongoose.Types.ObjectId(req?.params.targetID);

    // Check if the sender and the target users exist
    const senderUser = await personalModel.findById(senderID);
    const targetUser = await personalModel.findById(targetID);

    if (!senderUser || !targetUser) {
      throw new Error("One or both users do not exist in the system");
    }

    // Update the network array of the sender user by removing the target ID
    senderUser.network = senderUser.network.filter(
      (networkID) => !networkID.equals(targetID)
    );
    senderUser.network_count = Math.max(senderUser.network_count - 1, 0);

    // Update the network array of the target user by removing the sender ID
    targetUser.network = targetUser.network.filter(
      (networkID) => !networkID.equals(senderID)
    );
    targetUser.network_count = Math.max(targetUser.network_count - 1, 0);

    // Save the updated users into the database
    await senderUser.save();
    await targetUser.save();

    // Send the updated users to the frontend
    const results = {
      message: "Successfully disconnected users",
      targetUser,
      senderUser,
    };
    res.status(200).json(results);
  } catch (error) {
    // debug
    console.error("Error in handleUnfriendConnection:", error);
    // send error response to the frontend
    res.status(400).json({ error: error.message });
  }
};

// handles fetching of all possible connection request
export const handleGetAllConnectionRequest = async (req, res) => {
  try {
    // retrieves all connect request aimed to the target user if any
    const targetId = req?.params.id;
    // fetching the first 20 requests basing on latest first
    const requestsAvailable = await RequestConnectModel.find({ targetId })
      .sort({ createdAt: -1 })
      .limit(20);
    // send the results to the frontend
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
    //get the user with the passed id params and return their array
    const networkData = await personalModel
      .findById({ _id: userId }, { network: 1, _id: 0 })
      .limit(20)
      .sort({ createdAt: -1 });
    const currentUserNetwork = networkData ? networkData.network : [];

    // Convert all network IDs and the current user ID to ObjectId
    // Map network IDs to ObjectId. Exclude also current user ID as ObjectId
    const excludedIds = [
      new mongoose.Types.ObjectId(userId),
      ...currentUserNetwork.map((id) => new mongoose.Types.ObjectId(id)),
    ];

    // Return users not in the network and exclude the current owner ID
    // Exclude the current user
    const nonFriends = await personalModel.find(
      {
        _id: { $nin: excludedIds },
      },
      {
        name: 1,
        specialisationTitle: 1,
        country: 1,
        county: 1,
        avatar: 1,
        selectedSkills: 1,
      }
    );

    // send the response to the frontend for the user to connect with them as friend
    res.status(200).send(nonFriends);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
};
