import openai from './openai';

export const getAIResponse = async (userMessage, systemPrompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt, // Use the provided system prompt
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const aiMessage = completion.choices[0].message.content;
    return aiMessage;

  } catch (error) {
    console.error("Error getting AI response:", error);
    return "Sorry, I'm having a little trouble thinking right now. Please try again!";
  }
};

export const translateText = async (text, targetLanguage) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translation assistant. Translate the user's text to ${targetLanguage}. Output ONLY the translated text.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0, // Lower temperature for more accurate translations
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation failed.";
  }
};