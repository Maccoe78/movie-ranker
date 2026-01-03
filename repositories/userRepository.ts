import { UpdateUserRequest, LoginRegisterRequest, AuthResponse, LoginResponse, UserDetails, UpdateUserResponse  } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Error: ${response.status}`);
  }

  const text = await response.text();
  
  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return { message: text } as T;
  }
}

  export async function register(data: LoginRegisterRequest): Promise<AuthResponse> {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  export async function login(data: LoginRegisterRequest): Promise<AuthResponse> {
    const response = await request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('Login response from backend:', response);

    const username = response.username;
    
    if (!username) {
      throw new Error('Login response does not contain username');
    }

  
    try {
      const userDetails = await request<UserDetails>(`/api/auth/users/username/${username}`, {
        method: 'GET',
      });

      console.log('User details from backend:', userDetails);

      return {
        token: response.token || 'dummy-token', 
        user: {
          id: userDetails.id,
          username: userDetails.username,
        }
      };
    } catch (error) {
      console.error('Failed to get user details:', error);
      throw new Error('Failed to get complete user information after login');
    }
  }

  export async function updateUser(userId: number, data: UpdateUserRequest): Promise<UpdateUserResponse> {
    if (!userId || userId === undefined || userId === null) {
      throw new Error('Invalid user ID. Please log in again.');
    }

    console.log('Making updateUser request to:', `/api/auth/users/${userId}`);
    
    return request<UpdateUserResponse>(`/api/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data), 
    });
  }

  export async function deleteUser(userId: number): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }