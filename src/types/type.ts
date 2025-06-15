export type GROUPSTATUS = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
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
  status: GROUPSTATUS;
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
  // rentalCount: number; // 연장횟수
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

interface ResponseTemplate {
  code: number;
  message: string;
  success: boolean;
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  description?: string;
  category: string;
  groupId: number;
}

export interface BookResponse extends ResponseTemplate {
  // 책 조회
  result: Book[];
}

export interface GroupListResponse extends ResponseTemplate {
  result: UserGroup[];
}

export interface GroupUserPENDINGListResponse extends ResponseTemplate {
  result: User[];
}

export interface BookListResponse extends ResponseTemplate {
  result: {
    list: Book[];
  };
}

export interface BookRegisterRequest {
  title: string;
  author: string;
  description?: string;
  category: string;
  groupId: number;
}

export interface MyLentsResponse {
  rentId: number;
  userName: string;
  bookTitle: string;
  rentalStartAt: Date;
  createdAt: Date;
  returnAt: Date;
  isOverdue: boolean;
}
