const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const body = JSON.parse(event.body);
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Otrzymałeś dane z Allegro: ${body.text}. 
        Twoim zadaniem jest wypisać w skrócie jakie gry zostały sprzedane i czy rozpoznajesz ich tytuły.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: response.text() })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
