import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { server } from '../mocks/server';
import App from '../components/App';

// Set up MSW server lifecycle hooks
beforeAll(() => server.listen());
beforeEach(async () => {
  await fetch('http://localhost:4000/reset');
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays question prompts after fetching', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText(/View Questions/i));
  
  await waitFor(() => {
    expect(screen.getByText(/lorem testum 1/i)).toBeInTheDocument();
    expect(screen.getByText(/lorem testum 2/i)).toBeInTheDocument();
  });
});

test('creates a new question when the form is submitted', async () => {
  render(<App />);

  // Navigate to "View Questions" to ensure base state is loaded
  fireEvent.click(screen.getByText(/View Questions/i));
  await screen.findByText(/lorem testum 1/i);

  // Go to form view
  fireEvent.click(screen.getByText(/New Question/i));
  await screen.findByText(/Add Question/i);

  // Fill out form fields
  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: 'Test Prompt' }
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: 'A1' }
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: 'A2' }
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: 'A3' }
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: 'A4' }
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: '1' }
  });

  // Submit the form
  fireEvent.click(screen.getByText(/Add Question/i));

  // Navigate back to the list of questions (if needed)
  fireEvent.click(await screen.findByText(/View Questions/i));

  // Verify that the new question appears
  await waitFor(() => {
    expect(screen.getByText(/Test Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/A1/i)).toBeInTheDocument();
    expect(screen.getByText(/A2/i)).toBeInTheDocument();
  });
});
