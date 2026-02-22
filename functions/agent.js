const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Pobranie klucza z Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza w Netlify!" }) };

    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        // Wymuszamy stabilną wersję v1 dla modelu flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

        const body = JSON.parse(event.body);
        const prompt = `Jesteś asystentem magazynu gier. Analizuj dane JSON: ${body.text}. Wypisz tylko: Tytuł i ilość.`;

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
