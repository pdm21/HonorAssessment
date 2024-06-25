import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./SessionsPage.css"; // Import custom CSS

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

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

  return (
    <div className="sessions-page-container container-fluid">
      <div className="row mt-5">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Past Sessions</h2>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h1 className="second-card-sessions mb-4">Sessions</h1>
              {sessions.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
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
                        <td>
                          {session.muscleGroups
                            ? session.muscleGroups
                                .map((muscle) => muscle.name)
                                .join(", ")
                            : "N/A"}
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
    </div>
  );
};

export default SessionsPage;
