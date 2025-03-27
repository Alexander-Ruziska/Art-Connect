import React from "react"
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";


function ArtistList() {
  const artistList = useStore((state) => state.artistList);

  return (
    <div>
      <section className="artists">
        {artistList?.map((item) => {
          return(
            <div key={item.artistId}>
              {/* figure out how to add the photo into the equation*/}
              <img />
              <h4>{item.name}</h4>
              <h5>{item.headline_description}</h5>
            </div>
          )
        })
        }
      </section>
    </div>
  )
};

export default ArtistList;
