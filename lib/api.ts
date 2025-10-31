const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('Login response from backend:', response);

    // Je backend geeft alleen username terug, geen ID
    // We moeten de user ID ophalen via de username endpoint
    let username = response.username;
    
    if (!username) {
      throw new Error('Login response does not contain username');
    }

    // Haal user details op inclusief ID
    try {
      const userDetails = await this.request<any>(`/api/auth/users/username/${username}`, {
        method: 'GET',
      });

      console.log('User details from backend:', userDetails);

      return {
        token: response.token || 'dummy-token', // Je backend geeft geen token terug
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

  async updateUser(userId: number, data: UpdateUserRequest): Promise<{ message: string; username: string }> {
    if (!userId || userId === undefined || userId === null) {
      throw new Error('Invalid user ID. Please log in again.');
    }

    console.log('Making updateUser request to:', `/api/auth/users/${userId}`);
    
    // Je backend verwacht een User object zonder extra 'id' field
    return this.request<{ message: string; username: string }>(`/api/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data), // Stuur alleen username en/of password
    });
  }

}

export const apiClient = new ApiClient();