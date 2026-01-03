import React, { useState, useRef } from 'react';
import type { Job, Application, User } from '../types'; // Fixed: Added 'type' keyword

interface JobCardProps {
  job: Job;
  currentUser: User;
  onApply: (jobId: string, data: Omit<Application, 'id' | 'appliedAt' | 'jobId'>) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUser, onApply }) => {
  const [isApplying, setIsApplying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    candidateName: currentUser.name || '',
    candidateEmail: currentUser.email || '',
    skills: '',
    resumeBase64: '',
    resumeFileName: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { 
        alert('File is too large. Please upload a PDF under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          resumeBase64: reader.result as string,
          resumeFileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resumeBase64) {
      alert('Please upload your resume PDF.');
      return;
    }
    
    onApply(job.id, {
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      resumeText: `Skills: ${formData.skills}`,
      resumeBase64: formData.resumeBase64,
      resumeFileName: formData.resumeFileName,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
    });
    
    setIsApplying(false);
    resetForm();
    alert('Application submitted successfully!');
  };

  const resetForm = () => {
    setFormData({ 
      candidateName: currentUser.name, 
      candidateEmail: currentUser.email, 
      skills: '',
      resumeBase64: '',
      resumeFileName: ''
    });
  };

  const isNew = new Date().getTime() - new Date(job.postedAt).getTime() < 24 * 60 * 60 * 1000;
  const sunsetGradient = "bg-gradient-to-r from-[#ff9966] to-[#ff5e62]";
  const sunsetShadow = "shadow-lg shadow-orange-200/50";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full group">
      {isNew && (
        <div className="absolute top-0 right-0">
          <div className={`${sunsetGradient} text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl shadow-sm`}>
            New
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-black text-slate-900 leading-tight group-hover:text-[#ff5e62] transition-colors`}>{job.title}</h3>
          <p className="text-[#ff5e62] font-bold text-sm mt-1">{job.company}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md uppercase tracking-wider">
          {job.location}
        </span>
        <span className="text-[10px] font-bold px-2 py-1 bg-orange-50 text-[#ff5e62] rounded-md uppercase tracking-wider">
          {job.salary}
        </span>
      </div>

      <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8 mt-auto">
        {job.requirements.slice(0, 3).map((req, i) => (
          <span key={i} className="text-[10px] font-bold bg-orange-50/50 text-[#ff5e62] px-2.5 py-1 rounded-lg border border-[#ff9966]/20">
            {req}
          </span>
        ))}
      </div>

      <button
        onClick={() => setIsApplying(true)}
        className={`w-full py-4 ${sunsetGradient} hover:opacity-90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${sunsetShadow} active:scale-95`}
      >
        Apply Now
      </button>

      {isApplying && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl my-auto animate-scale-up">
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-[2.5rem]">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Apply to {job.company}</h2>
                <p className="text-sm text-slate-500 font-medium">Complete your application for {job.title}</p>
              </div>
              <button onClick={() => setIsApplying(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ff5e62]/20 outline-none transition-all"
                    value={formData.candidateName}
                    onChange={e => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Contact Email</label>
                  <input
                    required
                    readOnly
                    type="email"
                    className="w-full bg-slate-100 border-slate-200 border rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                    value={formData.candidateEmail}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Upload Resume (PDF only)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                    formData.resumeBase64 ? 'border-orange-300 bg-orange-50' : 'border-slate-300 hover:border-[#ff5e62] bg-slate-50'
                  }`}
                >
                  <div className="space-y-1 text-center">
                    {formData.resumeBase64 ? (
                      <div className="flex flex-col items-center">
                        <svg className="mx-auto h-12 w-12 text-[#ff5e62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-bold text-[#ff5e62] mt-2">{formData.resumeFileName}</p>
                        <button type="button" className="text-xs text-slate-400 hover:text-slate-600 mt-1 underline">Change File</button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-slate-600">
                          <span className="font-black text-[#ff5e62]">Click to upload PDF</span>
                        </div>
                        <p className="text-xs text-slate-500">Maximum size 2MB</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest px-1">Describe Your Skills (For AI Screening)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. 3 years React experience, Backend with Python, etc."
                  className="w-full bg-slate-50 border-slate-200 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#ff5e62]/20 outline-none resize-none transition-all"
                  value={formData.skills}
                  onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-4 ${sunsetGradient} text-white rounded-2xl font-black shadow-xl ${sunsetShadow} hover:brightness-110 transition-all uppercase tracking-widest text-sm active:scale-95`}
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
