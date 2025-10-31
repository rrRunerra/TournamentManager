import { useState, useEffect } from "react";
import Calls from "../calls.js";

export default function TournamentDetailPage() {
  const [info, setInfo] = useState(null);
  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    async function fetchTournamentDetail() {
      try {
        const response = await Calls.getTournament({ id });
        setInfo(response);
      } catch (error) {
        console.error("Error fetching tournament detail:", error);
      }
    }
    fetchTournamentDetail();
  }, [id]);

  if (!info) return <p>Loading...</p>;
  console.log(info)
  return (
    <div style={{ padding: "20px", maxWidth: "600px", fontFamily: "sans-serif" }}>
      <h2>{info.name}</h2>
      <p><strong>Description:</strong> {info.description}</p>
      <p>
        <strong>Start Date:</strong>{" "}
        {new Date(info.startDate).toLocaleString()}
      </p>
      <p>
        <strong>End Date:</strong>{" "}
        {new Date(info.endDate).toLocaleString()}
      </p>
      <p><strong>Status:</strong> {info.status}</p>
      <p><strong>Team Size:</strong> {info.teamSize}</p>
    </div>
  );
}
