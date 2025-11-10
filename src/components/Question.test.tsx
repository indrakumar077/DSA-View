import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Question from './Question';
import { questionsData } from '../data/questions';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Question Component', () => {
  it('should render question component', () => {
    render(
      <BrowserRouter>
        <Question />
      </BrowserRouter>
    );
    
    // Since GenericQuestion is rendered, we can check if the component mounts
    expect(document.body).toBeTruthy();
  });

  it('should handle invalid question ID', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ id: '99999' }),
        useNavigate: () => vi.fn(),
      };
    });

    render(
      <BrowserRouter>
        <Question />
      </BrowserRouter>
    );

    // Should show error message for invalid question
    expect(screen.getByText(/Question Not Found/i)).toBeInTheDocument();
  });
});

