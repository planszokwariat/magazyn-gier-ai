const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Pobranie klucza z Netlify Environment Variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // NAPRAWA BŁĘDU 404: dodajemy prefiks 'models/'
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    try {
        const body = JSON.parse(event.body);
        
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Otrzymałeś dane z zamówień Allegro: ${body.text}.
        Wypisz krótko: jakie gry kupiono i w jakiej ilości.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: text })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
