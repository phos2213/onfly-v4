import { useState } from 'react';

export function HotelSearchForm({ onSearch, loading }) {
  const [form, setForm] = useState({
    cityName: '',
    countryCode: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    guestNationality: 'US',
    currency: 'USD',
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(form);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
        <label className="text-xs text-gray-500 font-medium">City</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. Paris"
          value={form.cityName}
          onChange={(e) => setForm({ ...form, cityName: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-24">
        <label className="text-xs text-gray-500 font-medium">Country</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
          placeholder="FR"
          maxLength={2}
          value={form.countryCode}
          onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-xs text-gray-500 font-medium">Check-in</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="date"
          value={form.checkInDate}
          onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
        <label className="text-xs text-gray-500 font-medium">Check-out</label>
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="date"
          value={form.checkOutDate}
          onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-24">
        <label className="text-xs text-gray-500 font-medium">Guests</label>
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
