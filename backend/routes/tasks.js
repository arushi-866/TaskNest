const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { 
  createTaskValidation, 
  updateTaskValidation, 
  taskIdValidation 
} = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Task CRUD operations
router.route('/')
  .get(getTasks)
  .post(createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
  .get(taskIdValidation, getTask)
  .put(updateTaskValidation, updateTask)
  .delete(taskIdValidation, deleteTask);

module.exports = router;