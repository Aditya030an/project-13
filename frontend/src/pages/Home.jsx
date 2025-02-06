import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility

  // Fetch tasks from backend
  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tasks/getTask`
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  // Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTaskId) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/tasks/updateTask/${editingTaskId}`,
          {
            title,
            description,
            dueDate,
          }
        );
        toast.success("Task updated successfully!");
        setEditingTaskId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/tasks/createTask`, {
          title,
          description,
          dueDate,
        });
        toast.success("Task added successfully!");
      }
      fetchTask();
      setShowForm(false); // Hide form after adding/updating task
    } catch (error) {
      toast.error("Error saving task!");
    }

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  // Delete Task
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/tasks/deleteTask/${id}`
      );
      toast.success("Task deleted successfully!");
      fetchTask();
    } catch (error) {
      toast.error("Error deleting task!");
    }
  };

  // Toggle Task Completion using Checkbox
  const handleToggleCompletion = async (id, completed) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/tasks/updateTask/${id}`,
        {
          completed: !completed,
        }
      );
      toast.info(
        completed ? "Task marked as incomplete!" : "Task marked as completed!"
      );
      fetchTask();
    } catch (error) {
      toast.error("Error updating task!");
    }
  };

  // Set Task Data in Form for Editing
  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate.split("T")[0]);
    setEditingTaskId(task._id);
    setShowForm(true); // Show the form when editing a task
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 bg-transparent">Task Manager</h1>

      {/* Add Task Button */}
      <button
        onClick={toggleForm}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full max-w-md mb-4 hover:bg-blue-600"
      >
        {showForm ? "Close Form" : "Add Task"}
      </button>

      {/* Task Form */}
      {showForm && (
        <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-4 shadow rounded-md"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task..."
              required
              className="border border-gray-300 p-2 rounded-md w-full mb-2 focus:outline-none"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              required
              className="border border-gray-300 p-2 rounded-md w-full mb-2 focus:outline-none"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="border border-gray-300 p-2 rounded-md w-full mb-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600"
            >
              {editingTaskId ? "Update Task" : "Add Task"}
            </button>
            <button
              onClick={toggleForm}
              className="bg-red-500 mt-5 text-white px-4 py-2 rounded-md w-full max-w-md mb-4 hover:bg-red-600"
            >
              {showForm ? "Close Form" : "Add Task"}
            </button>
          </form>
        </div>
      )}

      {/* Incomplete Tasks Section */}
      <div className="mt-6 w-full bg-white p-4 shadow rounded-md">
        <h2 className="text-xl font-semibold mb-2 text-red-500">All Tasks</h2>
        {tasks.filter((task) => !task.completed).length === 0 ? (
          <p className="text-center text-gray-500">No incomplete tasks</p>
        ) : (
          tasks
            .filter((task) => !task.completed)
            .map((task) => (
              <div
                key={task._id}
                className="p-3 border-b last:border-none flex flex-col sm:flex-row items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Checkbox for Completion */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleCompletion(task._id, task.completed)
                    }
                    className="h-5 w-5 text-green-500"
                  />

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Completed Tasks Section */}
      <div className="mt-6 w-full bg-white p-4 shadow rounded-md">
        <h2 className="text-xl font-semibold mb-2 text-green-500">
          Completed Tasks
        </h2>
        {tasks.filter((task) => task.completed).length === 0 ? (
          <p className="text-center text-gray-500">No completed tasks</p>
        ) : (
          tasks
            .filter((task) => task.completed)
            .map((task) => (
              <div
                key={task._id}
                className="p-3 border-b last:border-none flex flex-col sm:flex-row items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-semibold line-through text-gray-500">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Checkbox for Completion */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleCompletion(task._id, task.completed)
                    }
                    className="h-5 w-5 text-green-500"
                  />

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Home;
