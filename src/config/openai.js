require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const { OPENAI_API_KEY } = process.env;

const connectToOpenAI = () => {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  console.log("Connected to OpenAI API.");

  return openai;
};

module.exports = connectToOpenAI();
