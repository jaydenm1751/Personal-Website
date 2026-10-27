import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import './styles.css';

const projects = [
  {
    number: '01',
    type: 'BACKEND · SYSTEMS',
    title: 'Canvas-Lite',
    description: 'A learning-management backend built around role-based access, a relational data model, and a clean API.',
    tags: ['FastAPI', 'PostgreSQL', 'Docker'],
    href: 'https://github.com/',
  },
  {
    number: '02',
    type: 'DISTRIBUTED SYSTEMS',
    title: 'Raft Key-Value Store',
    description: 'Exploring consensus, replicated state, and the engineering trade-offs behind reliable distributed systems.',
    tags: ['Python', 'Raft', 'gRPC'],
    href: 'https://github.com/',
  },
  {
    number: '03',
    type: 'MACHINE LEARNING',
    title: 'World Cup Outcome Predictor',
    description: 'A data-driven look at international football results using historical match data and predictive models.',
    tags: ['Python', 'Scikit-learn', 'MongoDB'],
    href: 'https://github.com/',
  },
];

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Jayden McKenna home">J<span>.</span>GM</a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Selected work</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="availability" href="#contact"><span className="status-dot" /> Welcome to my corner of the internet</a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> PERSONAL SITE / EST. 2026</p>
            <h1>Curious by nature.<br /><em>Engineer</em> by practice.</h1>
            <p className="hero-intro">I'm Jayden G. McKenna — a software engineer interested in how systems work, how ideas become products, and what we can build next.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#work">Explore my work <ArrowDownRight size={16} /></a>
              <a className="text-link" href="#about">A little about me <ArrowUpRight size={15} /></a>
            </div>
            <div className="hero-meta">
              <span><span className="meta-marker">↳</span> Based in Dallas, Texas</span>
              <span><span className="meta-marker">↳</span> Software · Systems · AI</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Abstract geometric artwork">
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>
            <div className="art-orbit orbit-three"></div>
            <div className="art-core"><span>J</span></div>
            <span className="art-label label-top">ALWAYS LEARNING</span>
            <span className="art-label label-bottom">BUILD / ITERATE / REPEAT</span>
            <span className="art-cross cross-one">+</span>
            <span className="art-cross cross-two">+</span>
            <span className="art-coordinate">32°46'49.8"N<br />96°48'05.1"W</span>
          </div>
          <div className="hero-index"><span>01</span><span className="index-rule"></span><span>03</span></div>
        </section>

        <section className="ticker" aria-label="Areas of interest">
          <span>THINGS I LIKE TO BUILD</span><b>✳</b><span>SOFTWARE SYSTEMS</span><b>✳</b><span>APPLIED AI</span><b>✳</b><span>IDEAS INTO PRODUCTS</span><b>✳</b><span>ALWAYS LEARNING</span>
        </section>

        <section className="about section" id="about">
          <div className="section-kicker"><span>01 / ABOUT</span><span>THE PERSON BEHIND THE PROJECTS</span></div>
          <div className="about-grid">
            <h2>Building things.<br /><em>Understanding</em> why.</h2>
            <div className="about-body">
              <p>I enjoy the space where thoughtful engineering meets curiosity: designing APIs, learning how distributed systems behave, and experimenting with machine learning.</p>
              <p>This site is a living notebook for the work I'm doing, the ideas I'm exploring, and the things I learn along the way. It will grow as I do.</p>
              <div className="about-note"><Sparkles size={17} /><span>Currently exploring: systems design, deep learning, and better ways to turn ideas into useful software.</span></div>
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="section-kicker"><span>02 / SELECTED WORK</span><span>A FEW THINGS I'VE BUILT</span></div>
          <div className="work-heading">
            <h2>Proof of <em>curiosity.</em></h2>
            <p>A starting collection, not a finished catalogue.<br />More projects and write-ups coming soon.</p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.number}>
                <span className="project-number">{project.number}</span>
                <div className="project-main">
                  <span className="project-type">{project.type}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
                <a className="project-arrow" href={project.href} target="_blank" rel="noreferrer" aria-label={`Find ${project.title} on GitHub`}><ArrowUpRight size={21} /></a>
              </article>
            ))}
          </div>
          <p className="project-footnote">Project links are placeholders for now — they can be connected to the actual repositories before launch.</p>
        </section>

        <section className="contact section" id="contact">
          <div className="section-kicker"><span>03 / SAY HELLO</span><span>OPEN TO GOOD CONVERSATIONS</span></div>
          <div className="contact-grid">
            <h2>Have an idea?<br /><em>Let's talk.</em></h2>
            <div className="contact-side">
              <p>I'm always interested in thoughtful people, interesting problems, and ideas worth exploring.</p>
              <a className="button button-light" href="mailto:hello@jaydengmckenna.com">Get in touch <ArrowUpRight size={16} /></a>
              <div className="social-links">
                <a href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>
                <a href="mailto:hello@jaydengmckenna.com"><Mail size={16} /> Email <ArrowUpRight size={13} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="wordmark footer-mark" href="#home">J<span>.</span>GM</a>
        <span>Made with curiosity, in Dallas, TX.</span>
        <a href="#home">BACK TO TOP ↑</a>
        <span className="copyright">© {new Date().getFullYear()} JAYDEN G. MCKENNA</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);