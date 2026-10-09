import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:8000/api/v1"  // Local server URL in development
  : "https://task-manager-f8mo.onrender.com/api/v1";  // Production server URL

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user._id;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({ title: "", description: "", priority: "low", dueDate: "", completed: false });
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({ title: "", description: "", priority: "low", dueDate: "", completed: false });
  };

  // get tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load tasks. Please refresh to retry.");
    }
    setLoading(false);
  };

  // get task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
    }
    setLoading(false);
  };

  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task);
      setTasks((currentTasks) => [...currentTasks, res.data]);
      toast.success("Task created successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create task. Please retry.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (task) => {
    setLoading(true);
    try {
      const response = await axios.patch(`${serverUrl}/task/${task._id}`, task);
      setTasks((currentTasks) => currentTasks.map((existingTask) =>
        existingTask._id === response.data._id ? response.data : existingTask
      ));
      toast.success("Task updated successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update task. Please retry.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`);
      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
      setTasks(newTasks);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete task. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      const value = name === "completed" ? e.target.value === "true" : e.target.value;
      setTask((currentTask) => ({ ...currentTask, [name]: value }));
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    if (userId) {
      getTasks();
    } else {
      setTasks([]);
    }
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
