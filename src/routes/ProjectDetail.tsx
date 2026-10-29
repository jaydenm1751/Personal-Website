
import { Link, useParams } from "react-router-dom";

const projectTitles: Record<string, string> = {
  "canvas-lite": "Canvas-Lite",
  "raft-key-value-store": "Raft Key-Value Store",
  "cuda-k-means": "CUDA K-Means",
  "world-cup-outcome-predictor": "World Cup Outcome Predictor",
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const title = slug ? projectTitles[slug] : undefined;

  if (!title) {
    return (
      <main className="project-detail-page">
        <p className="eyebrow">PROJECT NOT FOUND</p>
        <h1>That project doesn't exist.</h1>
        <Link to="/projects" data-log="project-detail:not-found-back">← Back to projects</Link>
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Link className="back-link" to="/projects" data-log="project-detail:back-to-projects">
        ← All projects
      </Link>
      <p className="eyebrow">PROJECT</p>
      <h1>{title}</h1>
    </main>
  );
}
