const Task = require('../models/Task');
const Team = require('../models/Team');

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort = '-createdAt', page = 1, limit = 100, teamId, filter } = req.query;

    // Build query
    const query = {};

    if (teamId) {
      // Verify team membership
      const team = await Team.findOne({ _id: teamId, 'members.user': req.user.id });
      if (!team) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this team\'s tasks' });
      }
      query.teamId = teamId;
      
      // Apply team filters
      if (filter === 'assigned') query.assignedTo = req.user.id;
      if (filter === 'created') query.userId = req.user.id;
    } else {
      // Personal tasks
      query.userId = req.user.id;
      query.teamId = { $exists: false };
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('assignedTo', 'name email');

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (task.teamId) {
      const team = await Team.findOne({ _id: task.teamId, 'members.user': req.user.id });
      if (!team) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      if (task.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user.id
    };

    // Remove empty optional fields
    Object.keys(taskData).forEach((key) => {
      if (taskData[key] === "" || taskData[key] === "null" || taskData[key] === undefined) {
        delete taskData[key];
      }
    });

    // If creating for a team, verify membership
    if (taskData.teamId) {
      const team = await Team.findOne({ _id: taskData.teamId, 'members.user': req.user.id });
      if (!team) {
        return res.status(403).json({ success: false, message: 'Not authorized to create task in this team' });
      }
    }

    const task = await Task.create(taskData);
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (task.teamId) {
      const team = await Team.findOne({ _id: task.teamId, 'members.user': req.user.id });
      if (!team) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      if (task.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    // Handle empty strings for optional fields
    if (req.body.assignedTo === '' || req.body.assignedTo === 'null') req.body.assignedTo = null;
    if (req.body.dueDate === '' || req.body.dueDate === 'null') req.body.dueDate = null;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (task.teamId) {
      const team = await Team.findOne({ _id: task.teamId, 'members.user': req.user.id });
      // Only allow team admin or task creator to delete? For now, let's allow any member or restrict to creator
      if (!team || (task.userId.toString() !== req.user.id)) {
         return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      if (task.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all tasks for the user
    // This should probably include personal tasks AND team tasks assigned to user
    const allTasks = await Task.find({
      $or: [
        { userId: userId, teamId: { $exists: false } }, // Personal tasks
        { assignedTo: userId } // Tasks assigned to me in teams
      ]
    });

    // Calculate statistics
    const stats = {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status === 'Pending').length,
      inProgress: allTasks.filter(t => t.status === 'In Progress').length,
      completed: allTasks.filter(t => t.status === 'Completed').length,
      overdue: allTasks.filter(t => t.isOverdue).length,
      byPriority: {
        high: allTasks.filter(t => t.priority === 'High').length,
        medium: allTasks.filter(t => t.priority === 'Medium').length,
        low: allTasks.filter(t => t.priority === 'Low').length
      },
      byCategory: {},
      completionRate: allTasks.length > 0 
        ? ((allTasks.filter(t => t.status === 'Completed').length / allTasks.length) * 100).toFixed(1)
        : 0
    };

    // Get category breakdown
    allTasks.forEach(task => {
      const category = task.category || 'General';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });

    // Get tasks due this week
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);

    stats.dueThisWeek = allTasks.filter(t => 
      t.dueDate && 
      t.status !== 'Completed' &&
      t.dueDate >= today && 
      t.dueDate <= weekFromNow
    ).length;

    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};