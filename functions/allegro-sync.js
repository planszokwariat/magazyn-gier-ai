const axios = require('axios');

exports.handler = async (event) => {
    let token = event.headers.authorization;
    if (!token) return { statusCode: 401, body: "Brak tokenu" };

    // 1. NAPRAWA TOKENU: Allegro bezwzględnie wymaga słowa "Bearer"
    if (!token.startsWith('Bearer ')) {
        token = 'Bearer ' + token;
    }

    const dateFrom = event.queryStringParameters?.from;
    const dateTo = event.queryStringParameters?.to;

    let url = 'https://api.allegro.pl/order/checkout-forms?status=READY_FOR_PROCESSING';

    // 2. NAPRAWA ZAPYTAŃ O DATĘ: Użycie właściwych parametrów 'updatedAt'
    if (dateFrom) url += `&updatedAt.gte=${dateFrom}T00:00:00.000Z`;
    if (dateTo) url += `&updatedAt.lte=${dateTo}T23:59:59.999Z`;

    try {
        const response = await axios.get(url, {
            headers: { 
                'Authorization': token, 
                'Accept': 'application/vnd.allegro.public.v1+json' 
            }
        });
        return { 
            statusCode: 200, 
            body: JSON.stringify(response.data) 
        };
    } catch (error) {
        // Lepsze przechwytywanie błędów – jeśli Allegro znów zablokuje, powie nam dokładnie dlaczego
        const errorDetails = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error("Błąd Allegro:", errorDetails);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: errorDetails }) 
        };
    }
};
