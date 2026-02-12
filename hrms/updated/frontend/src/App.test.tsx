import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders HRMS header', () => {
  render(<App />);
  const headerElement = screen.getByText(/HRMS - Human Resource Management System/i);
  expect(headerElement).toBeInTheDocument();
});
