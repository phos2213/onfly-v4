import { FlightResultCard } from './FlightResultCard';

export function FlightResultsList({ results }) {
  if (!results) return null;
  if (!results.offers?.length) {
    return <p className="text-center text-gray-400 py-8">No flights found. Try different dates or airports.</p>;
  }
  return (
    <div className="flex flex-col gap-3 mt-4">
      {results.offers.map((offer) => (
        <FlightResultCard
          key={offer.id}
          offer={offer}
          passengers={results.passengers}
        />
      ))}
    </div>
  );
}
