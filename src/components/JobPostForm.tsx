
import React, { useState, useEffect } from 'react';
import type { Job } from '../types';

interface JobPostFormProps {
  onClose: () => void;
  onSubmit: (job: Omit<Job, 'id' | 'postedAt' | 'creatorId'>) => void;
  onUpdate?: (job: Job) => void;
  initialData?: Job;
}

const JobPostForm: React.FC<JobPostFormProps> = ({ onClose, onSubmit, onUpdate, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        company: initialData.company,
        description: initialData.description,
        requirements: initialData.requirements.join(', '),
        location: initialData.location,
        salary: initialData.salary
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = formData.requirements.split(',').map(r => r.trim()).filter(r => r !== '');
    
    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        ...formData,
        requirements
      });
    } else {
      onSubmit({
        ...formData,
        requirements
      });
    }
    onClose();
  };

  const sunsetGradient = "bg-gradient-to-r from-[#ff9966] to-[#ff5e62]";
  const sunsetShadow = "shadow-lg shadow-orange-200/50";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Posting' : 'Post New Opening'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
              <input
                required
                className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company</label>
              <input
                required
                className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
                placeholder="Your Company Name"
                value={formData.company}
                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
              <input
                required
                className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
                placeholder="Remote / City"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salary Range</label>
              <input
                required
                className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
                placeholder="e.g. $100k - $140k"
                value={formData.salary}
                onChange={e => setFormData(prev => ({ ...prev, salary: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
              placeholder="Describe the role and day-to-day responsibilities..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Requirements (comma separated)</label>
            <input
              required
              className="w-full border-slate-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#ff5e62]/20 outline-none"
              placeholder="React, TypeScript, AWS, Team Leadership"
              value={formData.requirements}
              onChange={e => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 ${sunsetGradient} hover:brightness-110 text-white rounded-xl font-bold transition-all mt-4 ${sunsetShadow} active:scale-95`}
          >
            {initialData ? 'Update Posting' : 'Create Posting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
