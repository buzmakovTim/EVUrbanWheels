export type UserType = {
  id?: number | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  email: string,
  phone?: string | undefined
}

export type TripType = {
  id: string,
  userId: number,
  confirmationN: string,
  status: 'B' | 'C' | 'F',
  price: number,
  pickupLocation: string,
  dropoffLocation: string,
  duration: number | 0,
  pickupTime: string | undefined,
  pickupDate: string | undefined,
  note: string,
  dateOfCreation: string | undefined,
  dateOfModifying: string | undefined
}

export type UnavailableDatesType = {
  id: number,
  tripId: string,
  date: string
}

export interface IBookingForm {
  firstName: string | undefined,
  lastName: string | undefined,
  email: string,
  pickupLocation: string | undefined,
  dropoffLocation: string | undefined,
  duration: number | undefined,
  date: Date | undefined,
  hour: string | undefined,
  minute: string | undefined,
  amPm: 'AM' | 'PM'
  note: string | undefined
}

export type TypeService = {
  title: string,
  image: string,
  description: string,
  more?: string
}

export type InfoCards = {
  title: string,
  image?: string,
  description: string
}
