import ConversationModel from "../model/ConversationModel.js";
import MessageModel from "../model/MessageModel.js";
import personalModel from "../model/personalModel.js";

// create a new conversation
export const handleCreateNewConversation = async (req, res) => {
  try {
    // extract the participants array of ids [senderID,recipient1..2]
    const { participants, senderId, content } = req.body;

    // lets get target user, user not senderID
    const targetUserID =
      participants &&
      participants.filter((participantID) => participantID !== senderId);

    //   lets check if both partcipants exists or not (sender,target)
    const senderUser = await personalModel.findById({ _id: senderId });
    const targetUser = await personalModel.findById({ _id: targetUserID });

    if (!senderUser || !targetUser) {
      throw new Error("user not found!");
    }

    // get the sender and target details (name and avatar)
    const senderName = senderUser.name;
    const senderAvatar = senderUser.avatar;
    const targetName = targetUser.name;
    const targetAvatar = targetUser.avatar;

    // find conversation with matching participants if any
    let conversation = await ConversationModel.findOne({
      participants: { $all: participants },
    });

    // no conversation found create one or new one
    if (!conversation) {
      conversation = new ConversationModel({
        participants,
        senderName,
        senderAvatar,
        targetName,
        targetAvatar,
      });
      await conversation.save();
    }

    // conversation now already present lets extract the id and create msge
    const conversationId = conversation._id;

    /* create a new message in the message db by the help of conversationID. 
    conversation is like a room and the roomm has an id thus each msg has roomId
    or that conversationId
    */
    const message = new MessageModel({ conversationId, senderId, content });

    // saving the message of a given conversation
    await message.save();

    // update the last message of the conversation property to the latest msg content
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    // send response
    res.status(200).send(conversation);
  } catch (error) {
    // debug
    console.log(error.message);
    // send error response to the frontend
    res.status(400).send("something went wrong");
  }
};

// handle sending of message to an existing conversation, conversationID will be
// helpful in categorising the messages to their respective conversation.

export const handleSendMessageToConversation = async (req, res) => {
  try {
    // destructure the necessary fields for a message object
    const { conversationId, senderId, content } = req?.body;
    const message = new MessageModel({ conversationId, senderId, content });
    // save the message
    await message.save();

    // update the conversation model its last message and time
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    // send the response to the frontend
    res.status(200).send(message);
  } catch (error) {
    // debug
    console.log(error.message);
    // send error response to the frontend
    res.status(400).send(error?.message);
  }
};

// get all user specific conversations
export const handleGetUserConvesations = async (req, res) => {
  try {
    // get the userID from the params and search conversation with that Id
    const { userID } = req?.params;

    // check if the user exist or not
    const user = await personalModel.findById({ _id: userID });
    if (!user) {
      throw new Error("user does not exist!");
    }

    const conversations = await ConversationModel.find({
      participants: userID,
    }).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (error) {
    // debug
    console.log(error.message);

    // send error to the frontend
    res.status(400).send(error.message);
  }
};

// send message to a conversation
export const handleGetAllMessageConversation = async (req, res) => {
  try {
    // get the id of the conversation passed in the req params
    const messages = await MessageModel.find({
      conversationId: req.params.conversationId,
    });

    // send the messages to the frontend
    res.status(200).send(messages);
  } catch (error) {
    // debug
    console.log(error);
    // send error to the frontend
    res.status(400).send(error.message);
  }
};

// update message of the conversation like editing the mesage
export const handleUpdateMessageConversation = async (req, res) => {
  try {
    // obtain the data from the body request
    const { content } = req.body;
    // search the message from the messages collection by id from params
    const message = await MessageModel.findByIdAndUpdate(
      req.params.messageId,
      { content, isEdited: true },
      { new: true }
    );

    // return the response to the frontend
    res.status(200).send(message);
  } catch (error) {
    // debug
    console.log(error);
    // send error to the frontend
    res.status(400).send(error.message);
  }
};
