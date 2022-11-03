import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Task from './Task';
import TaskForm from './TaskForm';
import axios from 'axios';
import { URL } from '../App';
import loaderImg from '../assets/loader.gif';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [taskID, setTaskID] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    completed: false,
  });
  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/api/tasks`);
      setTasks(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    if (name === '') {
      return toast.error('Input field cannot be empty');
    }

    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success('Task added successfully');
      setFormData({ ...formData, name: '' });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const completeTask = tasks.filter((task) => {
      return task.completed === true;
    });
    setCompletedTasks(completeTask);
  }, [tasks]);

  const getTask = async (task) => {
    setFormData({ name: task.name, completed: false });
    setTaskID(task._id);
    setEdit(true);
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (name === '') {
      return toast.error('Input field cannot be empty.');
    }

    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({ ...formData, name: '' });
      setEdit(false);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setToComplete = async (task) => {
    const newFormData = {
      name: task.name,
      completed: true,
    };

    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="task-list">
      <h1 className="title">Task to do List</h1>
      <TaskForm
        name={name}
        handleInputChange={handleInputChange}
        createTask={createTask}
        Edit={Edit}
        updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className="flex-between">
          <p>
            <b>Total Tasks:</b> {tasks.length}
          </p>
          <p>
            <b>Completed Tasks:</b> {completedTasks.length}
          </p>
        </div>
      )}

      <hr />
      {Loading && (
        <div className="flex-center">
          <img src={loaderImg} alt="Loading" />
        </div>
      )}
      {!Loading && tasks.length === 0 ? (
        <p className="no-task">No task added.</p>
      ) : (
        <>
          {tasks.map((task, index) => {
            return (
              <Task
                key={task.id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getTask={getTask}
                setToComplete={setToComplete}
              />
            );
          })}
        </>
      )}
    </div>
  );
};

export default TaskList;
