import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SessionsPage.css";

// Main functional component for the SessionsPage
const SessionsPage = () => {
  const [sessions, setSessions] = useState([]); // State to store sessions
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal
  const [selectedSessionId, setSelectedSessionId] = useState(null); // State for selected session ID
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]); // State for selected muscle groups

  // Fetch sessions data on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      // Send a GET request to the sessions API endpoint
      try {
        const response = await fetch(
          "https://dev-api.livehonorr.com/coach/session/past",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched sessions data:", data);

        // Sort sessions data by start time and set the sessions state
        if (data && data.data) {
          const sortedSessions = data.data.sort(
            (a, b) => new Date(b.startTime) - new Date(a.startTime)
          );
          console.log("Sorted sessions data:", sortedSessions);
          setSessions(sortedSessions);
        } else {
          console.log("No sessions data found");
          setSessions([]);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        alert("Error fetching sessions. Check the console for details.");
        setSessions([]); // Ensure sessions is an array in case of error
      }
    };

    fetchSessions();
  }, []);

  // Format date into a readable string
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  // Determine the class for session status
  const getStatusClass = (status) => {
    switch (status) {
      case "Not Started":
        return "badge badge-secondary";
      case "Canceled" || "Cancelled":
        return "badge badge-danger";
      case "Completed":
        return "badge badge-success";
      default:
        return "badge badge-secondary";
    }
  };

  // This function is called when the edit button is clicked. It sets the selectedSessionId and updates the selectedMuscleGroups state
  // to contain the titles of the muscle groups for the selected session. If there are no muscle groups, it sets an empty array.
  // The setShowModal(true) line opens the modal.
  const handleEditMuscleGroups = (sessionId, muscleGroups) => {
    console.log("Editing Muscle Groups for Session:", sessionId, muscleGroups);
    setSelectedSessionId(sessionId);
    setSelectedMuscleGroups(
      muscleGroups ? muscleGroups.map((group) => group.title.trim()) : []
    );
    setShowModal(true);
  };

  // This function is called when a checkbox in the modal is toggled. It adds or removes the muscle group from the
  // selectedMuscleGroups state.
  const handleToggleMuscleGroup = (muscle) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(muscle)
        ? prev.filter((group) => group !== muscle)
        : [...prev, muscle]
    );
  };

  // Save the edited muscle groups
  const handleSaveMuscleGroups = () => {
    console.log("Saving Muscle Groups:", selectedMuscleGroups);
    const updatedSessions = sessions.map((session) =>
      session.id === selectedSessionId
        ? {
            ...session,
            muscleGroups: selectedMuscleGroups.map((title) => ({
              title,
              id: title,
            })),
          }
        : session
    );
    setSessions(updatedSessions);
    setShowModal(false);
  };

  return (
    <div className="sessions-page-container container-fluid d-flex flex-column">
      {/* Navbar for navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Sessions
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link">
                | <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Sessions
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content area for the page */}
      <div className="row mt-5 flex-grow-1">
        {/* Container for the past sessions title */}
        <div className="top-cont-sessions col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="past-sessions-title card-title">
                <a href="#" className="text-decoration-none active">
                  Past Sessions
                </a>
              </h2>
            </div>
          </div>
        </div>

        {/* Container for the sessions table */}
        <div className="bottom-cont-sessions col-12 scrollable-container">
          <div className="card">
            <div className="card-body">
              <h1 className="second-card-sessions mb-4 sticky-title">
                Sessions
              </h1>
              {sessions.length > 0 ? (
                <table className="table table-bordered">
                  <thead className="sticky-header">
                    <tr className="header-row">
                      <th>Client</th>
                      <th>Date & Time</th>
                      <th>Duration (mins)</th>
                      <th>Location</th>
                      <th>Session Type</th>
                      <th>Status</th>
                      <th>Muscle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id}>
                        <td className="client-name">
                          {session.client ? session.client.name : "N/A"}
                        </td>
                        <td>
                          {formatDate(session.startTime).toLocaleString()}
                        </td>
                        <td>{session.duration}</td>
                        <td>{session.location}</td>
                        <td>{session.sessionType}</td>
                        <td>
                          <span className={getStatusClass(session.status)}>
                            {session.status}
                          </span>
                        </td>
                        <td className="muscle-groups">
                          {session.muscleGroups
                            ? session.muscleGroups.map((muscle) => (
                                <span
                                  key={muscle.title}
                                  className="muscle-group-badge"
                                >
                                  {muscle.title}
                                </span>
                              ))
                            : ""}
                          <span
                            className="edit-button"
                            onClick={() =>
                              handleEditMuscleGroups(
                                session.id,
                                session.muscleGroups
                              )
                            }
                          >
                            <i className="fas fa-edit"></i>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No sessions available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <footer className="footer mt-auto py-3">
        <div className="container d-flex justify-content-between">
          <span className="text-muted">2024 © HONOR</span>
          <div>
            <a href="#" className="text-muted me-3">
              About
            </a>
            <a href="#" className="text-muted me-3">
              Contact
            </a>
            <a href="#" className="text-muted">
              FAQ
            </a>
          </div>
        </div>
      </footer>

      {/* Modal for editing muscle groups */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Muscle Groups</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {[
            "Back",
            "Biceps",
            "Chest",
            "Core",
            "Shoulders",
            "Triceps",
            "Quads",
            "Hamstrings",
            "Glutes",
            "Calves",
          ].map((muscle) => (
            <div key={muscle} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={muscle}
                id={muscle}
                checked={selectedMuscleGroups.includes(muscle)}
                onChange={() => handleToggleMuscleGroup(muscle)}
              />
              <label className="form-check-label" htmlFor={muscle}>
                {muscle}
              </label>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveMuscleGroups}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SessionsPage;
