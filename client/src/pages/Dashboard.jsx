import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter task title");
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "/tasks",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      alert("Delete Failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.headerCard}>
          <div>
            <p className={styles.eyebrow}>Dashboard</p>
            <h1>Keep your priorities moving.</h1>
            <p className={styles.subtitle}>Organize your tasks with a focused and elegant workspace.</p>
          </div>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
          <div className={styles.statCard}>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.formCard}>
            <h2>Add a new task</h2>
            <p>Capture your next move in seconds.</p>

            <form onSubmit={addTask} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="title">Task title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Add some context or details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                />
              </div>

              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? "Creating..." : "Add task"}
              </button>
            </form>
          </div>

          <div className={styles.taskPanel}>
            <div className={styles.taskPanelHeader}>
              <h2>My tasks</h2>
              <span>{tasks.length} items</span>
            </div>

            {tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started on a more organized day.</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {tasks.map((task) => (
                  <div key={task._id} className={styles.taskCard}>
                    <div className={styles.taskTopRow}>
                      <h3>{task.title}</h3>
                      <span className={task.completed ? styles.completedBadge : styles.pendingBadge}>
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <p>{task.description}</p>

                    <button onClick={() => deleteTask(task._id)} className={styles.deleteButton}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;