import VideoCard from "./VideoCard.jsx";
import "./VideoGrid.css";

export default function VideoGrid({ participants }) {
  return (
    <div className="vg-grid">
      {participants.map((p) => (
        <VideoCard key={p.identity} participant={p} />
      ))}
    </div>
  );
}
