import { useState } from 'react';
import { FlightSearchForm } from './flights/FlightSearchForm';
import { FlightResultsList } from './flights/FlightResultsList';
import { HotelSearchForm } from './hotels/HotelSearchForm';
import { HotelResultsList } from './hotels/HotelResultsList';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { useHotelSearch } from '../../hooks/useHotelSearch';

export function SearchTabs() {
  const [tab, setTab] = useState('flights');
  const flights = useFlightSearch();
  const hotels = useHotelSearch();

  return (
    <div>
      <div className="flex border-b mb-4">
        {['flights', 'hotels'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'flights' && (
        <>
          <FlightSearchForm onSearch={flights.search} loading={flights.loading} />
          {flights.error && <p className="text-red-500 text-sm mt-3">{flights.error}</p>}
          <FlightResultsList results={flights.results} />
        </>
      )}

      {tab === 'hotels' && (
        <>
          <HotelSearchForm onSearch={hotels.search} loading={hotels.loading} />
          {hotels.error && <p className="text-red-500 text-sm mt-3">{hotels.error}</p>}
          <HotelResultsList results={hotels.results} />
        </>
      )}
    </div>
  );
}
