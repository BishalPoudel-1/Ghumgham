// services/openAIService.ts

export interface TripRequest {
  startLocation: string;
  endLocation: string;
  startDate: string; // yyyy-mm-dd
  endDate: string;   // yyyy-mm-dd
}

export async function getTripRecommendations(request: TripRequest): Promise<string[]> {
  // Replace with your backend API URL
  const apiUrl = 'http://YOUR_BACKEND_SERVER_URL/recommend-trip';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  // Expected: { recommendations: string[] }
  return data.recommendations;
}
