import { GraduationIcon } from './Icons'

function ClassesSection() {
  return (
    <section className="classes-section" id="classes" data-reveal>
      <div className="section-head">
        <p className="section-label">CLASSES</p>
        <h2>
          Teaching, <span className="gold-text">not scheduled yet</span>
        </h2>
        <p className="section-intro">
          I'm not running any classes at the moment. When I do, the dates and how
          to join will be listed here.
        </p>
      </div>

      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          <GraduationIcon />
        </span>
        <p className="empty-title">Nothing here yet</p>
        <p className="empty-copy">
          No classes are scheduled right now. Check back later, or get in touch
          if you'd like to talk about one.
        </p>
        <p className="todo-note">
          TODO: class name, date and format for the first class
        </p>
      </div>
    </section>
  )
}

export default ClassesSection
