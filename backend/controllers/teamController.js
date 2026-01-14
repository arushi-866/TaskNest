const Team = require('../models/Team');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Generate unique 6-digit code
    let teamCode;
    let isUnique = false;
    while (!isUnique) {
      teamCode = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await Team.findOne({ teamCode });
      if (!existing) isUnique = true;
    }

    const team = await Team.create({
      name,
      description,
      teamCode,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'Admin' }]
    });
    res.status(201).json({ success: true, data: { team } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's teams
// @route   GET /api/teams
// @access  Private
const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ 'members.user': req.user.id })
      .populate('members.user', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: teams.length, data: { teams } });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite member to team
// @route   POST /api/teams/:id/invite
// @access  Private (Admin only)
const inviteMember = async (req, res, next) => {
  try {
    const { email, role = 'Member' } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const member = team.members.find(m => m.user.toString() === req.user.id);
    if (!member || member.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to invite members' });
    }

    // Check if already a member (if user exists)
    const userToInvite = await User.findOne({ email });
    if (userToInvite && team.members.some(m => m.user.toString() === userToInvite._id.toString())) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    if (team.invitations.some(i => i.email === email)) {
      return res.status(400).json({ success: false, message: 'User already invited' });
    }

    // Ensure teamCode exists for legacy teams
    if (!team.teamCode) {
      let teamCode;
      let isUnique = false;
      while (!isUnique) {
        teamCode = Math.floor(100000 + Math.random() * 900000).toString();
        const existing = await Team.findOne({ teamCode });
        if (!existing) isUnique = true;
      }
      team.teamCode = teamCode;
      await team.save();
    }

    const token = crypto.randomBytes(20).toString('hex');
    team.invitations.push({ email, token, role, invitedBy: req.user.id });
    await team.save();

    const message = `Hello,\n\n` +
      `You have been invited to join the "${team.name}" workspace on TaskNest.\n\n` +
      `To accept this invitation and start collaborating:\n` +
      `1. Log in to your TaskNest account\n` +
      `2. Navigate to the "Teams" dashboard\n` +
      `3. Click the "Join Team" button\n` +
      `4. Enter the following Team Code:\n\n` +
      `${team.teamCode}\n\n` +
      `Best regards,\nThe TaskNest Team`;

    try {
      await sendEmail({
        email: email,
        subject: `Invitation to join ${team.name} on TaskNest`,
        message
      });

      res.status(200).json({ success: true, message: 'Invitation email sent' });
    } catch (error) {
      console.error('Email send error:', error);
      team.invitations.pull({ token }); // Remove the specific invitation
      await team.save();
      return next(new Error(`Email could not be sent: ${error.message}`));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invitation
// @route   POST /api/teams/accept-invite
// @access  Private
const acceptInvite = async (req, res, next) => {
  try {
    const { token, teamId } = req.body;
    const team = await Team.findById(teamId);
    
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const invitationIndex = team.invitations.findIndex(
      i => i.token === token && i.email === req.user.email
    );

    if (invitationIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invitation' });
    }

    team.members.push({ user: req.user.id, role: team.invitations[invitationIndex].role });
    team.invitations.splice(invitationIndex, 1);
    await team.save();

    res.status(200).json({ success: true, message: 'Joined team successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Join team with code
// @route   POST /api/teams/join
// @access  Private
const joinTeam = async (req, res, next) => {
  try {
    let { teamCode } = req.body;
    if (!teamCode) {
      return res.status(400).json({ success: false, message: 'Please provide a team code' });
    }

    // Normalize code (remove whitespace)
    teamCode = String(teamCode).trim();

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(400).json({ success: false, message: 'Invalid Team Code' });
    }

    // Check if already a member (safely handle potential nulls)
    const isMember = team.members.some(m => m.user && m.user.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    team.members.push({ user: req.user.id, role: 'Member' });
    await team.save();

    res.status(200).json({ success: true, message: 'Joined team successfully', data: { team } });
  } catch (error) {
    console.error('Join Team Error:', error);
    next(error);
  }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Private
const getTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('members.user', 'name email');
    
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    
    if (!team.members.some(m => m.user._id.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: { members: team.members } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  inviteMember,
  acceptInvite,
  joinTeam,
  getTeamMembers
};