/**
 * @jest-environment jsdom
 */
import { MemoryRouter } from 'react-router-dom';

import '@testing-library/jest-dom'
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Signup from '../Register';

jest.mock('axios');

describe('Signup Component', () => {
  test('renders Signup form', () => {
   render( <MemoryRouter>
    <Signup />
  </MemoryRouter>)
    expect(screen.getByText(/SignUp/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register Now/i })).toBeInTheDocument();
    
  });

  test('allows user to input username, email, password, and confirm password', async () => {
    render( <MemoryRouter>
        <Signup />
      </MemoryRouter>)
    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email Address/i);
    const passwordInput = screen.getByTestId(/password/i);
    const confirmPasswordInput = screen.getByTestId(/confirm/i);

   await userEvent.type(usernameInput, 'testuser');
   await userEvent.type(emailInput, 'test@example.com');
   await userEvent.type(passwordInput, 'password');
   await userEvent.type(confirmPasswordInput, 'password');

    


    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password');
    expect(confirmPasswordInput).toHaveValue('password');
  });


  test('displays error message if form fields are empty on form submission', async () => {
    render( <MemoryRouter>
        <Signup />
      </MemoryRouter>)
    const submitButton = screen.getByRole('button', { name: /Register Now/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
    });
  });

  


   
});