import { 
  User, 
  LoginRegisterRequest, 
  UpdateUserRequest, 
  AuthResponse,
  UpdateUserResponse 
} from '@/types/user';
import { 
  register as registerRepo, 
  login as loginRepo, 
  updateUser as updateUserRepo, 
  deleteUser as deleteUserRepo 
} from '@/repositories/userRepository';

export async function registerUser(username: string, password: string): Promise<AuthResponse> {
  // BUSINESS LOGICA: Validatie
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required');
  }

  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }

  if (username.length > 50) {
    throw new Error('Username cannot exceed 50 characters');
  }

  if (!password || password.length === 0) {
    throw new Error('Password is required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  if (password.length > 100) {
    throw new Error('Password cannot exceed 100 characters');
  }
  try {
    console.log('UserService: Registering user:', username);
    const data: LoginRegisterRequest = { username, password };
    const response = await registerRepo(data);
    console.log('UserService: User registered successfully');
    return response;
  } catch (error) {
    console.error('UserService: Registration error:', error);
    throw error;
  }
}

export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  // BUSINESS LOGICA: Validatie
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required');
  }

  if (!password || password.length === 0) {
    throw new Error('Password is required');
  }

  try {
    console.log('UserService: Logging in user:', username);
    const data: LoginRegisterRequest = { username, password };
    const response = await loginRepo(data);
    console.log('UserService: User logged in successfully');
    return response;
  } catch (error) {
    console.error('UserService: Login error:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: number, 
  updates: { username?: string; password?: string }
): Promise<UpdateUserResponse> {
  // BUSINESS LOGICA: Validatie
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Check if there are any changes
  if (!updates.username && !updates.password) {
    throw new Error('No changes to save');
  }

  // Validate username if provided
  if (updates.username) {
    if (updates.username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }
    if (updates.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (updates.username.length > 50) {
      throw new Error('Username cannot exceed 50 characters');
    }
  }
  if (updates.password) {
    if (updates.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (updates.password.length > 100) {
      throw new Error('Password cannot exceed 100 characters');
    }
  }

  try {
    console.log('UserService: Updating user:', userId);
    const updateData: UpdateUserRequest = {};
    if (updates.username) updateData.username = updates.username;
    if (updates.password) updateData.password = updates.password;

    const response = await updateUserRepo(userId, updateData);
    console.log('UserService: User updated successfully');
    return response;
  } catch (error) {
    console.error('UserService: Update error:', error);
    throw error;
  }
}

export async function deleteUserAccount(userId: number): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    console.log('UserService: Deleting user:', userId);
    await deleteUserRepo(userId);
    console.log('UserService: User deleted successfully');
  } catch (error) {
    console.error('UserService: Delete error:', error);
    throw error;
  }
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 50) {
    return { valid: false, error: 'Username cannot exceed 50 characters' };
  }

  // Check for valid characters (letters, numbers, underscores, hyphens)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }

  if (password.length > 100) {
    return { valid: false, error: 'Password cannot exceed 100 characters' };
  }

  return { valid: true };
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

export function getUserInitials(username: string): string {
  if (!username || username.length === 0) return '??';
  
  if (username.length === 1) return username.toUpperCase();
  
  return username.slice(0, 2).toUpperCase();
}

export function formatUsername(username: string): string {
  if (!username) return 'Anonymous';
  return username;
}