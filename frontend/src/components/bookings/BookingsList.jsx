import { useEffect, useState } from 'react';
import client from '../../api/client';
import { BookingCard } from './BookingCard';

export function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/api/bookings')
      .then(({ data }) => setBookings(data.bookings))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-8">Loading bookings…</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!bookings.length) return <p className="text-center text-gray-400 py-8">No bookings yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
    </div>
  );
}
