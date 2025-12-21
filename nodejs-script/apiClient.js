const axios = require('axios');

/**
 * API client for interacting with the Laravel API
 */
class APIClient {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch the latest article that hasn't been updated
   * @returns {Promise<Object>} The latest article
   */
  async getLatestArticle() {
    try {
      const response = await axios.get(`${this.baseUrl}/articles/latest`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching latest article:', error.message);
      throw error;
    }
  }

  /**
   * Fetch all articles
   * @returns {Promise<Array>} Array of articles
   */
  async getAllArticles() {
    try {
      const response = await axios.get(`${this.baseUrl}/articles`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      throw error;
    }
  }

  /**
   * Create a new article
   * @param {Object} articleData - The article data
   * @returns {Promise<Object>} The created article
   */
  async createArticle(articleData) {
    try {
      const response = await axios.post(`${this.baseUrl}/articles`, articleData);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error.message);
      throw error;
    }
  }

  /**
   * Update an existing article
   * @param {number} id - The article ID
   * @param {Object} articleData - The updated article data
   * @returns {Promise<Object>} The update response
   */
  async updateArticle(id, articleData) {
    try {
      const response = await axios.put(`${this.baseUrl}/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      console.error('Error updating article:', error.message);
      throw error;
    }
  }
}

module.exports = APIClient;
