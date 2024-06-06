import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface Suggestion {
    id: number;
    term: string;
}

// dummy data
const suggestions: Suggestion[] = [
    { id: 1, term: 'Next.js' },
    { id: 2, term: 'React' },
    { id: 3, term: 'TypeScript' },
    { id: 4, term: 'TailwindCSS' },
    { id: 5, term: 'Django' },
    { id: 6, term: 'Python' },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { q } = req.query;
    const query = q?.toString().toLowerCase() || '';
  
    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.term.toLowerCase().includes(query)
    );
  
    res.status(200).json(filteredSuggestions);
  }
