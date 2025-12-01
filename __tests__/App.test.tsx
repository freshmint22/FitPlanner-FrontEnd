import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App'; // Asumir App.tsx

describe('App', () => {
  it('renders hello world', () => {
    render(<App />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});