import { put, list, del } from '@vercel/blob';

export default async function handler(request, response) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const STATS_FILE = 'visitor-stats.json';

    try {
        // Find existing stats file
        const { blobs } = await list();
        const existingBlob = blobs.find(b => b.pathname === STATS_FILE);

        let stats = { totalVisitors: 0, countries: {} };

        if (existingBlob) {
            const res = await fetch(existingBlob.url);
            stats = await res.json();
        }

        if (request.method === 'GET') {
            return response.status(200).json(stats);
        }

        if (request.method === 'POST') {
            const { country, countryCode, flag } = request.body;

            // Update stats
            stats.totalVisitors++;

            if (!stats.countries[countryCode]) {
                stats.countries[countryCode] = {
                    name: country,
                    flag: flag,
                    count: 0
                };
            }
            stats.countries[countryCode].count++;

            // Save updated stats (Vercel Blob is immutable, so we upload a new version)
            // The pathname remains the same for easy listing
            await put(STATS_FILE, JSON.stringify(stats), {
                access: 'public',
                addRandomSuffix: false // Overwrite existing pathname
            });

            return response.status(200).json(stats);
        }

        return response.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error in Vercel Blob tracking function:', error);
        return response.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
