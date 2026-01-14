import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowRight, LogIn } from 'lucide-react';
import teamService from '../services/teamService';
import { createTask } from '../utils/api';
import CreateTeamModal from './CreateTeamModal';
import JoinTeamModal from './JoinTeamModal';
import TeamView from './TeamView';
import toast from 'react-hot-toast';

const TeamDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const res = await teamService.getTeams();
      setTeams(res.data.teams);
    } catch (error) {
      console.error('Failed to load teams', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      // 1. Create Team
      const res = await teamService.createTeam({
        name: teamData.name,
        description: teamData.description
      });
      
      const newTeam = res.data.team;

      // 2. Invite Members
      if (teamData.members && teamData.members.length > 0) {
        const invitePromises = teamData.members.map(email => 
          teamService.inviteMember(newTeam._id, email)
            .catch(err => toast.error(`Failed to invite ${email}`))
        );
        await Promise.all(invitePromises);
      }

      // 3. Create Tasks
      if (teamData.tasks && teamData.tasks.length > 0) {
        const taskPromises = teamData.tasks.map(title => 
          createTask({
            title,
            teamId: newTeam._id,
            priority: 'Medium',
            status: 'Pending',
            category: 'Work'
          }).catch(err => toast.error(`Failed to create task: ${title}`))
        );
        await Promise.all(taskPromises);
      }

      toast.success('Team created successfully!');
      await loadTeams();
    } catch (error) {
      console.error('Create team error:', error);
      toast.error(error.response?.data?.message || 'Failed to create team');
      throw error; // Re-throw to let modal know it failed
    }
  };

  const handleJoinTeam = async (teamCode) => {
    try {
      await teamService.joinTeam(teamCode);
      toast.success('Joined team successfully!');
      await loadTeams();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to join team';
      
      // Handle validation errors (400) gracefully
      if (error.response?.status === 400) {
        if (message.includes('already a member')) {
          toast.success('You are already in this team!');
        } else {
          toast.error(message);
        }
      } else {
        console.error('Join team error:', error);
        toast.error(message);
      }
    }
  };

  if (selectedTeam) {
    return <TeamView team={selectedTeam} onBack={() => setSelectedTeam(null)} />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your workspaces and collaborators</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="flex-1 md:flex-none justify-center items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg transition-all shadow-sm font-medium text-sm sm:text-base"
          >
            <LogIn size={20} className="mr-2" />
            Join Team
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 md:flex-none justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
          >
            <Plus size={20} className="mr-2" />
            Create Team
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No teams yet</h3>
          <p className="text-gray-500 mt-2 mb-6">Create a team to start collaborating with others.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Create your first team &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              onClick={() => setSelectedTeam(team)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
                <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{team.description || 'No description provided'}</p>
              <div className="flex items-center text-sm text-gray-400 pt-4 border-t border-gray-50">
                <span>{team.members?.length || 1} Members</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTeam}
      />

      <JoinTeamModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinTeam}
      />
    </div>
  );
};

export default TeamDashboard;