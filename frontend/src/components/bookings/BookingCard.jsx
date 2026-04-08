export function BookingCard({ booking }) {
  const isflight = booking.type === 'flight';
  const details = booking.details || {};

  const title = isflight
    ? (() => {
        const segs = details.order?.flightOffers?.[0]?.itineraries?.[0]?.segments;
        if (segs?.length) {
          return `${segs[0].departure.iataCode} → ${segs[segs.length - 1].arrival.iataCode}`;
        }
        return 'Flight';
      })()
    : details.order?.hotelBookings?.[0]?.hotel?.name || 'Hotel';

  const date = new Date(booking.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isflight ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {isflight ? 'Flight' : 'Hotel'}
        </span>
        <div>
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">Booked on {date}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {booking.status}
        </span>
        {booking.amadeus_order_id && (
          <p className="text-xs text-gray-400 mt-1">Ref: {booking.amadeus_order_id}</p>
        )}
      </div>
    </div>
  );
}
