// Netlify Function to track visitors and store in Netlify Blobs
const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Get the Netlify Blobs store
        const store = getStore('visitor-stats');

        if (event.httpMethod === 'GET') {
            // Retrieve visitor statistics
            const totalVisitors = await store.get('total-visitors') || '0';
            const countriesData = await store.get('countries-data') || '{}';

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    totalVisitors: parseInt(totalVisitors),
                    countries: JSON.parse(countriesData)
                })
            };
        }

        if (event.httpMethod === 'POST') {
            // Track a new visit
            const { country, countryCode, flag } = JSON.parse(event.body);

            // Get current data
            let totalVisitors = parseInt(await store.get('total-visitors') || '0');
            let countriesData = JSON.parse(await store.get('countries-data') || '{}');

            // Increment total visitors
            totalVisitors++;

            // Update country data
            if (!countriesData[countryCode]) {
                countriesData[countryCode] = {
                    name: country,
                    flag: flag,
                    count: 0
                };
            }
            countriesData[countryCode].count++;

            // Save updated data
            await store.set('total-visitors', totalVisitors.toString());
            await store.set('countries-data', JSON.stringify(countriesData));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    totalVisitors,
                    countries: countriesData
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error in track-visit function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};
