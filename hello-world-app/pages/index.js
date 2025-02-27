import { useState } from 'react';
import axios from 'axios';

export default function CandidateForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedIn: '',
    resume: null,
    skills: '',
    experience: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'resume') {
        if (formData.resume) {
          formDataObj.append('resume', formData.resume);
        } else {
          console.error("No resume file selected");
          return;
        }
      } else {
        formDataObj.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.post('/api/upload', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload Successful:', response.data);
    } catch (error) {
      console.error('Upload error:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="md:max-w-4xl max-w-screen md:h-full h-screen mx-auto md:mt-20 mt-0 p-8 bg-white shadow-lg rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Candidate Application Form</h2>
  <form onSubmit={handleSubmit} className="space-y-6">
    
    {/* Name */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">Full Name</label>
      <input type="text" name="name" placeholder="Enter your full name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={handleChange} required />
    </div>

    {/* Email */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">Email Address</label>
      <input type="email" name="email" placeholder="Enter your email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={handleChange} required />
    </div>

    {/* LinkedIn URL */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">LinkedIn Profile</label>
      <input type="url" name="linkedIn" placeholder="Enter your LinkedIn URL" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={handleChange} required />
    </div>

    {/* Resume Upload */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">Upload Resume (PDF only)</label>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-3 border rounded-lg text-gray-900 cursor-pointer bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none" required />
    </div>

    {/* Skills */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">Skills</label>
      <textarea name="skills" placeholder="List your skills (e.g., React, Node.js, Python)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={handleChange}></textarea>
    </div>

    {/* Experience */}
    <div>
      <label className="block text-lg font-semibold text-gray-700 mb-2">Experience</label>
      <textarea name="experience" placeholder="Describe your work experience" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" onChange={handleChange}></textarea>
    </div>

    {/* Submit Button */}
    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200">Submit Application</button>
  </form>
</div>

  );
}