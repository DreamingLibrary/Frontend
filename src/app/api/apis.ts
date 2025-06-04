import { LoginResponse } from '@/types/type';

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
