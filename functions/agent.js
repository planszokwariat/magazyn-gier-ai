const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza API" }) };

    try {
        const body = JSON.parse(event.body);
        
        // Skoro mamy wymuszenie, możemy uprościć prośbę
        const promptText = `Przeanalizuj zamówienia z Allegro: ${body.text}. 
        Zwróć wynik jako tablicę obiektów, gdzie każdy obiekt zawiera klucze "tytul" (nazwa gry) oraz "ilosc" (liczba sztuk).`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            { 
                contents: [{ parts: [{ text: promptText }] }],
                // TO JEST KLUCZOWE: Wymusza na modelu czysty obiekt/tablicę JSON, zakazując "ludzkiego" tekstu
                generationConfig: { responseMimeType: "application/json" }
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        let textAnswer = response.data.candidates[0].content.parts[0].text;
        
        return { statusCode: 200, body: JSON.stringify({ answer: textAnswer }) };
        
    } catch (error) {
        // Podajemy też kody błędu jako odpowiedź, aby wyświetliły się w Twoim powiadomieniu
        const err = error.response ? JSON.stringify(error.response.data) : error.message;
        return { statusCode: 200, body: JSON.stringify({ answer: "BŁĄD_SERWERA: " + err }) };
    }
};
