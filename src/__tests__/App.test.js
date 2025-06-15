import React from "react";
import "whatwg-fetch";
import {
  render,  // Make sure this is imported
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);
  
  // Switch to form view
  fireEvent.click(screen.getByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/), {
    target: { value: "Test Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/), {
    target: { value: "Test Answer 4" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/), {
    target: { value: "1" }, // Selects Answer 2 as correct
  });

  // Submit the form
  fireEvent.click(screen.getByText(/Add Question/));

  // Switch back to list view
  fireEvent.click(screen.getByText(/View Questions/));

  // Wait for and verify the new question appears
  await waitFor(() => {
    expect(screen.getByText("Test Prompt")).toBeInTheDocument();
    expect(screen.getByText("Test Answer 1")).toBeInTheDocument();
    expect(screen.getByText("Test Answer 2")).toBeInTheDocument();
  });
});