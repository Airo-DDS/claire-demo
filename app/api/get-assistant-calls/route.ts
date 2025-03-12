import { NextRequest, NextResponse } from 'next/server';

// Replace with your actual VAPI API key - consider using environment variables
const API_KEY = process.env.VAPI_API_KEY || '';
const API_BASE_URL = 'https://api.vapi.ai';

async function fetchCallDetails(callId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/call/${callId}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch call details (status: ${res.status})`);
    }

    const callData = await res.json();
    return callData;
  } catch (error) {
    console.error('Error fetching call details:', error);
    return null;
  }
}

async function getLatestCallIds(assistantId: string, limit: number = 3) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/call?assistantId=${assistantId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch calls (status: ${res.status})`);
    }

    const calls = await res.json();

    if (!Array.isArray(calls)) {
      console.error('Unexpected response format for calls:', calls);
      return [];
    }

    // Sort calls by creation date in descending order to get the latest ones
    calls.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Extract the call IDs
    const callIds = calls.map((call) => call.id);
    return callIds.slice(0, limit); // Ensure we don't exceed the requested limit
  } catch (error) {
    console.error('Error fetching call IDs:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const assistantId = searchParams.get('assistantId');
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 3;

  if (!assistantId) {
    return NextResponse.json(
      { message: 'Missing assistantId parameter' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Fetch the Call IDs
    const latestCallIds = await getLatestCallIds(assistantId, limit);

    if (latestCallIds.length === 0) {
      return NextResponse.json(
        { message: 'No calls found for this assistant.' },
        { status: 200 }
      );
    }

    // Step 2: Fetch Call Details
    const callDetails = [];
    for (const callId of latestCallIds) {
      const callData = await fetchCallDetails(callId);
      if (callData) {
        callDetails.push({
          id: callData.id,
          assistantId: callData.assistantId,
          transcript: callData.artifact?.transcript || '',
          analysis: callData.analysis || {},
          recordingUrl: callData.artifact?.recordingUrl || '',
          createdAt: callData.createdAt,
        });
      }
    }

    return NextResponse.json({ calls: callDetails }, { status: 200 });
  } catch (error: any) {
    console.error('Error in API handler:', error);
    return NextResponse.json(
      { message: 'Failed to fetch call data', error: error.message },
      { status: 500 }
    );
  }
}