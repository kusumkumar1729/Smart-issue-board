import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  limit,
  deleteDoc,  // ← Added for delete
} from "firebase/firestore";
import "./Dashboard.css";

function jaccardSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  let intersection = 0;
  words1.forEach((word) => {
    if (words2.has(word)) intersection++;
  });
  const union = words1.size + words2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Open");
  const [assignedTo, setAssignedTo] = useState("");
  const [similarIssues, setSimilarIssues] = useState([]);
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editOldStatus, setEditOldStatus] = useState("");
  const [statusError, setStatusError] = useState("");

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIssues(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  async function checkSimilar(newTitle) {
    const recentQuery = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snapshot = await getDocs(recentQuery);
    const similar = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();
      const t1 = newTitle.toLowerCase();
      const t2 = data.title.toLowerCase();

      if (
        t1.includes(t2) ||
        t2.includes(t1) ||
        jaccardSimilarity(t1, t2) > 0.6
      ) {
        similar.push({ id: d.id, title: data.title });
      }
    });

    return similar;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setStatusError("");

    const similar = await checkSimilar(title);
    if (similar.length > 0) {
      setSimilarIssues(similar);
      setShowSimilarWarning(true);
      return;
    }

    await addDoc(collection(db, "issues"), {
      title,
      description,
      priority,
      status,
      assignedTo: assignedTo || "Unassigned",
      createdBy: user.email,
      createdByUid: user.uid,
      createdAt: serverTimestamp(),
    });
    resetForm();
  }

  async function handleUpdate() {
    setStatusError("");

    if (editOldStatus === "Open" && status === "Done") {
      setStatusError("Cannot move directly from Open to Done. Must go through 'In Progress' first.");
      return;
    }
    if (editOldStatus === "Done" && status === "Open") {
      setStatusError("Cannot revert from Done back to Open.");
      return;
    }

    await updateDoc(doc(db, "issues", editId), {
      title,
      description,
      priority,
      status,
      assignedTo: assignedTo || "Unassigned",
    });
    resetForm();
  }

  // Delete function
  async function handleDelete() {
    if (!deleteId) return;

    await deleteDoc(doc(db, "issues", deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  }

  function openDeleteModal(id) {
    setDeleteId(id);
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setDeleteId(null);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("Open");
    setAssignedTo("");
    setEditId(null);
    setShowSimilarWarning(false);
    setSimilarIssues([]);
    setStatusError("");
  }

  function startEdit(issue) {
    setEditId(issue.id);
    setTitle(issue.title);
    setDescription(issue.description);
    setPriority(issue.priority);
    setStatus(issue.status);
    setAssignedTo(issue.assignedTo || "");
    setEditOldStatus(issue.status);
  }

  const filteredIssues = issues.filter((issue) => {
    if (filterStatus !== "All" && issue.status !== filterStatus) return false;
    if (filterPriority !== "All" && issue.priority !== filterPriority) return false;
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Smart Issue Board</h1>
        <div className="user-info">
          <span>Logged in as {user.email}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Left: Create/Edit Form */}
        <aside className="create-form-card">
          <h2>{editId ? "Edit Issue" : "Create New Issue"}</h2>

          {statusError && <p className="error">{statusError}</p>}

          {showSimilarWarning && (
            <div className="warning">
              <p><strong>Similar issues detected:</strong></p>
              <ul>
                {similarIssues.map((s) => (
                  <li key={s.id}>{s.title}</li>
                ))}
              </ul>
              <div className="warning-buttons">
                <button onClick={() => setShowSimilarWarning(false)}>Cancel</button>
                <button
                  onClick={async () => {
                    await addDoc(collection(db, "issues"), {
                      title,
                      description,
                      priority,
                      status,
                      assignedTo: assignedTo || "Unassigned",
                      createdBy: user.email,
                      createdByUid: user.uid,
                      createdAt: serverTimestamp(),
                    });
                    resetForm();
                  }}
                  className="proceed-btn"
                >
                  Proceed Anyway
                </button>
              </div>
            </div>
          )}

          {!showSimilarWarning && (
            <form onSubmit={editId ? (e) => { e.preventDefault(); handleUpdate(); } : handleCreate}>
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the issue"
                  rows="5"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Email or name"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="create-btn">
                  {editId ? "Update Issue" : "Create Issue"}
                </button>
                {editId && (
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </aside>

        {/* Right: Filters + Issues */}
        <main className="issues-section">
          <div className="filters-card">
            <h2>Filters</h2>
            <div className="filters-row">
              <div className="filter-group">
                <label>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Priority</label>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="All">All Priorities</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <button onClick={() => { setFilterStatus("All"); setFilterPriority("All"); }} className="clear-btn">
                Clear Filters
              </button>
            </div>
          </div>

          <h2>All Issues ({filteredIssues.length})</h2>

          {filteredIssues.length === 0 ? (
            <div className="empty-state">
              <p>No issues match your filters. Create one to get started!</p>
            </div>
          ) : (
            <div className="issues-grid">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="issue-card">
                  <h3>{issue.title}</h3>
                  {issue.description && <p className="issue-desc">{issue.description}</p>}
                  <div className="issue-meta">
                    <span className={`priority-badge ${issue.priority.toLowerCase()}`}>
                      {issue.priority}
                    </span>
                    <span className={`status-badge ${issue.status.replace(" ", "-").toLowerCase()}`}>
                      {issue.status}
                    </span>
                    <span>Assigned: {issue.assignedTo || "Unassigned"}</span>
                    <span>Created by: {issue.createdBy}</span>
                  </div>
                  <div className="issue-actions">
                    <button onClick={() => startEdit(issue)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => openDeleteModal(issue.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete Issue?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={closeDeleteModal} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="confirm-delete-btn">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}