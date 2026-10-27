
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Experience from './pages/Experience'
import SkillsSection from './components/SkillsSection'
import { SKILLS } from './data/skills'
import './App.css'
import profilePhoto from './assets/images/ugo-profile.jpeg'

function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Mr Ugo home">
          Mr Ugo
        </a>

        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="/experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="greeting">HELLO, I'M UGO</p>

          <h1>
            I build practical <span>digital experiences.</span>
          </h1>

          <p className="hero-description">
            I'm a software developer passionate about web development,
            programming, and building digital projects that solve
            real-world problems. I combine technical skills, creative
            thinking, and continuous learning to create practical,
            user-focused digital experiences.
          </p>

          <div className="hero-actions">
            <a className="contact-button" href="/experience">
              View My Experience <span aria-hidden="true">→</span>
            </a>
            <a className="hero-secondary-button" href="#contact">
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="avatar">
            <div className="avatar-disc" aria-hidden="true" />
            <div className="avatar-ring" aria-hidden="true" />
            <img
              className="avatar-image"
              src={profilePhoto}
              alt="Portrait of Ugochukwu"
            />
          </div>
          <div className="hero-badge">
            <span>Hello, I'm Ugo.</span>
          </div>
        </div>
      </section>

      <section className="tech-stripe" aria-label="Technologies I work with">
        <div className="tech-track">
          {[0, 1].map((copy) => (
            <div
              className="tech-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {SKILLS.map((skill) => (
                <span className="tech-item" key={skill.name}>
                  {skill.icon ? (
                    <img
                      className="tech-logo"
                      src={`https://cdn.simpleicons.org/${skill.icon.slug}/${skill.icon.onDark}`}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span className="tech-symbol" aria-hidden="true">
                      {skill.symbol}
                    </span>
                  )}
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <p className="section-label">A LITTLE ABOUT ME</p>
        <h2>Technology, creativity, and building things that matter.</h2>
        <p>
          I'm a software developer and technology enthusiast with
          experience in web development, digital content creation,
          technical support, and platform operations. I enjoy building
          digital solutions, solving problems, and turning ideas into
          practical experiences through technology and creativity.
        </p>
      </section>

      <SkillsSection />

      <footer id="contact">
        <p className="section-label">HAVE A PROJECT IN MIND?</p>
        <h2>Let's connect.</h2>
        <p className="footer-description">
          Have an idea, a project, or an opportunity to discuss?
          I'd love to hear from you.
        </p>
        <div className="footer-links">
          <a href="mailto:bluezotech@gmail.com">
            Get in touch via email ↗
          </a>
          <a
            href="https://wa.me/2349042715057"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Bluezo Tech on WhatsApp ↗
          </a>
        </div>
        <p className="footer-note">
          © {new Date().getFullYear()} Ugochukwu
        </p>
      </footer>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
