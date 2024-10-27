import { performTavilySearch } from '../../lib/tavily';

describe('performTavilySearch', () => {
    it('should return a response for a given query', async () => {
        const query = "Who is Leo Messi?";

        const response = await performTavilySearch(query);
    });
});
