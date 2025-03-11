// app/api/subscription/route.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Replace with the streamer's Twitch username
  const streamerLogin = process.env.STREAMER_USERNAME;

  try {
    // Fetch the broadcaster ID
    const broadcasterResponse = await fetch(
      `https://api.twitch.tv/helix/users?login=${streamerLogin}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      }
    );

    if (!broadcasterResponse.ok) {
      throw new Error('Failed to fetch broadcaster ID');
    }

    const broadcasterData = await broadcasterResponse.json();
    const broadcasterId = broadcasterData.data[0]?.id;

    if (!broadcasterId) {
      throw new Error('Broadcaster ID not found');
    }

    // Check if the user is subscribed to the streamer
    const subscriptionResponse = await fetch(
      `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${broadcasterId}&user_id=${session.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID,
        },
      }
    );

    if (!subscriptionResponse.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    const subscriptionData = await subscriptionResponse.json();
    const isSubscribed = subscriptionData.data.length > 0; // If data is not empty, the user is subscribed

    // Return the subscription status
    return new Response(JSON.stringify({ isSubscribed }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Failed to fetch subscription status', { status: 500 });
  }
}