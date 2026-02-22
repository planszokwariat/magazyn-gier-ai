const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza API" }) };

    try {
        const body = JSON.parse(event.body);
        
        // ZMIANA: Bardzo precyzyjna instrukcja dla AI, aby zwracał tylko czysty kod JSON
        const promptText = `Jesteś systemem ERP. Przeanalizuj zamówienia z Allegro: ${body.text}. 
        Zwróć TYLKO I WYŁĄCZNIE czystą tablicę JSON (bez znaczników markdown, bez słowa "json", bez żadnego tekstu pobocznego). 
        Format: [{"tytul": "Dokładna nazwa gry", "ilosc": 1}]`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            { contents: [{ parts: [{ text: promptText }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );

        let textAnswer = response.data.candidates[0].content.parts[0].text;
        
        // Zabezpieczenie: usuwamy ewentualne znaczniki markdown, jeśli AI by je dodało
        textAnswer = textAnswer.replace(/```json/g, '').replace(/```/g, '').trim();

        return { statusCode: 200, body: JSON.stringify({ answer: textAnswer }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd Agenta" }) };
    }
};
