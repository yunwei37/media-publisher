import { performTavilySearch } from '../../lib/tavily';
// Mock the tavily module
jest.mock('@tavily/core', () => ({
    tavily: jest.fn(() => ({
        search: jest.fn((query: string) => Promise.resolve(`Mocked response for query: ${query}`))
    }))
}));

describe('performTavilySearch', () => {
    it('should return a response for a given query', async () => {
        const query = "Who is Leo Messi?";
        const expectedResponse = `Mocked response for query: ${query}`;

        const response = await performTavilySearch(query);

        expect(response).toBe(expectedResponse);
    });
});