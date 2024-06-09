require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
/**
 * 
 * @param {{rule: "user"|"model", parts: [{ text: string}]}[]} chatHistory 
 * @param {string} prompt 
 * @returns {string} response
 */
async function ask(chatHistory, prompt) {
  prompt = prompt.replace(`<@${process.env.BOT_CLIENT_ID}>`, "");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 4000,
    },
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

module.exports = ask;
