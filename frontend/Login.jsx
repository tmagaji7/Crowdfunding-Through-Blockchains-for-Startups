import { useState } from 'react';
import { TextInput, Button, Container, Title, Alert, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
  };

  return (
    <Container mt="xl" size="xs">
      <Title align="center">Login</Title>
      {error && <Alert color="red" mt="md">{error}</Alert>}
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mt="md"
      />
      <TextInput
        label="Password"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mt="md"
      />
      <Button fullWidth mt="lg" onClick={handleLogin}>
        Login
      </Button>
      <Text mt="md" align="center">
        Don't have an account?{' '}
        <Link to="/register">Register here</Link>
      </Text>
    </Container>
  );
}
