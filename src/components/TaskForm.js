const TaskForm = ({
  createTask,
  name,
  handleInputChange,
  Edit,
  updateTask,
}) => {
  return (
    <form className="task-form" onSubmit={Edit ? updateTask : createTask}>
      <input
        type="text"
        placeholder="Add a Task"
        name="name"
        value={name}
        onChange={handleInputChange}
      />
      <button type="submit">{Edit ? 'Edit' : 'Add'}</button>
    </form>
  );
};

export default TaskForm;
