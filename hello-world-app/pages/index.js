// pages/index.js
import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Application</h1>
      {/* Your existing form or other content */}
      
      {/* Add the SummarizeComponent */}
      <SummarizeComponent />
    </div>
  );
}

function SummarizeComponent() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setSummary(data.summary);
  };

  return (
    <div className="p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter text to summarize"
      />
      <button
        onClick={handleSummarize}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Summarize
      </button>
      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}