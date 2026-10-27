
import '../App.css'

function Experience() {
  return (
    <main className="experience-section">
      <p className="section-label">MY PROFESSIONAL JOURNEY</p>
      <h2>Experience</h2>

      <article className="experience-item">
        <div className="experience-details">
          <h3>Somtico Technologies Inc.</h3>
          <p>Junior Web Developer — Independent Contractor</p>
        </div>
        <span className="experience-arrow" aria-hidden="true">↗</span>
      </article>

      <article className="experience-item">
        <div className="experience-details">
          <h3>Stem Lantern</h3>
          <p>Social Media Manager &amp; Content Creator</p>
        </div>
        <span className="experience-arrow" aria-hidden="true">↗</span>
      </article>

      <article className="experience-item">
        <div className="experience-details bluezo-experience">
          <p>Bluezo Tech</p>
          <p>Founder and Lead Developer</p>
        </div>
        <span className="experience-arrow" aria-hidden="true">↗</span>
      </article>
    </main>
  )
}

export default Experience
