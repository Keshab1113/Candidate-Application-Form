import { useRef, useState } from 'react';

export default function Home() {
  // State for the candidate application form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin: '',
    resume: null,
    skills: '',
  });
  const inputRef = useRef(null);

  // State for the candidate search functionality
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('linkedin', formData.linkedin);
    form.append('skills', formData.skills);
    form.append('resume', formData.resume);

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: form,
    });

    if (response.ok) {
      alert('Application submitted successfully!');
      setFormData({
        name: '',
        email: '',
        linkedin: '',
        resume: null,
        skills: '',
      });
      if (inputRef.current) {
        inputRef.current.value = ''; // Reset file input field manually
      }
    } else {
      alert('Failed to submit application.');
    }
  };

  // Handle candidate search
  const handleSearch = async (e) => {
  e.preventDefault();
  setIsLoading(true); // Set loading state to true

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDescription }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API Error:', response.status, errorText);
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    setResults(data);
  } catch (error) {
    console.error('Search Request Failed:', error);
    alert(`Failed to search candidates. ${error.message}`);
  } finally {
    setIsLoading(false); // Reset loading state
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-lg transition-all">
        {/* Toggle Button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-fit bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition absolute md:top-40 md:right-40 top-4 right-4"
        >
          {showSearch ? "Back to Application Form" : "Search Candidates"}
        </button>

        {/* Application Form */}
        {!showSearch && (
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Candidate Application Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  ref={inputRef}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  accept=".pdf"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills & Experience</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {/* Candidate Search Section */}
        {showSearch && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Candidate Search
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring focus:ring-blue-200 text-black"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search Candidates"}
              </button>
            </form>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-center text-gray-700 mt-4">
                <p className="animate-pulse">Loading Candidates Details...</p>
              </div>
            )}

            {/* Display Search Results */}
            {!isLoading && results.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Search Results</h3>
                {results.map((candidate, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-black">{candidate.name}</h4>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-600">{candidate.linkedin}</p>
                    <p className="text-sm text-gray-600">Skills: {candidate.skills}</p>
                    <p className="text-sm text-gray-600">Score: {candidate.score.toFixed(2)}</p>
                    <div className="mt-2">
                      <h5 className="text-md font-medium text-black">AI Feedback:</h5>
                      <p className="text-sm text-gray-700">{candidate.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
