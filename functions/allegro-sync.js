const axios = require('axios');

exports.handler = async (event) => {
    let token = event.headers.authorization;
    if (!token) return { statusCode: 401, body: "Brak tokenu" };

    if (!token.startsWith('Bearer ')) {
        token = 'Bearer ' + token;
    }

    const dateFrom = event.queryStringParameters?.from;
    const dateTo = event.queryStringParameters?.to;

    let url = 'https://api.allegro.pl/order/checkout-forms?status=READY_FOR_PROCESSING';

    // KLUCZOWA ZMIANA: Szukamy dokładnie po Dacie Zakupu (Kup Teraz), a nie dacie modyfikacji statusu paczki
    if (dateFrom) url += `&lineItems.boughtAt.gte=${dateFrom}T00:00:00.000Z`;
    if (dateTo) url += `&lineItems.boughtAt.lte=${dateTo}T23:59:59.999Z`;

    try {
        const response = await axios.get(url, {
            headers: { 
                'Authorization': token, 
                'Accept': 'application/vnd.allegro.public.v1+json' 
            }
        });
        return { statusCode: 200, body: JSON.stringify(response.data) };
    } catch (error) {
        const errorDetails = error.response?.data ? error.response.data : error.message;
        return { statusCode: 500, body: JSON.stringify({ error: errorDetails }) };
    }
};
