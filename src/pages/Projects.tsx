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
          <p className="section-label">INDEPENDENT WORK</p>
          <h1>
            Projects &amp; <span className="gold-text">samples</span>
          </h1>
          <p className="section-intro">
            This space is for independent projects and sample work. None is published here yet. For verified work with organizations, see the Experience page.
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
