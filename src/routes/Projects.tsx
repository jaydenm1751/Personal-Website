
import { Link } from "react-router-dom";

const projects = [
  {
    title: "Canvas-Lite",
    category: "Backend · Systems",
    description:
      "A learning management backend featuring role-based access control and a relational database.",
    technologies: ["FastAPI", "PostgreSQL", "Docker"],
    slug: "canvas-lite",
    status: "Public",
  },
  {
    title: "Raft Key-Value Store",
    category: "Distributed Systems",
    description:
      "A distributed key-value store exploring consensus and replicated state.",
    technologies: ["Python", "Raft", "gRPC"],
    slug: "raft-key-value-store",
    status: "Private",
  },
  {
    title: "CUDA K-Means",
    category: "Parallel Systems",
    description:
      "A parallel implementation of K-means clustering using GPU computing.",
    technologies: ["C++", "CUDA", "Thrust"],
    slug: "cuda-k-means",
    status: "Private",
  },
  {
    title: "World Cup Outcome Predictor",
    category: "Machine Learning",
    description:
      "A machine learning project investigating international football match outcomes.",
    technologies: ["Python", "Scikit-learn", "MongoDB"],
    slug: "world-cup-outcome-predictor",
    status: "Public",
  },
];

const categories = [
  "All projects",
  "Backend",
  "Distributed systems",
  "Parallel systems",
  "Machine learning",
];

export default function Projects() {
  return (
    <main className="projects-page">
      <header className="projects-heading">
        <p className="eyebrow">SELECTED WORK</p>
        <h1>Projects</h1>
        <p className="projects-intro">
          A collection of things I’ve built, explored, and learned along the way.
        </p>
      </header>

      <section className="project-controls" aria-label="Project search and filters">
        <label className="project-search">
          <span className="sr-only">Search projects</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search projects..."
            disabled
            aria-label="Search projects (coming later)"
          />
        </label>

        <div className="project-filters" aria-label="Project categories">
          {categories.map((category, index) => (
            <button
              className={`filter-pill ${index === 0 ? "active" : ""}`}
              type="button"
              key={category}
              disabled
              title="Filtering will be implemented later"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="projects-grid" aria-label="Projects">
        {projects.map((project, index) => (
          <Link
            className="project-card"
            to={`/projects/${project.slug}`}
            key={project.slug}
          >
            <div className={`project-art project-art-${index + 1}`}>
              <span className="project-art-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-art-category">{project.category}</span>
              <span className="project-card-arrow" aria-hidden="true">
                ↗
              </span>
              <div className="art-orbit art-orbit-one" />
              <div className="art-orbit art-orbit-two" />
              <div className="art-core" />
            </div>

            <div className="project-card-body">
              <div className="project-card-meta">
                <span>{project.category}</span>
                <span>{project.status === "Public" ? "↗ GitHub" : "Private repo"}</span>
              </div>

              <h2>{project.title}</h2>
              <p>{project.description}</p>

              <div className="project-tags">
                {project.technologies.map((technology) => (
                  <span className="project-tag" key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="projects-footer">
        <Link to="/">← Back to home</Link>
        <span>{projects.length} projects</span>
      </footer>
    </main>
  );
}
