import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('query');
	const page = searchParams.get('page');

	try {
		const response = await fetch(
			`https://api.recipe-recommendations.com/recipes/query=${query}&page=${page}`,
			{
				headers: {
					'Content-Type': 'application/json',
					// Add any required API keys or authentication headers here
				},
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch recipes');
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching recipes:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch recipes' },
			{ status: 500 }
		);
	}
} 