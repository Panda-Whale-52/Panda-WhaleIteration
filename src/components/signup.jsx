/* eslint-disable no-unused-vars */
import { Link } from 'react-router';
import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {  useState } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [nameValue, setNameValue] = useState('');

  // const handleOAuthSignup = (e) => {
  //   console.log(`Sign up with OAuthSignup `);
  //   // Add OAuth signup logic here
  // };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: nameValue,
          email: emailValue,
          password: passwordValue,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      navigate('/login')
    } catch (error) {
      console.error('Signup failed:', error);
    }
    
  };

  return (
    <Container className='login-container'>
      <Row className='justify-content-md-center'>
        <Col md={4} className='border rounded'>
          <div className='text-center mb-4'>
            <h2>Sign Up</h2>
          </div>
          {/* OAuth Buttons */}
          <div className='mb-3'>
            <Button
              variant='secondary'
              className='w-100 mb-2'
              // onClick={() => handleOAuthSignup('Github')}
            >
              Sign up with Github
            </Button>
            <Button
              variant='danger'
              className='w-100 mb-2'
              // onClick={() => handleOAuthSignup('Google')}
            >
              Sign up with Google
            </Button>
          </div>
          <hr />
          <div className='text-center'>or</div>
          {/* Sign Up Form */}
          <Form onSubmit={handleFormSubmit} className='mt-3'>
            <Form.Group className='mb-3' controlId='formUsername'>
              <Form.Label>Username</Form.Label>
              <Form.Control 
              type='text' 
              value={nameValue}  
              placeholder='Enter username' 
              onChange={(e) => setNameValue(e.target.value)} 
              required />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control 
              type='email' 
              value={emailValue} 
              placeholder='Enter email' 
              onChange={(e) => setEmailValue(e.target.value)}
              required  />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                onChange={(e) => setPasswordValue(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant='success' type='submit' className='w-100' >
              Sign up
            </Button>
          </Form>
          <div className='text-center mt-3'>
            <p>
              Already have an account? <Link to='/login'>Log in here</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
