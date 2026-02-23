const axios = require('axios');

exports.handler = async (event) => {
    let token = event.headers.authorization;
    if (!token) return { statusCode: 401, body: "Brak tokenu" };

    // Zabezpieczenie tokenu słowem Bearer
    if (!token.startsWith('Bearer ')) {
        token = 'Bearer ' + token;
    }

    const dateFrom = event.queryStringParameters?.from;
    const dateTo = event.queryStringParameters?.to;

    let url = 'https://api.allegro.pl/order/checkout-forms?status=READY_FOR_PROCESSING';

    // POPRAWKA: Prawidłowe zmienne API Allegro to 'updated.gte' oraz 'updated.lte'
    if (dateFrom) url += `&updated.gte=${dateFrom}T00:00:00.000Z`;
    if (dateTo) url += `&updated.lte=${dateTo}T23:59:59.999Z`;

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
        const errorDetails = error.response?.data ? error.response.data : error.message;
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: errorDetails }) 
        };
    }
};
