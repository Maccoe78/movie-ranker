import { registerUser } from '../services/userService';
import * as userRepo from '../repositories/userRepository';

jest.mock('../repositories/userRepository');

describe('User Service', () => {
    it('should reject username shorter than 3 chars', async () => {
        await expect(registerUser('ab', 'password123'))
            .rejects.toThrow('Username must be at least 3 characters');
    });
    
    it('should call repository with valid data', async () => {
        (userRepo.register as jest.Mock).mockResolvedValue({
            token: 'token',
            user: { id: 1, username: 'validuser' }
        });
        
        await registerUser('validuser', 'password123');
        
        expect(userRepo.register).toHaveBeenCalledWith({
            username: 'validuser',
            password: 'password123'
        });
    });
});