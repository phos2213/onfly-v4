import { HotelResultCard } from './HotelResultCard';

export function HotelResultsList({ results }) {
  if (!results) return null;
  if (!results.data?.length) {
    return <p className="text-center text-gray-400 py-8">No hotels found. Try a different city or dates.</p>;
  }
  return (
    <div className="flex flex-col gap-3 mt-4">
      {results.data.map((hotel) => (
        <HotelResultCard key={hotel.hotelId || hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
