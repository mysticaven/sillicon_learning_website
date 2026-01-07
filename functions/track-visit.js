export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers
        });
    }

    // Attempt to use KV if bound, otherwise fallback to local/in-memory (for testing)
    // Note: In production, the user must bind a KV namespace to VISITOR_STATS
    const kv = env.VISITOR_STATS;

    try {
        if (request.method === 'GET') {
            let totalVisitors = '0';
            let countriesData = '{}';

            if (kv) {
                totalVisitors = await kv.get('total-visitors') || '0';
                countriesData = await kv.get('countries-data') || '{}';
            }

            return new Response(JSON.stringify({
                totalVisitors: parseInt(totalVisitors),
                countries: JSON.parse(countriesData)
            }), {
                status: 200,
                headers
            });
        }

        if (request.method === 'POST') {
            const body = await request.json();
            const { country, countryCode, flag } = body;

            let totalVisitors = 0;
            let countriesData = {};

            if (kv) {
                totalVisitors = parseInt(await kv.get('total-visitors') || '0');
                countriesData = JSON.parse(await kv.get('countries-data') || '{}');
            }

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

            if (kv) {
                // Save updated data
                await kv.put('total-visitors', totalVisitors.toString());
                await kv.put('countries-data', JSON.stringify(countriesData));
            }

            return new Response(JSON.stringify({
                totalVisitors,
                countries: countriesData
            }), {
                status: 200,
                headers
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers
        });

    } catch (error) {
        console.error('Error in track-visit function:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            details: error.message
        }), {
            status: 500,
            headers
        });
    }
}
