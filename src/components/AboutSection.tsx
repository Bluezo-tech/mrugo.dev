import { STATS } from '../data/content'

function AboutSection() {
  return (
    <section className="about-section" id="about" data-reveal>
      <p className="section-label">A LITTLE ABOUT ME</p>
      <h2>Technology, creativity, and building things that matter.</h2>

      <p className="about-copy">
        I'm a software developer and technology enthusiast with experience in web
        development, digital content creation, technical support, and platform
        operations. I enjoy building digital solutions, solving problems, and
        turning ideas into practical experiences through technology and
        creativity.
      </p>

      <div className="stats-row">
        {STATS.map((stat) => (
          <div
            className={stat.todo ? 'stat-card is-todo' : 'stat-card'}
            key={stat.id}
          >
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutSection
