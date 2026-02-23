const axios = require('axios');

exports.handler = async (event) => {
    const token = event.headers.authorization;
    if (!token) return { statusCode: 401, body: "Brak tokenu" };

    // Odczytywanie dat z zapytania
    const dateFrom = event.queryStringParameters.from;
    const dateTo = event.queryStringParameters.to;

    let url = 'https://api.allegro.pl/order/checkout-forms?status=READY_FOR_PROCESSING';

    // Jeśli podano daty, "doklejamy" je do adresu API Allegro
    if (dateFrom) url += `&updated.gte=${dateFrom}T00:00:00.000Z`;
    if (dateTo) url += `&updated.lte=${dateTo}T23:59:59.999Z`;

    try {
        const response = await axios.get(url, {
            headers: { 'Authorization': token, 'Accept': 'application/vnd.allegro.public.v1+json' }
        });
        return { statusCode: 200, body: JSON.stringify(response.data) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
