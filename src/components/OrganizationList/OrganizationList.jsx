import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import OrganizationItem from "../OrganizationItem/OrganizationItem";
import "./OrganizationList.css";  // Import the stylesheet

function OrganizationList() {
  const { organizations, fetchOrganizations } = useStore();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return (
    <div id="organizationList" className="container mt-4">
      <h2 className="text-center">Organizations</h2>
      <div className="image-container">
        {organizations?.map((organization) => (
          <OrganizationItem key={organization.id} organization={organization} />
        ))}
      </div>
    </div>
  );
}

export default OrganizationList;
