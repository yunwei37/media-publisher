// Import the tavily module
const { tavily } = require("@tavily/core");

// Function to perform a Tavily search
export async function performTavilySearch(query: string) {
    // Load the API key from environment variables
    const apiKey = process.env.TAVILY_API_KEY;

    // Step 1. Instantiating your Tavily client
    const tvly = tavily({ apiKey });

    // Step 2. Executing a simple search query
    const response = await tvly.search(query);

    // Return the response
    return response;
}

module.exports = { performTavilySearch };
