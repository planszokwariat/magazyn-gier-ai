const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Pobranie klucza z Netlify Environment Variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Zmiana: używamy pełnej nazwy modelu "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const body = JSON.parse(event.body);
        
        // Przygotowanie danych do analizy
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Otrzymałeś dane z zamówień Allegro w formacie JSON: ${body.text}.
        Zinterpretuj te dane i wypisz w punktach:
        1. Jakie gry zostały kupione (podaj tytuł).
        2. Ile sztuk każdej gry.
        Odpowiedz krótko i konkretnie.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: text })
        };
    } catch (error) {
        console.error("Błąd szczegółowy:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
