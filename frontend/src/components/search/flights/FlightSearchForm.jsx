import { useState } from 'react';

export function FlightSearchForm({ onSearch, loading }) {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    adults: 1,
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500 font-medium">From (IATA)</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
          placeholder="e.g. LHR"
          maxLength={3}
          value={form.origin}
          onChange={(e) => setForm({ ...form, origin: e.target.value.toUpperCase() })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
        <label className="text-xs text-gray-500 font-medium">To (IATA)</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
          placeholder="e.g. JFK"
          maxLength={3}
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value.toUpperCase() })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-xs text-gray-500 font-medium">Departure Date</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="date"
          value={form.departureDate}
          onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-24">
        <label className="text-xs text-gray-500 font-medium">Passengers</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="number"
          min={1}
          max={9}
          value={form.adults}
          onChange={(e) => setForm({ ...form, adults: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition h-[42px]"
      >
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
