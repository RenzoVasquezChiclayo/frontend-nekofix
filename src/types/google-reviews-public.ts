/** Reseña normalizada para UI (origen: `GET /public/google-reviews`). */
export type GoogleReviewPublic = {
  authorName: string;
  authorPhotoUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
};

/** Payload listo para la landing tras normalizar la respuesta del API. */
export type GoogleReviewsPublicPayload = {
  averageRating: number;
  totalReviews: number;
  reviews: GoogleReviewPublic[];
  /** URL pública a Google Maps (reseñas o ficha). */
  mapsUrl: string | null;
};
