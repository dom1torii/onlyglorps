// app/profile/page.js
'use client'; // Mark this as a Client Component

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // Fetch subscription status from the API route
      fetch('/api/subscription')
        .then((response) => response.json())
        .then((data) => {
          setIsSubscribed(data.isSubscribed);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) {
    return <p>Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p>Loading subscription status...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {session.user.name}!</p>
      {isSubscribed ? (
        <p>You are subscribed to the streamer!</p>
      ) : (
        <p>You are not subscribed to the streamer.</p>
      )}
    </div>
  );
}