import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerUrl } from '../App';

export default function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/api/user/profile`, { withCredentials: true });
        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading history...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
          <h1 className="text-3xl font-bold">Interview History</h1>
          <p className="mt-2 text-emerald-50">Review all your interview attempts and results.</p>
        </div>

        <div className="p-8">
          {interviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No interviews yet. Start your first one to see history here.
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((item) => {
                const role = item.role && item.role !== 'Not found' ? item.role : 'Role unknown'
                const experience = item.experience && item.experience !== 'Not found' ? item.experience : 'Experience unknown'
                const status = (item.status || 'incompleted').toString()
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1)
                const finalScore = typeof item.finalScore !== 'undefined' && item.finalScore !== null
                  ? Number(item.finalScore).toFixed(1)
                  : '0.0'
                const questionCount = item.questionCount || 0

                return (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{role}</p>
                        <p className="text-sm text-slate-500">{experience} • {item.mode || 'Technical'} • {questionCount} questions</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{finalScore}/10</span>
                        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{statusLabel}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Started on {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
