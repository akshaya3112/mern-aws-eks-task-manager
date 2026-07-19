import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [toast, setToast] = useState(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [animatedPending, setAnimatedPending] = useState(0);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const avatarLabel = userName.slice(0, 2).toUpperCase();

  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      setToast({ type: "error", title: "Load failed", message: "We could not refresh your tasks right now." });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [token]);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setToast({ type: "error", title: "Missing title", message: "Please enter a task title." });
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "/tasks",
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setDescription("");
      setToast({ type: "success", title: "Task added", message: "Your new task is ready." });
      fetchTasks();
    } catch (error) {
      setToast({ type: "error", title: "Create failed", message: "Your task could not be created." });
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

      setToast({ type: "success", title: "Task removed", message: "The task has been deleted." });
      fetchTasks();
    } catch (error) {
      setToast({ type: "error", title: "Delete failed", message: "We could not remove that task." });
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      await API.put(
        `/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      setToast({ type: "error", title: "Update failed", message: "We could not update the task status." });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  useEffect(() => {
    let frameId;
    const duration = 650;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedTotal(Math.round(tasks.length * eased));
      setAnimatedCompleted(Math.round(completedCount * eased));
      setAnimatedPending(Math.round(pendingCount * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [tasks.length, completedCount, pendingCount]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || (filter === "completed" ? task.completed : !task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  // Deterministically generate a priority for UI elements
  const getTaskPriority = (id) => {
    if (!id) return { label: "Low", color: styles.priorityLow, dotColor: "#3b82f6" };
    const code = id.charCodeAt(id.length - 1);
    if (code % 3 === 0) {
      return { label: "High", color: styles.priorityHigh, dotColor: "#ef4444" };
    }
    if (code % 3 === 1) {
      return { label: "Medium", color: styles.priorityMedium, dotColor: "#f59e0b" };
    }
    return { label: "Low", color: styles.priorityLow, dotColor: "#10b981" };
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <div className={styles.brandLogo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className={styles.brandName}>TaskFlow</span>
          <span className={styles.workspacePill}>Studio Workspace</span>
        </div>

        <div className={styles.navCenter}>
          <div className={styles.welcomeUser}>
            <span>Welcome back,</span>
            <strong>{userName}</strong>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.themeToggleBox}>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>{avatarLabel}</div>
          </div>
          <button onClick={logout} className={styles.logoutBtn} title="Sign Out">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <div className={styles.workspaceWrapper}>
        {/* Statistics Banner */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Total Tasks</span>
              <strong className={styles.statValue}>{animatedTotal}</strong>
              <span className={styles.statDesc}>Registered in workspace</span>
            </div>
            <div className={styles.statIconBox} style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Completed</span>
              <strong className={styles.statValue} style={{ color: "#10b981" }}>{animatedCompleted}</strong>
              <span className={styles.statDesc}>Tasks checked off</span>
            </div>
            <div className={styles.statIconBox} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Pending</span>
              <strong className={styles.statValue} style={{ color: "#f59e0b" }}>{animatedPending}</strong>
              <span className={styles.statDesc}>Awaiting completion</span>
            </div>
            <div className={styles.statIconBox} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statTitle}>Completion Rate</span>
              <strong className={styles.statValue}>{completionRate}%</strong>
              <div className={styles.miniProgressTrack}>
                <div className={styles.miniProgressFill} style={{ width: `${completionRate}%` }} />
              </div>
            </div>
            <div className={styles.statIconBox} style={{ background: "rgba(124, 58, 237, 0.1)", color: "#7c3aed" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Form & Tools */}
          <aside className={styles.controlPanel}>
            {/* Search and Filters Card */}
            <div className={styles.filterCard}>
              <h3 className={styles.cardSectionTitle}>Workspace Search</h3>
              <div className={styles.searchWrapper}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchShortcut}>/</span>
              </div>

              <h3 className={styles.cardSectionTitle} style={{ marginTop: "24px" }}>Filter Status</h3>
              <div className={styles.filterChips}>
                {[
                  { key: "all", label: "All Tasks", count: tasks.length },
                  { key: "pending", label: "Pending", count: pendingCount },
                  { key: "completed", label: "Completed", count: completedCount },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`${styles.filterChip} ${filter === item.key ? styles.activeChip : ""}`}
                    onClick={() => setFilter(item.key)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.chipCount}>{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Task Card */}
            <div className={styles.addTaskCard}>
              <div className={styles.addTaskHeader}>
                <h3>Create New Task</h3>
                <p>Add details to outline your next deliverable.</p>
              </div>

              <form onSubmit={addTask} className={styles.taskForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Task Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g., Deploy production build"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    placeholder="Add details, links, or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className={styles.formTextarea}
                  />
                </div>

                <button type="submit" className={styles.createTaskBtn} disabled={loading}>
                  {loading ? (
                    <span className={styles.btnSpinner}></span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span>Create Task</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside>

          {/* Right Column: Task List Canvas */}
          <main className={styles.taskCanvas}>
            <div className={styles.canvasHeader}>
              <div className={styles.canvasHeaderInfo}>
                <h2>Tasks Workspace</h2>
                <p>Managing {filteredTasks.length} out of {tasks.length} tasks</p>
              </div>
            </div>

            {isFetching ? (
              <div className={styles.skeletonContainer}>
                {[1, 2, 3].map((val) => (
                  <div key={val} className={styles.skeletonCard}>
                    <div className={styles.skeletonLineShort} />
                    <div className={styles.skeletonLineLong} />
                    <div className={styles.skeletonActions} />
                  </div>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIllustration}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="13" x2="15" y2="13"></line>
                    <line x1="9" y1="17" x2="11" y2="17"></line>
                  </svg>
                </div>
                <h3>No tasks match your selection</h3>
                <p>Create a task or change your filters to view active cards.</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {filteredTasks.map((task) => {
                  const priority = getTaskPriority(task._id);
                  return (
                    <article key={task._id} className={`${styles.taskCard} ${task.completed ? styles.cardCompleted : ""}`}>
                      <div className={styles.taskColorBorder} className={priority.color} />
                      
                      <div className={styles.taskCardBody}>
                        <div className={styles.taskLeftSection}>
                          <button
                            type="button"
                            onClick={() => toggleTaskCompletion(task)}
                            className={`${styles.checkboxBtn} ${task.completed ? styles.checked : ""}`}
                            aria-label={task.completed ? "Mark pending" : "Mark completed"}
                          >
                            {task.completed && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </button>
                        </div>

                        <div className={styles.taskMiddleSection}>
                          <h3 className={styles.taskTitle}>{task.title}</h3>
                          <p className={styles.taskDesc}>
                            {task.description || "No description provided."}
                          </p>
                          
                          <div className={styles.taskMetaRow}>
                            <span className={styles.metaBadge}>
                              <span className={styles.metaDot} style={{ background: priority.dotColor }} />
                              {priority.label} Priority
                            </span>
                            <span className={`${styles.statusBadge} ${task.completed ? styles.statusCompleted : styles.statusPending}`}>
                              {task.completed ? "Done" : "In Progress"}
                            </span>
                          </div>
                        </div>

                        <div className={styles.taskRightSection}>
                          <button
                            type="button"
                            onClick={() => deleteTask(task._id)}
                            className={styles.deleteBtn}
                            title="Delete Task"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default Dashboard;