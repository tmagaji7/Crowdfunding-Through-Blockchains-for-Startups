import { useEffect, useState } from 'react';
import { SimpleGrid, Card, Title, Text, Button, Image, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export function HomePage() {
  const [startups, setStartups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/startups')
      .then((response) => {
        setStartups(response.data);
      })
      .catch(() => console.error('Failed to load startups.'));
  }, []);

  return (
    <Container w={'100%'} style={{ textAlign: 'center', marginTop: '30px' }}>
      <Title order={1} style={{ marginBottom: '20px' }}>
        Our Exciting Startups
      </Title>

      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <SimpleGrid
          cols={3}
          spacing="lg"
          breakpoints={[{ maxWidth: 'md', cols: 1 }, { maxWidth: 'lg', cols: 2 }]}
          mt="xl"
        >
          {startups.map((startup) => (
            <Card
              key={startup._id}
              shadow="md"
              p="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: '#FAF6F9',
                color: 'black',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Image
                src="https://via.placeholder.com/300x200.png?text=Startup+Image"
                alt="Startup"
                radius="md"
                mb="md"
                style={{ objectFit: 'cover' }}
              />
              <Title order={3}>{startup.name}</Title>
              <Text mt="md" style={{ height: '50px', overflow: 'hidden' }}>
                {startup.description}
              </Text>
              <Button
                mt="lg"
                onClick={() => navigate(`/startups/${startup._id}`)}
                disabled={startup.fundingClosed}
                style={{
                  backgroundColor: '#ff4d4f',
                  borderColor: 'transparent',
                  color: 'black',
                  width: '100%',
                  '&:hover': {
                    backgroundColor: '#ff7875',
                  },
                }}
              >
                {startup.fundingClosed ? 'Closed for Investment' : 'View Details'}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </div>
    </Container>
  );
}
