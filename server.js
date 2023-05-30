const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(config);

// Setup server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Endpoint for ChatGPT
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 512,
    temperature: 0.2,
    prompt: prompt,
  });
  res.send(completion.data.choices[0].text);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
