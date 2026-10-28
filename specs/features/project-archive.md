# Projects Archive Feature Specification

**Status:** Draft  
**Feature:** Projects Archive  
**Path:** `/projects`  
**Depends on:** `constitution/constitution.md`, `specs/product-spec.md`, `specs/design-system-spec.md`, `plans/roadmap.md`, `specs/features/homepage.md`

## 1. Purpose

The Projects Archive is the central place for visitors to discover and explore my technical work. It should present a broader picture of my capabilities and interests than the small selection of projects featured on the homepage.

The archive should make it easy to scan projects, identify relevant technologies and technical areas, narrow the collection, and navigate to detailed explanations of individual projects.

It must balance breadth and usability: visitors should be able to browse quickly without losing access to meaningful technical information.

## 2. Goals

The Projects Archive must:

- Present a coherent collection of personal, academic, research, and other appropriate technical projects.
- Make project titles, summaries, technologies, and relevant status information easy to scan.
- Allow visitors to find projects using search and, where useful, category or technology filters.
- Provide consistent navigation to individual project detail pages.
- Represent a range of technical interests rather than disproportionately emphasizing one area.
- Support an expanding collection without requiring a redesign.
- Share consistent project information with the homepage and Project Details pages.
- Work reliably across desktop, tablet, and mobile devices.

## 3. Intended Visitors

- **Recruiters and hiring managers:** Scan representative projects and identify relevant technical experience.
- **Developers and technical professionals:** Find projects involving specific technologies, architectures, or areas of computer science.
- **Academic contacts:** Explore coursework, research, and technically substantial projects.
- **General visitors:** Browse projects and understand what I have built without needing to understand every implementation detail.

The archive should support both quick scanning and deeper exploration.

## 4. Existing Implementation

The current Projects page already includes:

- A project archive at `/projects`.
- Four initial project entries: Canvas-Lite, Raft Key-Value Store, CUDA K-Means, and World Cup Outcome Predictor.
- Project cards with titles, descriptions, technology information, and abstract project artwork.
- Category-related presentation and technology labels.
- Links into project detail routes.
- A search input and category-filter controls that are currently disabled or marked as coming later.

The existing implementation should be audited before changes are planned. Reuse useful components and styling, and address incomplete behavior rather than automatically replacing the page.

The current project detail routes provide limited content, so archive links should be integrated with the Project Details feature as that feature is developed.

## 5. Core User Experience

A visitor should be able to:

1. Open the Projects Archive from the homepage or site navigation.
2. Understand the purpose of the archive.
3. Scan the available projects and their main technical characteristics.
4. Search for projects or narrow the collection when the collection supports it.
5. Open a project for a more detailed explanation.
6. Return to the archive and continue exploring.

The archive should remain useful even when visitors do not interact with search or filters.

## 6. Required Page Structure

### 6.1 Page Introduction

The archive must provide a clear heading and concise introduction.

Requirements:

- Communicate that the page contains a collection of projects.
- Establish what kinds of work visitors can expect to find.
- Avoid an unnecessarily long introductory biography.
- Keep the introduction visually subordinate to the project collection.
- Remain appropriate as the collection expands.

### 6.2 Project Collection

The main content is a collection of project summaries.

Each project entry should display, where applicable:

- Project title.
- Concise description of its purpose or problem.
- Primary technologies or technical concepts.
- Relevant category or area of work.
- Project status, if useful and accurately known.
- A clear path to its detail page.

Requirements:

- Use a consistent presentation pattern across projects.
- Make titles and navigation links clear and accessible.
- Ensure descriptions communicate meaningful differences between projects.
- Avoid filling cards with long technical explanations that belong on detail pages.
- Do not require visitors to understand a particular technology to understand a project's purpose.
- Avoid displaying unsupported claims, fabricated metrics, or misleading completion status.
- Ensure projects without a public repository can still be represented when appropriate.
- Handle projects with missing optional metadata gracefully.

The archive should prioritize the quality and clarity of project information rather than maximizing the number of cards visible at once.

### 6.3 Initial Project Inventory

The initial candidates already featured on the website are:

1. **Canvas-Lite** — a learning management backend.
2. **Raft Key-Value Store** — a distributed-systems project.
3. **CUDA K-Means** — a GPU-accelerated clustering implementation.
4. **World Cup Outcome Predictor** — a machine-learning prediction project.

These entries are the starting inventory, not necessarily the final complete archive.

Additional projects may be included after reviewing the existing resume, CV, repositories, and historical project materials. That research should establish which projects are worth featuring and what information can be verified about them.

The archive should reflect the breadth of my work, including relevant systems, backend, parallel computing, machine learning, and other technical projects where supported by the actual project inventory.

Do not create placeholder projects or invent details simply to make the archive appear more comprehensive.

### 6.4 Search

The archive should support text search if the feature can be implemented cleanly with the available project metadata.

Requirements:

- Visitors can enter a query to narrow the displayed collection.
- Search should match relevant project information, such as titles, descriptions, and technologies.
- Matching should be case-insensitive.
- Search should work alongside any active filters.
- Clearing the query restores the collection permitted by the remaining filters.
- The search control must have an accessible label and clear purpose.
- The displayed collection should update without requiring a full page reload.

Search should operate on the project information available to the archive. It does not need to search the full text of project reports or source code.

### 6.5 Category and Technology Filters

The archive may provide category filters, technology filters, or both, depending on the verified project inventory and the value they add to browsing.

Requirements:

- Available filters must correspond to meaningful project metadata.
- Visitors must be able to identify which filter is active.
- Search and filters should work together predictably.
- Visitors must have a straightforward way to clear filters and restore the full collection.
- The interface must not present categories that have no corresponding projects.
- Filter labels should be understandable without requiring specialized knowledge.
- Filtering must remain usable on narrow screens.

Category and technology filters serve different purposes:

- **Category:** Groups projects by a broad technical area, such as distributed systems, backend development, or machine learning.
- **Technology:** Matches specific tools or languages, such as Python, Rust, CUDA, or PostgreSQL.

These dimensions should not be combined into a confusing single list if separate controls make the archive easier to understand.

The final filter design should be based on the real inventory. If the collection is initially too small to justify multiple controls, the simpler approach should be preferred.

### 6.6 Results and Empty States

The archive must respond clearly to search and filter outcomes.

Requirements:

- Visitors should be able to tell when the collection has been narrowed.
- When no projects match, display a useful message.
- The empty state should explain that no projects match the current search or filters.
- Provide an easy way to clear the active search or filters.
- Avoid presenting a blank page as if it were a loading failure.
- If a result count is displayed, it must accurately reflect the visible collection.

A separate loading state is unnecessary if the archive uses local project data and renders synchronously.

## 7. Project Information and Shared Data

The archive, homepage, and Project Details pages must use a consistent representation of each project.

The shared project information should support the following fields where applicable:

| Field | Purpose |
|---|---|
| `slug` | Stable identifier used in project detail URLs |
| `title` | Display name of the project |
| `summary` | Concise archive and homepage description |
| `technologies` | Languages, frameworks, tools, and platforms used |
| `categories` | Broad technical areas associated with the project |
| `status` | Verified project status, if useful |
| `featured` | Indicates whether the project is eligible for homepage promotion |
| `repositoryUrl` | Public source repository, when available |
| `demoUrl` | Public working demonstration, when available |
| `image` or visual reference | Optional project-specific visual representation |

This is a conceptual field list, not a requirement to implement every field or use these exact property names.

Project Details may need additional information such as problem statements, architecture, implementation choices, results, limitations, and lessons learned. Those fields should be defined in the Project Details specification rather than forcing all details into the archive data structure prematurely.

Requirements:

- Project slugs must be unique and stable.
- Missing optional values must not create broken links or awkward empty labels.
- Public URLs must be verified before publication.
- Project summaries and technologies must be accurate.
- The homepage and archive must not maintain conflicting copies of project metadata.
- The content structure should make it straightforward to add projects in the future.

The implementation roadmap should determine the smallest maintainable data structure that supports the three core features.

## 8. Navigation and Routing

- The Projects Archive must be accessible from the site's primary navigation.
- Every project intended to have a detail page must link to the correct route.
- Project detail routes should use stable, readable slugs.
- Returning to the archive should remain straightforward.
- Invalid project slugs must be handled gracefully by the Project Details experience.
- External repository and demonstration links must lead to verified destinations.
- Internal navigation should use the site's established routing approach.

The archive should not implement a separate project-detail experience of its own. Individual project pages are governed by `specs/features/project-details.md`.

## 9. Visual and Responsive Requirements

The archive must follow `specs/design-system-spec.md`.

- Maintain visual consistency with the homepage and other internal pages.
- Make project titles, descriptions, technologies, and controls easy to distinguish.
- Use a layout that scales naturally with the number of projects.
- Ensure cards remain readable at desktop, tablet, and mobile widths.
- Avoid excessive card density or unnecessary decorative elements.
- Ensure search and filters do not dominate the page.
- Preserve the site's established typography and visual identity unless a documented design decision justifies a change.
- Ensure category labels and status indicators do not rely on color alone.
- Provide visible focus, hover, and active states where appropriate.

The archive should support an expanding project collection without relying on fixed positioning or a layout that only works for four entries.

## 10. Accessibility and Reliability

- Use semantic page structure and an appropriate heading hierarchy.
- Give search and filter controls accessible names.
- Ensure all project links and controls work with a keyboard.
- Make active filter states understandable to assistive technologies.
- Maintain sufficient text contrast and visible focus indicators.
- Avoid unnecessary motion or interactions that interfere with browsing.
- Ensure search and filters do not produce inconsistent or stale results.
- Ensure project links and route parameters are handled correctly.
- Avoid runtime errors when optional project fields are missing.
- Preserve compatibility with the existing React, TypeScript, Vite, and routing setup.
- Keep the production build passing.

## 11. Out of Scope

This specification does not independently define:

- Full technical narratives for individual projects.
- A backend or database for storing project entries.
- A content management system.
- Full-text search over source code or project documents.
- User accounts, comments, ratings, or other social features.
- Analytics-driven personalization or recommendations.
- A complex search engine requiring an external service.
- Research and documentation of every historical project.
- The design and behavior of the homepage or About page beyond their relationship to shared project data.

Historical project research is necessary for building a credible archive, but the research process and implementation tasks belong in the feature roadmap.

## 12. Acceptance Criteria

The Projects Archive is ready for completion review when:

- [ ] Visitors can navigate to the archive from the homepage or site navigation.
- [ ] The page clearly introduces the project collection.
- [ ] Each published project has an accurate title and concise summary.
- [ ] Relevant technologies and categories are displayed consistently.
- [ ] Every project intended to have a detail page links to the correct route.
- [ ] Search narrows projects using the supported metadata.
- [ ] Search is case-insensitive and works with active filters.
- [ ] Available filters use meaningful, verified project metadata.
- [ ] Visitors can clear search and filters to restore the appropriate collection.
- [ ] No-match results produce a helpful empty state.
- [ ] Missing optional metadata does not break the layout.
- [ ] Project information is consistent with the homepage and Project Details pages.
- [ ] All published external links have been verified.
- [ ] The layout works at representative desktop, tablet, and mobile widths.
- [ ] Keyboard navigation, focus states, and control labels are accessible.
- [ ] No known critical navigation, rendering, or runtime defects remain.
- [ ] The production build succeeds.

## 13. Open Decisions

Resolve these during specification review or implementation planning:

- What is the complete initial inventory of projects worth publishing?
- Which categories best represent the actual breadth of the work?
- Does the initial collection justify both category and technology filters?
- Should the archive display project status, and if so, which status labels are meaningful?
- Which projects should be featured on the homepage?
- What project metadata should be required versus optional?
- Should project visuals be unique to each project or follow the existing abstract visual style?
- How should projects with private repositories or incomplete historical documentation be presented?
- What is the simplest maintainable shared project data structure for the homepage, archive, and detail pages?

These decisions should be grounded in the real project inventory and the existing implementation.

## 14. Definition of Done

The Projects Archive feature is complete when its accepted requirements have been implemented and verified, published project information is accurate, navigation and browsing controls work as specified, responsive and accessibility checks have passed, and the production build succeeds.

Implementation phases, TODO checklists, research tasks, progress, blockers, decisions, and verification evidence belong in `plans/features/projects-archive-rm.md`.

## 15. Related Documents

- `constitution/constitution.md`
- `specs/product-spec.md`
- `specs/design-system-spec.md`
- `plans/roadmap.md`
- `specs/features/homepage.md`
- `specs/features/project-details.md`
- `plans/features/projects-archive-rm.md`
