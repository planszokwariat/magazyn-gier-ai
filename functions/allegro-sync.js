const axios = require('axios');

exports.handler = async (event) => {
    const token = event.headers.authorization;
    
    try {
        // 1. DYNAMICZNA DATA: Pobieramy dzisiejszą datę
        const now = new Date();
        
        // 2. Cofamy się do 1. dnia obecnego miesiąca (godzina 00:00:00)
        const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        
        // 3. Zamieniamy na format wymagany przez Allegro (np. "2026-02-01T00:00:00.000Z")
        const dateString = firstDay.toISOString();

        // 4. Wstawiamy tę datę do zapytania
        const url = `https://api.allegro.pl/order/checkout-forms?updatedAt.gte=${dateString}&limit=100`;

        const response = await axios.get(url, {
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
