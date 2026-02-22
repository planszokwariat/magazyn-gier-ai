const axios = require('axios');

exports.handler = async (event) => {
    const clientId = process.env.ALLEGRO_CLIENT_ID;
    const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // OBSŁUGA SPRAWDZANIA STATUSU (POLLING)
    if (event.httpMethod === 'PUT') {
        const { deviceCode } = JSON.parse(event.body);
        try {
            const response = await axios.post('https://allegro.pl/auth/oauth/token', 
                `grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=${deviceCode}`, {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return { statusCode: 200, body: JSON.stringify(response.data) };
        } catch (error) {
            return { statusCode: 400, body: JSON.stringify({ error: "Oczekiwanie..." }) };
        }
    }

    // GENEROWANIE NOWEGO KODU (POST)
    try {
        const response = await axios.post('https://allegro.pl/auth/oauth/device', 
            `client_id=${clientId}`, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return { statusCode: 200, body: JSON.stringify(response.data) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(error.response?.data || error.message) };
    }
};
