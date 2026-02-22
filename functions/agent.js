const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Netlify automatycznie pobierze klucz stąd:
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        const body = JSON.parse(event.body);
        
        // Używamy bezpośredniego odwołania do wersji 1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Jesteś inteligentnym asystentem magazynu gier planszowych. 
        Analizuj te dane zamówień z Allegro (JSON): ${body.text}.
        Wypisz tylko: tytuł gry i ilość sztuk. Krótko.`;

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
