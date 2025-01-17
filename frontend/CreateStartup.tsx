import { useState } from 'react';
import { TextInput, Button, Container, Title, Alert, Group, ActionIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FiPlus, FiMinus } from 'react-icons/fi';  // Importing react-icons

export function CreateStartup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [investmentTiers, setInvestmentTiers] = useState([{ amount: '', description: '' }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateStartup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a startup');
        return;
      }

      const response = await API.post(
        '/startups',
        { name, description, fundingGoal, investmentTiers },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setSuccess('Startup created successfully!');
      setError(null);
      setName('');
      setDescription('');
      setFundingGoal('');
      setInvestmentTiers([{ amount: '', description: '' }]);
      navigate('/'); // Redirect to homepage after success
    } catch (err) {
      setError(err.response?.data.message || 'Failed to create startup');
      setSuccess(null);
    }
  };

  const handleAddTier = () => {
    setInvestmentTiers([...investmentTiers, { amount: '', description: '' }]);
  };

  const handleRemoveTier = (index) => {
    const newTiers = [...investmentTiers];
    newTiers.splice(index, 1);
    setInvestmentTiers(newTiers);
  };

  const handleTierChange = (index, field, value) => {
    const newTiers = [...investmentTiers];
    newTiers[index][field] = value;
    setInvestmentTiers(newTiers);
  };

  return (
    <Container mt="xl" size="xs">
      <Title align="center">Create Startup</Title>
      {error && <Alert color="red" mt="md">{error}</Alert>}
      {success && <Alert color="green" mt="md">{success}</Alert>}

      <TextInput
        label="Startup Name"
        placeholder="Enter the name of the startup"
        value={name}
        onChange={(e) => setName(e.target.value)}
        mt="md"
      />
      <TextInput
        label="Description"
        placeholder="Enter the description of the startup"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        mt="md"
      />
      <TextInput
        label="Funding Goal"
        placeholder="Enter the funding goal"
        value={fundingGoal}
        onChange={(e) => setFundingGoal(e.target.value)}
        mt="md"
        type="number"
      />

      <Title order={3} mt="lg">Investment Tiers</Title>
      {investmentTiers.map((tier, index) => (
        <Group key={index} mt="sm" spacing="md">
          <TextInput
            label={`Amount for Tier ${index + 1} (ETH)`}
            placeholder="Enter the amount"
            value={tier.amount}
            onChange={(e) => handleTierChange(index, 'amount', e.target.value)}
            type="number"
            style={{ width: '45%' }}
          />
          <TextInput
            label={`Description for Tier ${index + 1}`}
            placeholder="Enter description"
            value={tier.description}
            onChange={(e) => handleTierChange(index, 'description', e.target.value)}
            style={{ width: '45%' }}
          />
          {investmentTiers.length > 1 && (
            <ActionIcon color="red" onClick={() => handleRemoveTier(index)}>
              <FiMinus />
            </ActionIcon>
          )}
        </Group>
      ))}
      <Button mt="md" onClick={handleAddTier} leftIcon={<FiPlus />}>
        Add Tier
      </Button>

      <Button fullWidth mt="lg" onClick={handleCreateStartup}>
        Create Startup
      </Button>
    </Container>
  );
}
