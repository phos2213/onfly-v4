import { useState } from 'react';
import client from '../../../api/client';

export function HotelResultCard({ hotel }) {
  const firstRoom = hotel.roomTypes?.[0];
  const firstRate = firstRoom?.rates?.[0];

  const [stage, setStage] = useState(null); // null | 'prebooked' | 'booking' | 'done'
  const [prebook, setPrebook] = useState(null); // { prebookId, price, currency, termsAndConditions }
  const [holder, setHolder] = useState({ firstName: '', lastName: '', email: '' });
  const [guests, setGuests] = useState([{ firstName: '', lastName: '', title: 'Mr' }]);
  const [error, setError] = useState(null);

  if (!firstRoom || !firstRate) return null;

  const offerId = firstRoom.offerId;
  const price = firstRoom.offerRetailRate ?? firstRate.retailRate;
  const currency = firstRate.currency || 'USD';

  async function handlePrebook() {
    setStage('loading');
    setError(null);
    try {
      const { data } = await client.post('/api/hotels/prebook', { offerId });
      setPrebook(data);
      setStage('prebooked');
    } catch (err) {
      setError(err.response?.data?.detail || 'Prebook failed');
      setStage(null);
    }
  }

  async function handleBook() {
    setStage('booking');
    setError(null);
    try {
      await client.post('/api/hotels/book', {
        prebookId: prebook.prebookId,
        holder,
        guests,
      });
      setStage('done');
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
      setStage('prebooked');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <p className="font-semibold text-gray-800">{hotel.name || hotel.hotelId}</p>
          <p className="text-sm text-gray-500">{firstRoom.roomName || firstRate.roomName}</p>
          {hotel.stars && <p className="text-xs text-gray-400">{'★'.repeat(hotel.stars)}</p>}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-700">{currency} {price}</p>
          {stage === 'done' ? (
            <p className="text-sm text-green-600 font-medium mt-1">Booked!</p>
          ) : stage === null && (
            <button onClick={handlePrebook} className="mt-1 bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700 transition">
              Book
            </button>
          )}
          {stage === 'loading' && <p className="text-xs text-gray-400 mt-1">Checking availability…</p>}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Prebook confirmed — show confirmed price + guest form */}
      {stage === 'prebooked' && prebook && (
        <div className="border-t pt-3 mt-1 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700">
            Confirmed price: <span className="text-blue-700 font-bold">{currency} {prebook.price ?? price}</span>
          </p>
          {prebook.termsAndConditions && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded p-2">{prebook.termsAndConditions.slice(0, 200)}…</p>
          )}

          <p className="text-sm font-semibold text-gray-600">Booking holder</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <input className="border rounded px-2 py-1" placeholder="First name" value={holder.firstName} onChange={(e) => setHolder({ ...holder, firstName: e.target.value })} required />
            <input className="border rounded px-2 py-1" placeholder="Last name" value={holder.lastName} onChange={(e) => setHolder({ ...holder, lastName: e.target.value })} required />
            <input className="border rounded px-2 py-1 col-span-2" placeholder="Email" type="email" value={holder.email} onChange={(e) => setHolder({ ...holder, email: e.target.value })} required />
          </div>

          <p className="text-sm font-semibold text-gray-600">Guest(s)</p>
          {guests.map((g, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 text-sm">
              <select className="border rounded px-2 py-1" value={g.title} onChange={(e) => setGuests(guests.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}>
                <option>Mr</option><option>Mrs</option><option>Ms</option>
              </select>
              <input className="border rounded px-2 py-1" placeholder="First name" value={g.firstName} onChange={(e) => setGuests(guests.map((x, j) => j === i ? { ...x, firstName: e.target.value } : x))} required />
              <input className="border rounded px-2 py-1" placeholder="Last name" value={g.lastName} onChange={(e) => setGuests(guests.map((x, j) => j === i ? { ...x, lastName: e.target.value } : x))} required />
            </div>
          ))}

          <div className="flex gap-2 justify-end">
            <button onClick={() => setStage(null)} className="text-sm text-gray-500 hover:underline">Cancel</button>
            <button
              onClick={handleBook}
              disabled={stage === 'booking'}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {stage === 'booking' ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
