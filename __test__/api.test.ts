import { apiClient } from '../lib/api';

global.fetch = jest.fn();

describe('ApiClient - Following', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should follow a user successfully', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ 
                message: 'Followed successfully',
                user: { id: 1, username: 'test' }
            }),
        });

            const response = await apiClient.followUser(1, 2);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/follows/1/follow/2',
                expect.objectContaining({ method: 'POST' })
            );
            expect(response.message).toBe('Followed successfully');
    });

    
});