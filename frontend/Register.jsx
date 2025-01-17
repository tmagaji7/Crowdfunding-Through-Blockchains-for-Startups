import { useState } from 'react';
import { TextInput, Button, Container, Title, Alert, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import API from '../services/api';

export function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    try {
      await API.post('/auth/register', { username, email, password });
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data.message || 'Registration failed');
    }
  };

  return (
    <Container mt="xl" size="xs">
      <Title align="center">Register</Title>
      {error && <Alert color="red" mt="md">{error}</Alert>}
      <TextInput
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mt="md"
      />
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
      <Button fullWidth mt="lg" onClick={handleRegister}>
        Register
      </Button>
      <Text mt="md" align="center">
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </Text>
    </Container>
  );
}
