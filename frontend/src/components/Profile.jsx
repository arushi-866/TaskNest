import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = ({ onClose }) => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="p-4 bg-white/50 rounded-xl">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
              <p className="text-lg font-medium text-gray-900 mt-1">{user?.name || 'N/A'}</p>
            </div>

            <div className="p-4 bg-white/50 rounded-xl">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <p className="text-lg font-medium text-gray-900 mt-1">{user?.email || 'N/A'}</p>
            </div>

            {user?.id && (
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">User ID</label>
                <p className="text-sm font-mono text-gray-700 mt-1 break-all">{user?.id}</p>
              </div>
            )}

            {user?.createdAt && (
              <div className="p-4 bg-white/50 rounded-xl">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Member Since</label>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex-1 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 hover-lift"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
