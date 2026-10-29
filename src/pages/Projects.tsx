import { ProjectCard } from '../components/ProductCards'

/**
 * One honest card while there is nothing to list. No project name, stack or
 * live link is invented — replace this object when Ugo supplies a real project.
 */
const COMING_SOON_PROJECT = {
  title: 'Currently building',
  description:
    'A project is in progress right now. The details, stack and link will appear here once it is ready to show.',
}

function Projects() {
  return (
    <main>
      <section className="page-section" id="projects" data-reveal>
        <div className="section-head">
          <p className="section-label">MY WORK</p>
          <h2>
            Featured <span className="gold-text">projects</span>
          </h2>
          <p className="section-intro">
            A selection of the things I build. Nothing is listed here yet — the
            first project goes in as soon as it is ready to show.
          </p>
        </div>

        <div className="projects-grid">
          <ProjectCard project={COMING_SOON_PROJECT} />
        </div>
      </section>
    </main>
  )
}

export default Projects
