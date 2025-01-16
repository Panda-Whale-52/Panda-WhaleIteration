import useOAuth from '../hooks/useOAuth';
import OAuthCallback from './OAuthCallback';
import { Link } from 'react-router';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../styles/login.css';
import { useNavigate } from "react-router-dom";
import {  useState } from "react";

const LoginPage = () => {
  const githubToken = useOAuth();
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // const handleOAuthLogin = () => {
  //   window.location.assign(
  //     'https://github.com/login/oauth/authorize?client_id=' +
  //       import.meta.env.VITE_CLIENT_ID
  //   );
  // };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Sign in with username and password');
    if (!emailValue || !passwordValue) {
      return;
  }
  else {
      try {
          const response = await fetch('http://localhost:3000/api/user/login', {
              method: 'POST',
              headers: {
                  'content-type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                  email: emailValue,
                  password: passwordValue,
              }),
          });

          const data = await response.json();

          if (!response.ok)
          {
              throw new Error('Failed to verify user');
          }
          navigate('/tabs')
          
      }
      catch (error) {
          console.error('Login failed:', error);
      }
  }
  };

  return (
    <Container className='login-container'>
      {/* If user just came back from GitHub, display callback logic */}
      {githubToken ? (
        <OAuthCallback githubToken={githubToken} />
      ) : (
        <Row className='justify-content-md-center '>
          {/*  Normal login UI */}
          <Col md={4} className='border  rounded'>
            <div className='text-center mb-4 '>
              <h2 style={{ marginTop: '10px' }}>Sign In</h2>
            </div>
            <Button
              variant='secondary'
              className='w-100 mb-2'
              // onClick={handleOAuthLogin}
            >
              Sign in with Github
            </Button>
            <hr />
            <Form onSubmit={handleFormSubmit} className='mt-3'>
              <Form.Group className='mb-3' controlId='formUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  value={emailValue}
                  placeholder='Enter username'
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  value={passwordValue}
                  placeholder='Enter password'
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant='success' type='submit' className='w-100' >
                Sign in
              </Button>
            </Form>
            <div className='text-center mt-3'>
              <p>
                Don&apos;t have an account?{' '}
                <Link to='/signup'>Sign up here</Link>
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default LoginPage;
