import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Title, Text, Button, Alert, TextInput } from '@mantine/core';
import API from '../services/api';
import Web3 from 'web3';

export function StartupDetails() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/startups/${id}`)
      .then((res) => {
        setStartup(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('Error fetching startup details');
      });
  }, [id]);

  const handleInvestment = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const actualAmountInEther = amount / 100;

    let investmentAmount;
    try {
      investmentAmount = Web3.utils.toWei(actualAmountInEther.toString(), 'ether');
    } catch (error) {
      setError('Invalid amount entered');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to make an investment!');
      return;
    }

    setLoading(true);
    API.post(`/startups/${id}/invest`, { "amount": Number(amount) }, {
      headers: {
        'Authorization': `${token}`,
      },
    })
      .then((res) => {
        setSuccess('Investment successful!');
        setError(null);
        setAmount('');
        setStartup(res.data.startup);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response?.data.message || 'Investment failed');
      });
  };

  if (loading) return <Text>Loading...</Text>;
  if (!startup) return <Text>No startup found</Text>;

  const fundingGoalReached = startup.currentFunding >= startup.fundingGoal;

  return (
    <Card shadow="md" p="lg" radius="md" withBorder mt="xl">
      <Title order={2}>{startup.name}</Title>
      <Text mt="sm">{startup.description}</Text>
      <Text mt="md">
        <strong>Goal:</strong> ${startup.fundingGoal}
      </Text>
      <Text>
        <strong>Current Funding:</strong> ${startup.currentFunding}
      </Text>

      {fundingGoalReached && (
        <Alert color="yellow" mt="md">
          Funding goal has been reached!
        </Alert>
      )}

      {startup.fundingClosed && <Alert color="red" mt="md">Funding for this startup is closed!</Alert>}

      <TextInput
        label="Investment Amount (USD)"
        type="number"
        placeholder="Enter your amount in USD"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mt="md"
        disabled={startup.fundingClosed || fundingGoalReached}
      />
      {error && <Alert color="red" mt="md">{error}</Alert>}
      {success && <Alert color="green" mt="md">{success}</Alert>}

      <Button mt="lg" onClick={handleInvestment} disabled={startup.fundingClosed || !amount || isNaN(amount) || amount <= 0 || fundingGoalReached}>
        Invest
      </Button>
    </Card>
  );
}
