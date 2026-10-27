import { CURRENT_PROJECT_TODO } from '../data/content'

function ProjectsSection() {
  return (
    <section className="projects-section" id="projects" data-reveal>
      <div className="section-head">
        <p className="section-label">MY WORK</p>
        <h2>
          Featured <span className="gold-text">projects</span>
        </h2>
        <p className="section-intro">
          A place for the things I build. Nothing is listed here yet — the first
          project goes in as soon as it is ready to show.
        </p>
      </div>

      <div className="projects-grid">
        <article className="project-card">
          <div className="project-media is-todo" aria-hidden="true">
            <span>TODO</span>
          </div>

          <div className="project-body">
            <p className="project-status">In progress</p>
            <h3>{CURRENT_PROJECT_TODO.title}</h3>
            <p className="project-copy">{CURRENT_PROJECT_TODO.body}</p>

            <ul className="project-tags" aria-label="Technologies">
              <li>TODO</li>
              <li>TODO</li>
            </ul>

            <p className="todo-note">{CURRENT_PROJECT_TODO.todo}</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default ProjectsSection
