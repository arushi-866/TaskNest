import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import teamService from '../services/teamService';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const token = searchParams.get('token');
  const teamId = searchParams.get('teamId');

  useEffect(() => {
    if (!token || !teamId) {
      toast.error('Invalid invitation link');
      navigate('/dashboard');
      return;
    }

    if (!user) {
      // Store invite details to process after login
      sessionStorage.setItem('pendingInvite', JSON.stringify({ token, teamId }));
      toast.error('Please login to accept the invitation');
      navigate('/login');
      return;
    }

    const accept = async () => {
      try {
        await teamService.acceptInvite(token, teamId);
        toast.success('Joined team successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to join team');
        navigate('/dashboard');
      }
    };

    accept();
  }, [token, teamId, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="bg-white p-8 rounded-xl shadow-xl">
        <p className="text-lg font-semibold text-gray-700">Processing invitation...</p>
      </div>
    </div>
  );
};

export default AcceptInvite;