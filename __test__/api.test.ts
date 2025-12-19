/// <reference types="jest" />
import { apiClient } from '../lib/api';

global.fetch = jest.fn() as jest.Mock;

describe('ApiClient - Following', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should follow a user successfully', async () => {
        const mockResponse = {
            ok: true,
            text: async () => JSON.stringify({ 
                message: 'Followed successfully',
                user: { id: 1, username: 'test' }
            }),
        };
        
        (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

        const response = await apiClient.followUser(1, 2);

        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/follows/1/follow/2',
            expect.objectContaining({ method: 'POST' })
        );
        expect(response.message).toBe('Followed successfully');
    });

    
});