const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza API w ustawieniach Netlify!" }) };
    }

    try {
        const body = JSON.parse(event.body);
        const promptText = `Jesteś asystentem magazynu gier planszowych. Przeanalizuj dane JSON z Allegro: ${body.text}. Wypisz w punktach: tytuł gry i ilość sztuk. Odpowiadaj krótko.`;

        // ZMIANA: Przechodzimy na niezawodny model gemini-pro w stabilnej wersji v1
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
            { contents: [{ parts: [{ text: promptText }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const textAnswer = response.data.candidates[0].content.parts[0].text;

        return { statusCode: 200, body: JSON.stringify({ answer: textAnswer }) };
    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd Agenta: " + errorDetails }) };
    }
};
