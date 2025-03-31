import React, { useEffect } from "react";
import useStore from "../../zustand/store";

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
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <section className="mb-5">
        <h4>Active Users</h4>
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
                  <button className="btn btn-danger btn-sm" onClick={() => handleBan(user.id)}>Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h4>Banned Users</h4>
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
                  <button className="btn btn-success btn-sm" onClick={() => handleUnban(user.id)}>Unban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminPage;