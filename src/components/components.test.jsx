import { beforeEach, expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import ExerciseList from './exerciseList';
import '@testing-library/jest-dom';

// Wrap component with necessary providers
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Exercise List Component', () => {
  beforeEach(() => {
    renderWithRouter(<ExerciseList />);
  });

  it('should allow users to add exercises to their profile', async () => {
    // Click the add exercise button
    const addButton = screen.getByText('+ Add Exercise');
    await userEvent.click(addButton);

    // Fill in the exercise form
    const exerciseInput = screen.getByLabelText('Exercise Name:');
    const descriptionInput = screen.getByLabelText('Description:');

    await userEvent.type(exerciseInput, 'Running');
    await userEvent.type(descriptionInput, 'Run 3 miles a day');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Add' });
    await userEvent.click(submitButton);

    // Verify the exercise was added
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Run 3 miles a day')).toBeInTheDocument();
  });

  it('should allow users to delete exercises from their profile', async () => {
    // First add an exercise
    const addButton = screen.getByText('+ Add Exercise');
    await userEvent.click(addButton);

    await userEvent.type(screen.getByLabelText('Exercise Name:'), 'Running');
    await userEvent.type(
      screen.getByLabelText('Description:'),
      'Run 3 miles a day'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: 'Delete' });

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    await userEvent.click(deleteButton);

    // Verify exercise was removed
    expect(screen.queryByText('Running')).not.toBeInTheDocument();
  });

  it('should allow users to edit exercises in their profile', async () => {
    // First add an exercise
    const addButton = screen.getByText('+ Add Exercise');
    await userEvent.click(addButton);

    await userEvent.type(screen.getByLabelText('Exercise Name:'), 'Running');
    await userEvent.type(
      screen.getByLabelText('Description:'),
      'Run 3 miles a day'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Click edit button
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await userEvent.click(editButton);

    // Update the exercise
    const exerciseInput = screen.getByLabelText('Exercise Name:');
    const descriptionInput = screen.getByLabelText('Description:');

    await userEvent.clear(exerciseInput);
    await userEvent.clear(descriptionInput);
    await userEvent.type(exerciseInput, 'Walking');
    await userEvent.type(descriptionInput, 'Walk 5 miles a day');

    // Save changes
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);

    // Verify updates
    expect(screen.getByText('Walking')).toBeInTheDocument();
    expect(screen.getByText('Walk 5 miles a day')).toBeInTheDocument();
  });
});

// if time allows:
// setup snapshot testing

// front-end feature/integration tests using puppeteer.js
