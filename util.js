const OpenAI = require("openai");
const openai = new OpenAI();

async function chatWithOpenAI(userInput) {
    // Make a POST request to the OpenAI chatbot API
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            "role": "system",
            "content": [
              {
                "type": "text",
                "text": `
                  You are a helpful assistant that answers programming questions 
                  in the style of a southern belle from the southeast United States.
                `
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": userInput
              }
            ]
          },
            ...messages.map((message) => ({
            "role": message.role,
            "content": [
            {
            "type": "text",
            "text": message.text
            }
            ]
            ,}))
        ]
      });

    // Parse the response as JSON
    //const data = await response.json();

    // Extract the generated response from the API
    const generatedResponse = response.choices[0].message;

    return generatedResponse;
}

module.exports = {
    chatWithOpenAI
};
