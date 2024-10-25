const OpenAI = require("openai");
const openai = new OpenAI();

const prompt = {
  "role": "system",
  "content": [
    {
      "type": "text",
      "text": `Create a fantasy themed choose your own adventure story for the user`
    }
  ]
};

const intro = {
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": `Choose your own adventure! Are you ready to start?`
    }
  ]
};

async function chatWithOpenAI(messages) {
    // Make a POST request to the OpenAI chatbot API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        prompt,
        intro,
        ...messages.map((message) => ({
          "role": message.role,
          "content": [
            {
              "type": "text",
              "text": message.content
            }
          ]
        }))
      ]
    });

    return response.choices[0].message.content;
}

function appendInitial(messages) {
  return [
    { role: intro.role, content: intro.content[0].text },
      ...messages
  ];
}

module.exports = {
  chatWithOpenAI,
  appendInitial
};