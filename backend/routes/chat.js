const router = require("express").Router();
const axios = require("axios");

router.post("/", async (req, res) => {
    const { message, conversation } = req.body;
    try {
        const userMessage = req.body.message;
        
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
          {
            contents: [{
              parts: [{
                text: userMessage
              }]
            }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 150,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': process.env.GEMINI_API_KEY
            }
          }
        );
        
        // Extract the generated text from response
        const generatedText = response.data.candidates[0].content.parts[0].text;
        res.json({ response: generatedText });
        
      } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to generate response' });
      }
    });

const generatePrompt = (conversation, message) => {
    let prompt = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\n";
    conversation.forEach(msg => {
        prompt += `${msg.sender === 'bot' ? 'AI' : 'Human'}: ${msg.text}\n`;
    });
    prompt += `Human: ${message}\nAI:`;
    return prompt;
};

module.exports = router;