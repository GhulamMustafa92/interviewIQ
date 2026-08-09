import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerUrl } from '../App';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/api/user/profile`, { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="mt-2 text-emerald-50">Manage your information and track your interview activity.</p>
        </div>

        <div className="p-8 grid md:grid-cols-[1fr_0.9fr] gap-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Account Details</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between"><span>Name</span><span className="font-semibold">{profile?.user?.name || 'N/A'}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="font-semibold">{profile?.user?.email || 'N/A'}</span></div>
              <div className="flex justify-between"><span>Credits</span><span className="font-semibold">{Number(profile?.user?.credits || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Member Since</span><span className="font-semibold">{profile?.user?.createdAt ? new Date(profile.user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Interview Summary</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between"><span>Total Interviews</span><span className="font-semibold">{profile?.interviews?.length || 0}</span></div>
              <div className="flex justify-between"><span>Completed</span><span className="font-semibold">{profile?.interviews?.filter((item) => item.status === 'completed').length || 0}</span></div>
              <div className="flex justify-between"><span>Average Score</span><span className="font-semibold">{profile?.interviews?.length ? Number(profile.interviews.reduce((sum, item) => sum + (Number(item.finalScore) || 0), 0) / profile.interviews.length).toFixed(1) : '0.0'}/10</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
