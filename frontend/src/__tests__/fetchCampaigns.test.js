import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import React from 'react';

// Import HomePage correctly as a default export
import HomePage from '../pages/HomePage'; // Ensure this import is correct

// Mocking axios to prevent actual network requests during tests
jest.mock('axios');

// Type the axios mock correctly
const mockedAxios = axios;

describe('Backend API Tests', () => {
  test('should fetch campaigns successfully from backend', async () => {
    // Mock data to be returned by the API
    const mockCampaigns = [
      { id: '1', name: 'Campaign 1', description: 'Description for campaign 1' },
      { id: '2', name: 'Campaign 2', description: 'Description for campaign 2' },
    ];

    // Mock the axios GET request
    mockedAxios.get.mockResolvedValue({ data: mockCampaigns });

    // Render the component (no need for additional options unless required)
    render(<HomePage />);

    // Wait for the campaigns to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Description for campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
      expect(screen.getByText('Description for campaign 2')).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    // Mock an API error
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch campaigns'));

    // Render the component
    render(<HomePage />);

    // Check for error message after waiting for it
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch campaigns')).toBeInTheDocument();
    });
  });
});
