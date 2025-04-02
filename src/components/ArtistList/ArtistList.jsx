import React, { useEffect } from "react";
import useStore from "../../zustand/store";
import ArtistItem from "../ArtistItem/ArtistItem";
import "./ArtistList.css";

function ArtistList() {
  const artistList = useStore((state) => state.artistList);
  const fetchArtists = useStore((state) => state.fetchArtists);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <div id="artistList" className="mt-4">
      <h2 className="text-center mb-4">Artist List</h2>
      <div className="image-container">
        {artistList?.map((artist) => (
          <ArtistItem key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}

export default ArtistList;
