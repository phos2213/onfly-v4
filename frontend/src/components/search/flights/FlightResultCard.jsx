import { useState } from 'react';
import client from '../../../api/client';

// passengers: [{ id, type }] from the Duffel offer_request — IDs are required for booking
export function FlightResultCard({ offer, passengers }) {
  const [showForm, setShowForm] = useState(false);
  const [stage, setStage] = useState(null); // null | 'booking' | 'done'
  const [error, setError] = useState(null);

  // Build one form entry per passenger, pre-populated with the Duffel passenger ID
  const [travelers, setTravelers] = useState(
    () => (passengers || []).map((p) => ({
      id: p.id,
      given_name: '',
      family_name: '',
      born_on: '',
      email: '',
      phone_number: '',
      title: 'mr',
      gender: 'm',
    }))
  );

  const slice = offer.slices?.[0];
  const seg = slice?.segments?.[0];
  const airline = offer.owner?.name || seg?.marketing_carrier?.name || '—';
  const from = seg?.origin?.iata_code || '—';
  const to = seg?.destination?.iata_code || '—';
  const departure = seg?.departing_at?.slice(0, 16).replace('T', ' ') || '';
  const duration = slice?.duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || '';

  function updateTraveler(index, field, value) {
    setTravelers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  async function handleBook() {
    setStage('booking');
    setError(null);
    try {
      await client.post('/api/flights/book', {
        offerId: offer.id,
        offerAmount: offer.total_amount,
        offerCurrency: offer.total_currency,
        travelers,
      });
      setStage('done');
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
      setStage(null);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-semibold text-gray-800">{airline}</p>
          <p className="text-sm text-gray-500">{from} → {to} · {duration}</p>
          <p className="text-xs text-gray-400">{departure}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-blue-700">
            {offer.total_currency} {offer.total_amount}
          </p>
          {stage === 'done' ? (
            <p className="text-sm text-green-600 font-medium mt-1">Booked!</p>
          ) : (
            !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-1 bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Book
              </button>
            )
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {showForm && (
        <div className="border-t pt-3 mt-1 flex flex-col gap-3">
          {travelers.map((t, i) => (
            <div key={t.id}>
              <p className="text-xs font-semibold text-gray-500 mb-2">Passenger {i + 1}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <input className="border rounded px-2 py-1" placeholder="First name" value={t.given_name} onChange={(e) => updateTraveler(i, 'given_name', e.target.value)} required />
                <input className="border rounded px-2 py-1" placeholder="Last name" value={t.family_name} onChange={(e) => updateTraveler(i, 'family_name', e.target.value)} required />
                <input className="border rounded px-2 py-1" type="date" placeholder="Date of birth" value={t.born_on} onChange={(e) => updateTraveler(i, 'born_on', e.target.value)} required />
                <select className="border rounded px-2 py-1" value={t.title} onChange={(e) => updateTraveler(i, 'title', e.target.value)}>
                  <option value="mr">Mr</option>
                  <option value="mrs">Mrs</option>
                  <option value="ms">Ms</option>
                </select>
                <select className="border rounded px-2 py-1" value={t.gender} onChange={(e) => updateTraveler(i, 'gender', e.target.value)}>
                  <option value="m">Male</option>
                  <option value="f">Female</option>
                </select>
                <input className="border rounded px-2 py-1" placeholder="Email" type="email" value={t.email} onChange={(e) => updateTraveler(i, 'email', e.target.value)} required />
                <input className="border rounded px-2 py-1 col-span-2" placeholder="Phone (e.g. +15551234567)" value={t.phone_number} onChange={(e) => updateTraveler(i, 'phone_number', e.target.value)} required />
              </div>
            </div>
          ))}
          <div className="flex gap-2 justify-end mt-1">
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:underline">Cancel</button>
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
