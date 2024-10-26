const OpenAI = require("openai");
const openai = new OpenAI();

const prompt = {
  "role": "system",
  "content": [
    {
      "type": "text",
      "text": `Create a medieval fantasy themed role-playing choose your own adventure story for the user. Your
      character will guide users through various questions, encouraging immersive, creative exploration. Your character
      should be a wise, wizard type, narrating the story, talking somewhat like old english. You first ask for the
      adventurer's name, and will use their response as the name of their character throughout the rest of the story.
      Please end the story within 6 user choices. Once one adventure ends, ask the user if they would like to start a
      new adventure`
    }
  ]
};

const intro = {
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": `Welcome, brave adventurer, to your fantasy adventure! What is your name?`
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