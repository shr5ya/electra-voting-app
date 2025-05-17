import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarPlus, PlusCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';

const CreateElection: React.FC = () => {
  const { createElection } = useElection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([
    { name: '', position: '', bio: '', imageUrl: '' }
  ]);

  const handleCandidateChange = (idx: number, field: string, value: string) => {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const addCandidateField = () => {
    setCandidates(prev => [...prev, { name: '', position: '', bio: '', imageUrl: '' }]);
  };

  const removeCandidateField = (idx: number) => {
    setCandidates(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !startDate || !endDate) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (candidates.some(c => !c.name || !c.position)) {
      toast.error('Please fill in all candidate fields.');
      return;
    }
    setLoading(true);
    try {
      createElection({
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        candidates: candidates.map(c => ({
          ...c,
          id: Math.random().toString(36).substring(2, 9),
          votes: 0
        })),
        voterCount: 0,
      });
      toast.success('Election created!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCandidates([{ name: '', position: '', bio: '', imageUrl: '' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-2">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent drop-shadow-lg">Create Election</h1>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300 bg-card dark:bg-card rounded-xl glass-card">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <CalendarPlus className="w-10 h-10 text-green-500" />
              <CardTitle className="text-2xl font-bold leading-tight mb-1 text-foreground dark:text-foreground">New Election</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Election Title" value={title} onChange={e => setTitle(e.target.value)} className="glass-input text-foreground dark:text-foreground" />
                <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="glass-input text-foreground dark:text-foreground" />
                <div className="flex gap-2">
                  <Input type="date" className="w-1/2 glass-input text-foreground dark:text-foreground" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <Input type="date" className="w-1/2 glass-input text-foreground dark:text-foreground" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="bg-white/60 dark:bg-gray-900/60 rounded-xl p-4 mb-2">
                  <div className="font-semibold mb-2 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-green-500" /> Candidates</div>
                  {candidates.map((c, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2 items-center">
                      <Input placeholder="Name" value={c.name} onChange={e => handleCandidateChange(idx, 'name', e.target.value)} className="w-full md:w-1/4" />
                      <Input placeholder="Position" value={c.position} onChange={e => handleCandidateChange(idx, 'position', e.target.value)} className="w-full md:w-1/4" />
                      <Input placeholder="Bio" value={c.bio} onChange={e => handleCandidateChange(idx, 'bio', e.target.value)} className="w-full md:w-1/3" />
                      <Input placeholder="Image URL" value={c.imageUrl} onChange={e => handleCandidateChange(idx, 'imageUrl', e.target.value)} className="w-full md:w-1/4" />
                      {candidates.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCandidateField(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="mt-2" onClick={addCandidateField}><PlusCircle className="w-4 h-4 mr-1" /> Add Candidate</Button>
                </div>
                <Button className="w-full mt-4 glass-button" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Election'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateElection; 