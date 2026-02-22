const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Sprawdzenie klucza w Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza GEMINI_API_KEY w Netlify!" }) };
    }

    // WYMUSZENIE WERSJI V1 (rozwiązuje błąd 404 v1beta)
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        // Używamy precyzyjnej nazwy modelu
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
        }, { apiVersion: 'v1' }); 

        const body = JSON.parse(event.body);
        const prompt = `Jesteś asystentem magazyniera gier planszowych. 
        Na podstawie tych danych z Allegro (JSON): ${body.text} 
        wypisz tylko listę sprzedanych gier i ich ilości.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: response.text() })
        };
    } catch (error) {
        console.error("Szczegóły błędu:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: "Błąd Agenta: " + error.message })
        };
    }
};
