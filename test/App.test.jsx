import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/app/App';

describe('App smoke test', () => {
  test('renders platform title', () => {
    render(<App />);
    expect(
      screen.getByText(/Shipment Operations & Document Verification Platform/i)
    ).toBeInTheDocument();
  });
});
