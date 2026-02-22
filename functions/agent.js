const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Pobranie klucza
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ZMIANA: Przechodzimy na sprawdzony model gemini-pro
    // Używamy prostej nazwy bez prefiksów
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const body = JSON.parse(event.body);
        
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Analizuj dane JSON z Allegro: ${body.text}.
        Wypisz krótko: Tytuł gry i ilość sztuk.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: response.text() })
        };
    } catch (error) {
        console.error("Błąd:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
