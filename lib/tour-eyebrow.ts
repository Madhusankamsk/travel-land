/** Shared eyebrow line for upcoming tour cards (home + listing). */
export function getTourEyebrow(trip: {
  tripSubtitle: string | null;
  destinationCountry: string | null;
  destinationCities: string | null;
  tripCategory: string | null;
}) {
  return (
    trip.tripSubtitle?.trim() ||
    [trip.destinationCountry, trip.destinationCities].filter(Boolean).join(" · ") ||
    trip.tripCategory?.trim() ||
    "Prossimi viaggi"
  );
}
