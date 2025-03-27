
import OrganizationItem from "../OrganizationItem/OrganizationItem";
import { useEffect, useState } from "react";
import useStore from "../../zustand/store";

function OrganizationList() {
    const { organizations, fetchOrganizations } = useStore();
console.log(organizations);
    useEffect(() => {
        fetchOrganizations();
      }, [fetchOrganizations]);
    
      if (organizations?.length === 0) {
        return <p>Loading organizations...</p>;
      }
    
      return (
        
        <div className="image-container">
        {organizations?.map((organization) => (
        <OrganizationItem key={organization.id} organization={organization}/>
        ))}
      </div>
      )
   
  };


export default OrganizationList;