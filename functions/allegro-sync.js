const axios = require('axios');

exports.handler = async (event) => {
    const token = event.headers.authorization;
    
    try {
        // Pobieramy ostatnie zamówienia (Checkout Forms)
        const response = await axios.get('https://api.allegro.pl/order/checkout-forms', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.allegro.public.v1+json'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error.message) };
    }
};
