exports.handler = async (event) => {
    // 1. Sprawdzamy, czy klucz z Netlify jest dostępny
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza GEMINI_API_KEY w Netlify!" }) };
    }

    try {
        const body = JSON.parse(event.body);
        const promptText = `Jesteś asystentem magazynu gier planszowych. Przeanalizuj dane z Allegro: ${body.text}. Wypisz krótko tylko: tytuł gry i ilość sprzedanych sztuk.`;

        // 2. Bezpośrednie, siłowe uderzenie do API Google (omija bibliotekę NPM)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        // 3. Sprawdzamy czy Google nie odrzuciło zapytania
        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Kod ${response.status}: ${errData}`);
        }

        // 4. Odczytanie odpowiedzi AI
        const data = await response.json();
        const textAnswer = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: textAnswer })
        };
    } catch (error) {
        console.error("Szczegóły błędu bezpośredniego zapytania:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
