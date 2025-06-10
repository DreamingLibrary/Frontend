import {
  BookListResponse,
  BookRegisterRequest,
  GroupListResponse,
  GroupUserPENDINGListResponse,
  LoginResponse,
  MyLentsResponse,
} from '@/types/type';

export const fetchLogin = async (
  studentId: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/login`,
    {
      method: 'POST',
      body: JSON.stringify({ studentNumber: studentId, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  const token = response.headers.get('Authorization');
  if (token) {
    localStorage.setItem('token', token);
  }
  return response.json();
};

export const fetchSignUp = async (
  studentId: string,
  password: string,
  name: string,
  phoneNumber: string,
  email?: string
): Promise<LoginResponse> => {
  const body: Record<string, string> = {
    studentNumber: studentId,
    password,
    name,
    phoneNumber,
  };
  if (email) {
    body.email = email;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/join`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

const getToken = () => localStorage.getItem('token');

export const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
  const token = getToken();
  const headers = {
    ...(init?.headers || {}),
    ...(token ? { Authorization: `${token}` } : {}),
  };
  return fetch(input, { ...init, headers });
};

export const fetchUserInfo = async (): Promise<LoginResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return response.json();
};

export const updateUserInfo = async ({
  name,
  studentNumber,
  phoneNumber,
  email,
}: {
  name: string;
  studentNumber: string;
  phoneNumber: string;
  email?: string;
}) => {
  await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user/info`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, studentNumber, phoneNumber, email }),
    }
  );
};

export const updatePassword = async (password: string) => {
  await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/user/pwd`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    }
  );
};

export const fetchGroupList = async (): Promise<GroupListResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/groups`,
    {
      method: 'GET',
    }
  );
  return response.json();
};

export const fetchGroupApply = async (
  groupId: number
): Promise<GroupListResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/group-user/request-join?groupId=${groupId}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchCreateGroup = async (
  groupName: string
): Promise<GroupListResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/groups`,
    {
      method: 'POST',
      body: JSON.stringify({ groupName }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchGroupUserListPENDING = async (
  groupId: string,
  status: string
): Promise<GroupUserPENDINGListResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/group-user/list-join-requests?groupId=${groupId}&status=${status}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchGroupUserApproval = async (
  userId: number,
  action: 'APPROVED' | 'REJECTED',
  groupId: number
) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/group-user/approve-or-reject`,
    {
      method: 'PUT',
      body: JSON.stringify({ userId, status: action, groupId }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchBookList = async (): Promise<BookListResponse> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/books`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchGroupAdminPromotion = async (groupId: number) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/group-user/set-admin?groupId=${groupId}`,
    {
      method: 'POST',
      // body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchGroupNameChange = async (
  groupId: number,
  newName: string
) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/groups/${groupId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ groupName: newName }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchGroupDelete = async (groupId: number) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/groups/${groupId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchBookRegister = async ({
  title,
  author,
  description,
  category,
  groupId,
}: BookRegisterRequest) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/books`,
    {
      method: 'POST',
      body: JSON.stringify({ title, author, description, category, groupId }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchBookLent = async (bookId: number) => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/rents`,
    {
      method: 'POST',
      body: JSON.stringify({ bookId }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );
  return response.json();
};

export const fetchMyLents = async (): Promise<MyLentsResponse[]> => {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/rents/my`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  return response.json();
};
