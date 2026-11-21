import { BookIcon, FolderKanbanIcon, GraduationIcon } from "./Icons";

// src/components/ProductCards.tsx — TUNED from Bayo's ClassCard, EbookCard,
// ProjectCard and SourceCodeCard.
// What changed from Bayo:
// - REMOVED: API data, priceView rails, enrolment counts from a backend,
//   checkout modal wiring, external checkout URLs. Cards are presentational.
// - KEPT: the card shapes — course cover + chips + price row, 3D book stage,
//   project media + tags + link, ZIP file row + size + tags.
// - Every card takes its content as props. No title, price, project or
//   class is invented here. Pass "Coming soon" content until you have a
//   real item, exactly like your current preview cards do.

export type Project = {
  title: string;
  description: string;
  tags?: string[];
  liveUrl?: string;
  imageUrl?: string;
};

export function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <div className="project-media">
        {project.imageUrl ? (
          <img
            className="project-img"
            src={project.imageUrl}
            alt={`${project.title} preview`}
            loading="lazy"
          />
        ) : (
          <div className="project-chip">
            <FolderKanbanIcon className="project-chip-icon" />
          </div>
        )}
      </div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        {project.liveUrl && (
          <span className="project-link">View project</span>
        )}
      </div>
    </>
  );

  if (project.liveUrl) {
    return (
      <a
        className="project-card"
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }
  return <div className="project-card is-static">{body}</div>;
}

export type Ebook = {
  title: string;
  author?: string;
  readers?: number;
  priceLabel: string;
  imageUrl?: string;
  buttonLabel?: string;
  onSelect?: () => void;
};

export function EbookCard({ item }: { item: Ebook }) {
  return (
    <div className="book-card">
      <div className="book-stage" aria-hidden="true">
        <div className="book">
          <div className="book-front">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" loading="lazy" />
            ) : (
              <span className="book-plain">
                <BookIcon className="book-plain-icon" />
                <strong>{item.title}</strong>
                {item.author && <em>{item.author}</em>}
              </span>
            )}
          </div>
          <div className="book-pages" />
          <div className="book-back" />
        </div>
      </div>
      <div className="book-body">
        <h3>{item.title}</h3>
        {item.author && <span className="book-author">by {item.author}</span>}
        {typeof item.readers === "number" && item.readers > 0 && (
          <div className="book-chips">
            <span className="book-chip">
              {item.readers.toLocaleString("en-NG")} readers
            </span>
          </div>
        )}
        <div className="book-foot">
          <span className="book-price">{item.priceLabel}</span>
          <button
            type="button"
            className="book-btn"
            onClick={item.onSelect}
            disabled={!item.onSelect}
          >
            {item.buttonLabel || "Get the e-book"}
          </button>
        </div>
      </div>
    </div>
  );
}

export type SourceCode = {
  title: string;
  description: string;
  zipName: string;
  zipSize?: string;
  tags?: string[];
  priceLabel: string;
  buttonLabel?: string;
  availabilityLabel?: string;
  onSelect?: () => void;
};

export function SourceCodeCard({ item }: { item: SourceCode }) {
  return (
    <div className="list-card zip-card">
      <div className="zip-file">
        <span className="zip-icon">
          <svg className="zip-icon-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M10 3v2M10 7v2M10 11v2M10 15v2M8.5 19h3" />
          </svg>
        </span>
        <span className="zip-file-text">
          <span className="zip-name">{item.zipName}</span>
          <span className="zip-size">
            {item.availabilityLabel || (!item.onSelect ? "No file available yet" : `ZIP archive${item.zipSize ? ` · ${item.zipSize}` : ""}`)}
          </span>
        </span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="zip-tags">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      <div className="zip-foot">
        <span className="zip-price">{item.priceLabel}</span>
        <button type="button" className="zip-cta" onClick={item.onSelect} disabled={!item.onSelect}>
          {item.buttonLabel || "Get the code"}
        </button>
      </div>
    </div>
  );
}

export type Course = {
  title: string;
  description?: string;
  level?: string;
  duration?: string;
  enrolled?: number;
  tags?: string[];
  priceLabel: string;
  buttonLabel?: string;
  onSelect?: () => void;
  imageUrl?: string;
};

export function ClassCard({ course }: { course: Course }) {
  return (
    <div className="course-card">
      <div className="course-cover">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={`${course.title} cover`}
            loading="lazy"
          />
        ) : (
          <span className="course-cover-blank" aria-hidden="true">
            <GraduationIcon className="course-cover-icon" />
          </span>
        )}
        <div className="course-cover-text">
          <h3>{course.title}</h3>
          <div className="course-chips">
            {course.level && (
              <span className="course-chip">{course.level}</span>
            )}
            {course.duration && (
              <span className="course-chip">{course.duration}</span>
            )}
            {typeof course.enrolled === "number" && course.enrolled > 0 && (
              <span className="course-chip">
                {course.enrolled.toLocaleString("en-NG")} enrolled
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="course-body">
        {course.description && <p>{course.description}</p>}
        {course.tags && course.tags.length > 0 && (
          <div className="course-tags">
            {course.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        <div className="course-foot">
          <span className="course-price">{course.priceLabel}</span>
          <button type="button" className="course-btn" onClick={course.onSelect}>
            {course.buttonLabel || "Enroll now"}
          </button>
        </div>
      </div>
    </div>
  );
}
