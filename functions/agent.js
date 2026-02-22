const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Sprawdzenie czy klucz w ogóle dotarł do funkcji
    if (!process.env.GEMINI_API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza GEMINI_API_KEY w ustawieniach Netlify!" }) };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        // Najbezpieczniejsze wywołanie modelu gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const body = JSON.parse(event.body);
        const prompt = `Jesteś asystentem magazyniera. Na podstawie tych danych z Allegro (JSON): ${body.text} wypisz tylko listę gier i ich ilości.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: response.text() })
        };
    } catch (error) {
        console.error("Błąd szczegółowy Agenta:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
