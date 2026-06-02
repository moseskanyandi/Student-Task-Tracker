import { useState } from "react";
import "../App.css";

function Dashboard() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const addTask = () => {
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Student Task Tracker</h1>
        <p>Deep Work Session</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="search-input"
        />
      </div>

      <div className="summary-grid">

        <div className="summary-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="summary-card">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>

        <div className="summary-card">
          <h3>Pending</h3>
          <p>{pendingTasks}</p>
        </div>

        <div className="summary-card">
          <h3>In Progress</h3>
          <p>{pendingTasks}</p>
        </div>

      </div>

      <div className="task-form">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
          }
          className="task-input"
        />

        <button
          onClick={addTask}
          className="add-btn"
        >
          Add Task
        </button>
      </div>

      <div className="tasks-section">
        <h2>Recent Tasks</h2>

        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
            >
              <h3
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {task.title}
              </h3>

              <button
                onClick={() =>
                  toggleComplete(task.id)
                }
                className="complete-btn"
              >
                {task.completed
                  ? "Completed"
                  : "Mark Complete"}
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Dashboard;