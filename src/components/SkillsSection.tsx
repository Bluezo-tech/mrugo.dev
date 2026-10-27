import { SKILL_GROUPS } from '../data/skills'

function SkillsSection() {
  return (
    <section className="skills-section" id="skills">
      <p className="section-label">WHAT I WORK WITH</p>
      <h2>Skills and tools I build with.</h2>
      <p className="skills-intro">
        The technologies I use and keep working with, grouped by where they sit in a
        project.
      </p>

      <div className="skills-grid">
        {SKILL_GROUPS.map((group) => (
          <article className="skills-card" key={group.title} data-reveal>
            <h3>{group.title}</h3>

            <ul className="skills-list">
              {group.skills.map((skill) => (
                <li className="skills-item" key={skill.name}>
                  {skill.icon ? (
                    <img
                      className="skills-icon"
                      src={`https://cdn.simpleicons.org/${skill.icon.slug}/${skill.icon.onLight}`}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span className="skills-symbol" aria-hidden="true">
                      {skill.symbol}
                    </span>
                  )}
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
