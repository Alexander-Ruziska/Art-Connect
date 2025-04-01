import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import { useParams } from "react-router-dom";
import ArtistItem from "../ArtistItem/ArtistItem";

function ArtistList() {
  const artistList = useStore((state) => state.artistList);
  const fetchArtists = useStore((state) => state.fetchArtists);

  useEffect(() => {
    console.log("Getting artistList");
    fetchArtists();
  }, [fetchArtists]);

  return (
    <div>
      <section className="artists">
        {artistList?.map((artist) => (
          <ArtistItem key={artist.id} artist={artist} /> 
        ))}
      </section>
    </div>
  );
}

export default ArtistList;
