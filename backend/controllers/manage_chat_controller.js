// controls sending the request to the deployed Ai model for response
export const handleChatAi = async (req, res) => {
  try {
    const message = req?.body;
    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
