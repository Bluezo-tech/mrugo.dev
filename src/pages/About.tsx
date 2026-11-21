import { Link } from 'react-router-dom'
import SkillsSection from '../components/SkillsSection'
import profilePhoto from '../assets/images/ugo-profile.jpeg'
import { BriefcaseIcon, UserCheckIcon } from '../components/Icons'

export default function About() {
  return <main className="about-page">
    <section className="page-section about-page-intro">
      <div className="about-page-photo">
        <div className="avatar about-page-portrait">
          <div className="avatar-disc" aria-hidden="true" />
          <div className="avatar-ring" aria-hidden="true" />
          <img className="avatar-image" src={profilePhoto} alt="Portrait of Ugochukwu" />
        </div>
        <p className="hero-bubble">Hello, I’m Ugo.</p>
      </div>
      <div className="about-page-copy">
        <p className="section-label">ABOUT ME</p>
        <h1>Full-stack development <span>for real problems.</span></h1>
        <p>I’m Chukwuekem Melchizedek, also known as Mr Ugo. I build web applications and digital tools, from interfaces to APIs and databases. I also work with organizations on digital content and social media.</p>
        <div className="hero-actions about-page-actions">
          <Link className="contact-button" to="/experience"><BriefcaseIcon className="button-icon" /><span>Explore My Work</span></Link>
          <Link className="hero-secondary-button" to="/hire"><UserCheckIcon className="button-icon" /><span>Hire Me</span></Link>
        </div>
      </div>
    </section>
    <SkillsSection />
  </main>
}
