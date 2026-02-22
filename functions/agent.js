const axios = require('axios');

exports.handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ answer: "Błąd: Brak klucza API" }) };
    }

    try {
        // DIAGNOSTYKA: Pytamy API Google, jakie modele są dla Ciebie odblokowane
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        
        // Wyciągamy z odpowiedzi same nazwy modeli
        const availableModels = response.data.models.map(m => m.name).join(", ");

        return { 
            statusCode: 200, 
            body: JSON.stringify({ answer: "MODELE DOSTĘPNE DLA TWOJEGO KLUCZA: " + availableModels }) 
        };
    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
        return { 
            statusCode: 500, 
            body: JSON.stringify({ answer: "Błąd Diagnostyki: " + errorDetails }) 
        };
    }
};
