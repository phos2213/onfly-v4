import liteApi from './liteapiClient.js';

/**
 * Step 1+2: Find hotels in a city and get their rates.
 * Returns hotels that have available offers (offerId included per room type).
 */
export async function searchHotels({ countryCode, cityName, checkInDate, checkOutDate, adults, currency = 'USD', guestNationality = 'US' }) {
  // Step 1: get hotel list
  const hotelsResult = await liteApi.getHotels({ countryCode, cityName, limit: 20 });
  const hotels = hotelsResult.data || [];
  if (!hotels.length) return [];

  const hotelIds = hotels.map((h) => h.id);

  // Step 2: get rates for those hotels
  const ratesResult = await liteApi.getFullRates({
    checkin: checkInDate,
    checkout: checkOutDate,
    currency,
    guestNationality,
    hotelIds,
    occupancies: [{ rooms: 1, adults: Number(adults), children: [] }],
  });

  const rates = ratesResult.data || [];

  // Merge hotel info + rates, keep only hotels with available rooms
  return rates
    .filter((r) => r.roomTypes?.length)
    .map((r) => {
      const info = hotels.find((h) => h.id === r.hotelId) || {};
      return { ...info, hotelId: r.hotelId, roomTypes: r.roomTypes };
    });
}

/**
 * Step 3: Pre-book — locks in the rate and returns a prebookId + confirmed price.
 */
export async function prebookHotel({ offerId }) {
  const result = await liteApi.prebook({ offerId, usePaymentSdk: false });
  return result.data;
}

/**
 * Step 4: Confirm booking.
 * holder: { firstName, lastName, email }
 * guests: [{ firstName, lastName, title }]
 */
export async function bookHotel({ prebookId, holder, guests }) {
  const result = await liteApi.book({
    prebookId,
    holder,
    guests,
    paymentMethod: 'ACC_CREDIT_CARD', // sandbox payment method
  });
  return result.data;
}
