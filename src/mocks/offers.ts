export type Offer = {
  id: string;
  title: string;
  type: 'apartment' | 'room' | 'house' | 'hotel';
  price: number;
  rating: number;
  isPremium: boolean;
  isFavorite: boolean;
  previewImage: string;
  city: 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf';
  location: { lat: number; lng: number };
};

export const offers: Offer[] = [
  {
    id: '1701',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'apartment',
    price: 120,
    rating: 4.0,
    isPremium: true,
    isFavorite: false,
    previewImage: 'img/apartment-01.jpg',
    city: 'Amsterdam',
    location: { lat: 52.3909553943508, lng: 4.85309666406198 },
  },
  {
    id: '1702',
    title: 'Wood and stone place',
    type: 'room',
    price: 80,
    rating: 4.0,
    isPremium: false,
    isFavorite: true,
    previewImage: 'img/room.jpg',
    city: 'Amsterdam',
    location: { lat: 52.3609553943508, lng: 4.85309666406198 },
  },
  {
    id: '1703',
    title: 'Canal View Prinsengracht',
    type: 'apartment',
    price: 132,
    rating: 4.0,
    isPremium: false,
    isFavorite: false,
    previewImage: 'img/apartment-02.jpg',
    city: 'Amsterdam',
    location: { lat: 52.3909553943508, lng: 4.929309666406198 },
  },
  {
    id: '1704',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'apartment',
    price: 180,
    rating: 5.0,
    isPremium: true,
    isFavorite: true,
    previewImage: 'img/apartment-03.jpg',
    city: 'Amsterdam',
    location: { lat: 52.3809553943508, lng: 4.939309666406198 },
  },
];
