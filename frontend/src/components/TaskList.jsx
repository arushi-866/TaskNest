import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onUpdate }) => {
  if (tasks.length === 0) {
    return null; // Empty state handled in Dashboard
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
