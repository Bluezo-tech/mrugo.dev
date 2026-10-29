import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import SourceCode from './pages/SourceCode'
import Ebooks from './pages/Ebooks'
import Layout from './components/Layout'
import AboutSection from './components/AboutSection'
import SkillsSection from './components/SkillsSection'
import ProjectsSection from './components/ProjectsSection'
import PreviewSection from './components/PreviewSection'
import ClassesSection from './components/ClassesSection'
import SocialsSection from './components/SocialsSection'
import ContactSection from './components/ContactSection'
import SupportSection from './components/SupportSection'
import { SKILLS } from './data/skills'
import { BriefcaseIcon, EnvelopeIcon, BookIcon, TerminalIcon } from './components/Icons'
import './App.css'
import profilePhoto from './assets/images/ugo-profile.jpeg'

const SOURCE_CODE_CARDS = [
  { title: 'Project package', note: 'TODO: package name and what it contains' },
  { title: 'Download', note: 'TODO: where it will be available' },
  { title: 'More to come', note: 'TODO: price, only if you decide to sell' },
]

const EBOOK_CARDS = [
  { title: 'First guide', note: 'TODO: title and topic' },
  { title: 'Reading format', note: 'TODO: PDF, web, or both' },
  { title: 'More to come', note: 'TODO: price, only if you decide to sell' },
]

function Home() {
  return (
    <main>
      <section className="hero-section" id="home">
        <h1>
          I build practical <span>digital experiences.</span>
        </h1>

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

          <p className="hero-bubble">Hello, I'm Ugo.</p>
        </div>

        <p className="hero-description">
          I'm a software developer passionate about web development,
          programming, and building digital projects that solve
          real-world problems. I combine technical skills, creative
          thinking, and continuous learning to create practical,
          user-focused digital experiences.
        </p>

        <div className="hero-actions">
          <Link className="contact-button" to="/experience">
            <BriefcaseIcon className="button-icon" />
            <span>View My Experience</span>
          </Link>
          <Link className="hero-secondary-button" to="/contact">
            <EnvelopeIcon className="button-icon" />
            <span>Get in touch</span>
          </Link>
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

      <AboutSection />
      <SkillsSection />
      <ProjectsSection />

      <PreviewSection
        id="source-code"
        eyebrow="SOURCE CODE"
        headingBefore="Code drops,"
        headingGold="coming soon"
        subline="Once a project is finished and documented, the full code will be shared here. Nothing is available to download yet."
        cards={SOURCE_CODE_CARDS}
        Icon={TerminalIcon}
      />

      <PreviewSection
        id="ebooks"
        eyebrow="E-BOOKS"
        headingBefore="Guides,"
        headingGold="coming soon"
        subline="Practical write-ups from the things I build. No books are published yet."
        cards={EBOOK_CARDS}
        Icon={BookIcon}
      />

      <ClassesSection />
      <SocialsSection />
      <ContactSection />
      <SupportSection />
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/skills" element={<SkillsSection />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/source-code" element={<SourceCode />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/classes" element={<ClassesSection />} />
          <Route path="/socials" element={<SocialsSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/support" element={<SupportSection />} />
          <Route
            path="/hire"
            element={
              <section className="experience-section">
                <h2>Hire Me</h2>
                <p>Full hire form coming soon — for now, reach me through the Contact page.</p>
              </section>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
