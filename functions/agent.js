const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { text, mode } = JSON.parse(event.body);
    const prompt = `Jesteś agentem magazynowym sklepu z grami. Tryb: ${mode}. 
    Dane: ${text}. Wyciągnij tytuły, ilości i ceny w formacie JSON.`;
    
    const result = await model.generateContent(prompt);
    return { statusCode: 200, body: JSON.stringify({ answer: result.response.text() }) };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
