export interface Reservation {
  _id: string;
  startTime: Date;
  endTime: Date;
  user: User;
  workingSpace: RefWorkingSpace;
  createdAt: Date;
  __v: number;
}
export interface LogEditReservation {
  _id: string;
  reservationId: any;
  action: string;
  user: string;
  beforeEditStartTime?: Date;
  afterEditStartTime?: Date;
  beforeEditEndTime?: Date;
  afterEditEndTime?: Date;
  reservationOrigin:Reservation;
  createdAt: Date;
  __v: number;
}
export interface RefWorkingSpace {
  _id: string;
  name: string;
  address: string;
  tel: string;
  id: string;
}

// export interface RefUser {
//   _id: string;
//   name: string;
//   tel: string;
//   role: string;
//   email: string;
// }

export interface SpaceItem {
  _id?: string;
  name: string;
  address: string;
  tel?: string;
  openTime: Date | string;
  closeTime: Date | string;
  maxSeat: number | null;
  __v?: number;
  reservation?: Reservation[];
  id?: string;
  image: string;
  availableSeat?: number;
}

export interface SpaceJson {
  success: boolean;
  count: number;
  pagination: Object;
  data: SpaceItem[];
}

export interface Time {
  start: string;
  end: string;
}

export interface SetPreviewCard {
  img: any;
  name: string;
  open: string;
  close: string;
  desc: string;
  seat: number;
}
export interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  createdAt: string;
  __v: number;
}
