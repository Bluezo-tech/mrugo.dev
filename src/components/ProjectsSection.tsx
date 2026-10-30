import { CURRENT_PROJECT_TODO } from '../data/content'
import { FolderKanbanIcon } from './Icons'
import './ProjectsSection.css'

function ProjectsSection() {
  return (
    <section className="projects-section" id="projects" data-reveal>
      <div className="section-head">
        <p className="section-label">MY WORK</p>
        <h2>
          Featured <span className="gold-text">projects</span>
        </h2>
        <p className="section-intro">
          My first featured project will appear here when it's ready to share.
        </p>
      </div>

      <div className="projects-grid">
        <article className="project-card project-preview-card">
          <div className="project-media" aria-hidden="true">
            <div className="project-preview-art">
              <FolderKanbanIcon className="project-preview-icon" />
              <span>PROJECT PREVIEW</span>
            </div>
          </div>
          <div className="project-body">
            <p className="project-status">In progress</p>
            <h3>{CURRENT_PROJECT_TODO.title}</h3>
            <p className="project-copy">{CURRENT_PROJECT_TODO.body}</p>
            <p className="project-preview-note">Name, stack and link coming soon.</p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default ProjectsSection
