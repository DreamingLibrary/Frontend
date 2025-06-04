type GROUPSTATUS = 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
type GROUPNAME = 'CNU' | 'PARROT' | 'GDGoC' | 'RELEASE';
type USER = 'ADMIN' | 'USER';

export interface UserGroup {
  groupId: number;
  name: string;
  status: GROUPSTATUS;
}

export interface User {
  userId: number;
  name: string;
  studentNumber: number;
  role: USER;
  phoneNumber: string;
  email?: string;
}

export interface Group {
  groupId: number;
  name: string;
}

export interface Book {
  bookId: number;
  groupId: number;
  title: string;
  author: string;
  description?: string;
  category: string;
}

export interface Rent {
  rentId: number;
  title: string;
  groupName: GROUPNAME;
  returnAt: Date;
  rentalPeriod: number;
  rentalCount: number; // 연장횟수
  createdAt: Date;
}

export interface LoginResponse {
  email?: string;
  id: number;
  name: string;
  phoneNumber: string;
  role: USER;
  studentNumber: string;
}
