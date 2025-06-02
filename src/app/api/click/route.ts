import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { query, link } = body;

		// Forward the request to the backend API
		const response = await fetch('https://api.recipe-recommendations.com/click', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query,
				link,
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to forward click data to backend');
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error processing recipe click:', error);
		return NextResponse.json(
			{ error: 'Failed to process recipe click' },
			{ status: 500 }
		);
	}
} 