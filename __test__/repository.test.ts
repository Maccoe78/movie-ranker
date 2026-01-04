import { followUser } from '../repositories/followRepository';

global.fetch = jest.fn() as jest.Mock;

describe('Follow Repository', () => {
    it('should make POST call to follow endpoint', async () => {
        const mockResponse = {
            ok: true,
            text: async () => JSON.stringify({ message: 'Success' })
        };
        
        (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
        
        await followUser(1, 2);
        
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:8080/api/follows/1/follow/2',
            expect.objectContaining({ method: 'POST' })
        );
    });
});