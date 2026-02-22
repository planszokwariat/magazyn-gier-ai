const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Sprawdzenie klucza
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza API w Netlify!" }) };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Używamy modelu gemini-1.5-flash (najszybszy i najnowszy)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const body = JSON.parse(event.body);
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Na podstawie danych JSON z Allegro: ${body.text} 
        wypisz tylko listę sprzedanych gier i ich ilości.`;

        // Generowanie treści
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: text })
        };
    } catch (error) {
        // Logowanie błędu w panelu Netlify
        console.error("Szczegóły błędu:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
