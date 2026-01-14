const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Assuming auth middleware exists
const {
  createTeam,
  getTeams,
  inviteMember,
  acceptInvite,
  joinTeam,
  getTeamMembers
} = require('../controllers/teamController');

router.use(protect);
router.route('/').get(getTeams).post(createTeam);
router.post('/join', joinTeam);
router.post('/:id/invite', inviteMember);
router.post('/accept-invite', acceptInvite);
router.get('/:id/members', getTeamMembers);

module.exports = router;