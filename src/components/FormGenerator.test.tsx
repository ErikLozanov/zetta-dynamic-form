import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormGenerator } from './FormGenerator';
import type { FormSchema } from '../types/schema';

const logSpy = vi.spyOn(console, 'log');

const mockSchema: FormSchema = {
  formTitle: "Test Form",
  fields: [
    {
      id: "userGroup",
      type: "group",
      title: "User Info",
      children: [
        { 
          id: "name", 
          type: "text", 
          label: "Full Name", 
          validation: [{ type: "required", message: "Name is required" }] 
        },
        { 
          id: "jobType", 
          type: "dropdown", 
          label: "Job Type", 
          options: [{ label: "Dev", value: "dev" }, { label: "Manager", value: "mgr" }] 
        },
        { 
          id: "teamSize", 
          type: "text", 
          label: "Team Size", 
          visibleWhen: [{ fieldId: "jobType", equals: "mgr" }] 
        }
      ]
    }
  ]
};

describe('FormGenerator', () => {
  
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the form based on JSON schema', () => {
    render(<FormGenerator schema={mockSchema} />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Type/i)).toBeInTheDocument();
  });

  it('handles dynamic visibility correctly', async () => {
    render(<FormGenerator schema={mockSchema} />);

    expect(screen.queryByLabelText(/Team Size/i)).not.toBeInTheDocument();

    const dropdownTrigger = screen.getByLabelText(/Job Type/i);
    fireEvent.mouseDown(dropdownTrigger);

    const option = await screen.findByText("Manager");
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByLabelText(/Team Size/i)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<FormGenerator schema={mockSchema} />);

    const submitBtn = screen.getByText(/Submit/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  it('submits structured data correctly', async () => {
    render(<FormGenerator schema={mockSchema} />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const submitBtn = screen.getByText(/Submit/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Form Submitted (Structured)"), 
        expect.objectContaining({
            userGroup: expect.objectContaining({
                name: "John Doe"
            })
        })
      );
    });
  });
});