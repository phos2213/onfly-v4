import { useState } from 'react';
import { SearchTabs } from '../components/search/SearchTabs';
import { BookingsList } from '../components/bookings/BookingsList';
import { Navbar } from '../components/layout/Navbar';

const TABS = ['search', 'my bookings'];

export function DashboardPage() {
  const [tab, setTab] = useState('search');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex border-b mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
                tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'search' && <SearchTabs />}
        {tab === 'my bookings' && <BookingsList />}
      </div>
    </div>
  );
}
