import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";

function OrganizationPage() {
    const organizationObj = useStore((state) => state.organizationObj);
    const fetchOrganization = useStore((state) => state.fetchOrganization);
    const { organizationId } = useParams(); // Correct parameter name

    useEffect(() => {
        console.log(`Getting organization by id ${organizationId}`);
        fetchOrganization(organizationId);
    }, [organizationId, fetchOrganization]);

    return (
        <div id='cards'>
            <section className='organization'>
                {organizationObj && (
                    <div key={organizationObj.id} id={organizationObj.id}>
                        <h2>{organizationObj.name}</h2>
                        {/* <img src={organizationObj.card_photo} alt={organizationObj.name} /> */}
                        <h4>Recent Work</h4>
                        <p>{organizationObj.description}</p>
                        <p>{organizationObj.mission_statement}</p>
                    </div>
                )}
            </section>
        </div>
    );
}

export default OrganizationPage;
