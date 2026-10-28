
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight,
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
} from 'lucide-react';
import { Link } from "react-router-dom"
import '../styles.css';

const highlighted_projects = [
  {
    number: '01',
    type: 'BACKEND · SYSTEMS',
    title: 'Canvas-Lite',
    description:
      'A learning-management backend built around role-based access, a relational data model, and a clean API.',
    tags: ['FastAPI', 'PostgreSQL', 'Docker'],
    private: false,
    href: 'https://github.com/jaydenm1751/canvas-lite-backend',
  },
  {
    number: '02',
    type: 'DISTRIBUTED SYSTEMS',
    title: 'Raft Key-Value Store',
    description:
      'Exploring consensus, replicated state, and the engineering trade-offs behind reliable distributed systems.',
    tags: ['Python', 'Raft', 'gRPC'],
    private: true,
    href: 'https://github.com/jaydenm1751/Raft-KVStore',
  },
  {
    number: '03',
    type: 'PARALLEL SYSTEMS',
    title: 'CUDA K-Means',
    description:
      'An optimized K-Means algorithm using CUDA kernels, achieving up to approximately 25× end-to-end speedup over the CPU baseline on tested datasets.',
    tags: ['C++', 'CUDA', 'Thrust'],
    private: true,
    href: 'https://github.com/jaydenm1751/Lab2-CudaKMeans',
  },
  {
    number: '04',
    type: 'MACHINE LEARNING',
    title: 'World Cup Outcome Predictor',
    description:
      'A data-driven look at international football results using historical match data and predictive models.',
    tags: ['Python', 'Scikit-learn', 'MongoDB'],
    private: false,
    href: 'https://github.com/jaydenm1751/cap4770-finalproject',
  },
];

function Home() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a
          className="wordmark"
          href="#home"
          aria-label="Jayden McKenna home"
        >
          J<span>.</span>GM
        </a>

        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Highlighted work</a>
           <Link to="/projects">Projects</Link>
          <a href="#contact">Contact</a>
        </nav>

        <a className="availability" href="#contact">
          <span className="status-dot" aria-hidden="true" />
          Welcome to my corner of the internet
        </a>
      </header>

      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              PERSONAL SITE / EST. 2026
            </p>

            <h1 id="hero-title">
              Curious by nature.
              <br />
              <em>Engineer</em> by practice.
            </h1>

            <p className="hero-intro">
              I'm Jayden G. McKenna — a software engineer interested in how
              systems work, how ideas become products, and what we can build
              next.
            </p>

            <div className="hero-actions">
              <a className="button button-dark" href="#work">
                Explore my work <ArrowDownRight size={16} aria-hidden="true" />
              </a>
              <a className="text-link" href="#about">
                A little about me <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-meta">
              <span>
                <span className="meta-marker" aria-hidden="true">↳</span>
                Based in Dallas, Texas
              </span>
              <span>
                <span className="meta-marker" aria-hidden="true">↳</span>
                Software · Systems · AI
              </span>
            </div>
          </div>

          <div className="hero-art" aria-label="Abstract geometric artwork">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-orbit orbit-three" />
            <div className="art-core">
              <span>J</span>
            </div>
            <span className="art-label label-top">ALWAYS LEARNING</span>
            <span className="art-label label-bottom">BUILD / ITERATE / REPEAT</span>
            <span className="art-cross cross-one" aria-hidden="true">+</span>
            <span className="art-cross cross-two" aria-hidden="true">+</span>
            <span className="art-coordinate">
              32°46'49.8"N
              <br />
              96°48'05.1"W
            </span>
          </div>

          <div className="hero-index" aria-label="Section 1 of 3">
            <span>01</span>
            <span className="index-rule" />
            <span>03</span>
          </div>
        </section>

        <section className="ticker" aria-label="Areas of interest">
          <span>THINGS I LIKE TO BUILD</span>
          <b aria-hidden="true">✳</b>
          <span>SOFTWARE SYSTEMS</span>
          <b aria-hidden="true">✳</b>
          <span>APPLIED AI</span>
          <b aria-hidden="true">✳</b>
          <span>IDEAS INTO PRODUCTS</span>
          <b aria-hidden="true">✳</b>
          <span>ALWAYS LEARNING</span>
        </section>

        <section className="about section" id="about">
          <div className="section-kicker">
            <span>01 / ABOUT</span>
            <span>THE PERSON BEHIND THE PROJECTS</span>
          </div>

          <div className="about-grid">
            <h2>
              Building things.
              <br />
              <em>Understanding</em> why.
            </h2>

            <div className="about-body">
              <p>
                I enjoy the space where thoughtful engineering meets curiosity:
                designing APIs, learning how distributed systems behave, and
                experimenting with machine learning.
              </p>
              <p>
                This site is a living notebook for the work I'm doing, the
                ideas I'm exploring, and the things I learn along the way. It
                will grow as I do.
              </p>

              <div className="about-note">
                <Sparkles size={17} aria-hidden="true" />
                <span>
                  Currently exploring: systems design, deep learning, and
                  better ways to turn ideas into useful software.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="section-kicker">
            <span>02 / HIGHLIGHTS</span>
            <span>A FEW THINGS I'VE BUILT</span>
          </div>

          <div className="work-heading">
            <h2>
              Proof of <em>curiosity.</em>
            </h2>
            <p>
              A selection of projects spanning backend engineering,
              distributed systems, parallel computing, and machine learning.
            </p>
          </div>

          <div className="project-list">
            {highlighted_projects.map((project) => (
              <article className="project" key={project.number}>
                <span className="project-number">{project.number}</span>

                <div className="project-main">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="tags" aria-label="Technologies used">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                {project.private ? (
                  <div className="project-private">
                    <span>Private repository</span>
                    <p>Interested in the implementation? Reach out to see the code.</p>
                  </div>
                ) : (
                  <a
                    className="project-arrow"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
                  >
                    <ArrowUpRight size={21} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="section-kicker">
            <span>03 / SAY HELLO</span>
            <span>OPEN TO GOOD CONVERSATIONS</span>
          </div>

          <div className="contact-grid">
            <h2>
              Have an idea?
              <br />
              <em>Let's talk.</em>
            </h2>

            <div className="contact-side">
              <p>
                I'm always interested in thoughtful people, interesting
                problems, and ideas worth exploring.
              </p>

              <a
                className="button button-light"
                href="mailto:jgmckenna02@gmail.com"
              >
                Get in touch <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <div className="social-links" aria-label="Social links">
                <a
                  href="https://github.com/jaydenm1751"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} aria-hidden="true" />
                  GitHub
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>

                <a
                  href="https://www.linkedin.com/in/jaydenmckenna/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  LinkedIn
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>

                <a
                  href="https://www.instagram.com/jxydenmckenna/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={16} aria-hidden="true" />
                  Instagram
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>

                <a href="mailto:jgmckenna02@gmail.com">
                  <Mail size={16} aria-hidden="true" />
                  Email
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="wordmark footer-mark" href="#home" aria-label="Back to home">
          J<span>.</span>GM
        </a>
        <span>Made with curiosity, in Dallas, TX.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <span className="copyright">
          © {new Date().getFullYear()} JAYDEN G. MCKENNA
        </span>
      </footer>
    </div>
  );
}

export default Home;