import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import "./AdminPage.css"; 

function AdminPage() {
  const users = useStore((state) => state.adminUsers);
  const fetchAdminUsers = useStore((state) => state.fetchAdminUsers);
  const banUser = useStore((state) => state.banUser);
  const unbanUser = useStore((state) => state.unbanUser);

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const handleBan = async (userId) => {
    await banUser(userId);
    fetchAdminUsers();
  };

  const handleUnban = async (userId) => {
    await unbanUser(userId);
    fetchAdminUsers();
  };

  const bannedUsers = users.filter(user => user.is_banned);
  const activeUsers = users.filter(user => !user.is_banned);

  return (
    <div className="admin-dashboard container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <section className="mb-5">
        <h4 className="mb-3">Active Users</h4>
        <div className="table-wrapper">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Is Artist</th>
                <th>Is Organization</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{String(user.is_artist)}</td>
                  <td>{String(user.is_organization)}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleBan(user.id)} style={{ borderRadius: "1px", border: "1px solid black", backgroundColor: "#e0e0e0", padding: "6px 12px", fontSize: "1rem", color: "black" }}>Disable</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
  <h4 className="mb-3">Disabled Users</h4>
  <div className="table-wrapper">
    <table className="table table-striped table-bordered table-hover">
      <thead className="table-danger">
        <tr>
          <th>Username</th>
          <th>Is Artist</th>
          <th>Is Organization</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bannedUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{String(user.is_artist)}</td>
            <td>{String(user.is_organization)}</td>
            <td>{user.phone || "N/A"}</td>
            <td>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleUnban(user.id)}
                style={{ borderRadius: "3px", border: "1px solid black", backgroundColor: "#e0e0e0", padding: "6px 12px", fontSize: "1rem", color: "black" }}>
                Enable
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

    </div>
  );
}

export default AdminPage;
