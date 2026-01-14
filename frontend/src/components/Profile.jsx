import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Edit2, Save, X, Lock, Trash2, AlertTriangle } from 'lucide-react';

const Profile = ({ onClose }) => {
  const { user, logout, updateProfile, changePassword, deleteAccount } = useAuth();
  
  // Edit Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  
  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');
    setLoading(true);
    try {
      await updateProfile({ name });
      setIsEditingName(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    
    setLoading(true);
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="dashboard-card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
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
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-white">
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
              <div className="flex items-center justify-between mt-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button onClick={handleUpdateName} disabled={loading} className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Save size={20} />
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-medium text-gray-900">{user?.name || 'N/A'}</p>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-indigo-600">
                      <Edit2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-white/50 rounded-xl">
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <p className="text-lg font-medium text-gray-900 mt-1">{user?.email || 'N/A'}</p>
            </div>

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

            {/* Security Section */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
              >
                <Lock size={18} className="mr-2" />
                Change Password
              </button>

              {isChangingPassword && (
                <form onSubmit={handleChangePassword} className="mt-4 space-y-3 bg-gray-50 p-4 rounded-xl animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Control */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center text-red-600 font-semibold hover:text-red-700"
              >
                <Trash2 size={18} className="mr-2" />
                Delete Account
              </button>
            </div>
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Account?</h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
