import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Users } from 'lucide-react';
import { GlassContainer } from '@/components/ui/glass-components';

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true);
      setError(null);
      try {
        // Get JWT token from localStorage or context
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }
        // 1. Fetch all elections and get the latest/active one
        const electionsRes = await fetch('/api/v1/elections', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const elections = await electionsRes.json();
        if (!Array.isArray(elections) || elections.length === 0) {
          setCandidates([]);
          setLoading(false);
          return;
        }
        // You can change this logic to pick the 'active' election if you have a status field
        const election = elections[0];
        // 2. Fetch candidates for that election
        const candidatesRes = await fetch(`/api/v1/elections/${election._id}/candidates`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const candidatesData = await candidatesRes.json();
        setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      } catch (err) {
        setError('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Candidates</h1>
      </div>
      <p className="text-muted-foreground mb-8">Browse and learn about candidates running in the current election</p>
      {loading ? (
        <div>Loading candidates...</div>
      ) : error ? (
        <GlassContainer variant="default" className="p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="h-12 w-12 text-muted-foreground/70" />
            <h3 className="text-xl font-medium">{error}</h3>
          </div>
        </GlassContainer>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map(candidate => (
            <Card key={candidate._id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.position}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{candidate.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <GlassContainer variant="default" className="p-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <Users className="h-12 w-12 text-muted-foreground/70" />
            <h3 className="text-xl font-medium">No candidates found for the current election.</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no candidates available at this time.
            </p>
          </div>
        </GlassContainer>
      )}
    </Layout>
  );
};

export default Candidates; 