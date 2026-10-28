# Projects Archive — Implementation Roadmap

**Status:** Ready to Begin  
**Feature:** Projects Archive  
**Specification:** `specs/features/projects-archive.md`  
**Route:** `/projects`  
**Priority:** High  
**Last Updated:** October 28, 2026

## 1. Purpose

This document is the living execution plan for completing the Projects Archive. It translates the feature specification into implementation phases, actionable tasks, acceptance criteria, and progress tracking.

The objective is to improve the archive's functionality while preserving the existing design. The current page already has a visual identity that should be retained; implementation should build on that foundation rather than introduce an unnecessary redesign.

This roadmap is the source of truth for implementation progress, outstanding work, decisions, research tasks, and blockers specific to the Projects Archive.

## 2. Guiding Decisions

- **Preserve the current design.** Retain the existing typography, colors, project-card presentation, spacing, and overall layout unless a specific change is necessary.
- **Complete existing functionality before adding complexity.** The disabled search and category-filter controls are existing gaps to address.
- **Establish shared project data.** The archive, homepage, and project detail pages should use consistent project metadata rather than maintain conflicting copies.
- **Research before inventing.** Verify project descriptions, technologies, results, status, and links using available source material.
- **Prefer the simplest maintainable solution.** No backend, database, CMS, or external search service is required for the initial archive.
- **Integrate with Project Details.** Archive links should work with the shared project records and the individual project pages.
- **Validate incrementally.** Build and test after meaningful implementation changes rather than leaving all verification until the end.

## 3. Current State

Based on the initial source-level repository audit:

- [x] React, TypeScript, Vite, and React Router are established.
- [x] A Projects Archive exists at `/projects`.
- [x] Four initial project entries are displayed.
- [x] Project cards include descriptions and technology information.
- [x] Category-related presentation exists.
- [x] Project detail routes are established.
- [ ] Search functionality is incomplete or disabled.
- [ ] Category-filter functionality is incomplete or disabled.
- [ ] The project inventory has not been fully verified.
- [ ] Project information is not yet established as a shared source of truth across all three core experiences.
- [ ] Individual project detail pages need substantive content.
- [ ] The full archive has not been validated against the feature acceptance criteria.

The repository should be rechecked before implementation to confirm these observations and identify any changes made since the initial audit.

## 4. Phase 1 — Audit and Establish the Baseline

**Goal:** Understand the existing archive and protect the current design before changing functionality.

### Tasks

- [ ] Review the current Projects Archive component and its associated styles.
- [ ] Identify the existing project-card markup, layout rules, and responsive behavior.
- [ ] Locate the current project metadata and determine how it is represented.
- [ ] Identify the disabled search and filter controls and how they are currently wired.
- [ ] Review how project detail links and slugs are constructed.
- [ ] Identify existing reusable components and styles that should be preserved.
- [ ] Inspect the current navigation behavior on desktop and mobile.
- [ ] Run the existing production build and record any pre-existing failures.
- [ ] Capture or otherwise document the current appearance at representative desktop and mobile widths.
- [ ] Identify any known defects without expanding the scope into unrelated page redesigns.

### Acceptance Criteria

- [ ] The current archive structure and project-card styling are understood.
- [ ] The existing project data source is identified.
- [ ] The incomplete controls and their intended behavior are understood.
- [ ] Existing routes and navigation are understood.
- [ ] The current visual design has a documented baseline.
- [ ] Existing build issues are distinguished from regressions introduced later.

**Completion rule:** Do not begin substantial visual or structural changes until the baseline has been reviewed.

## 5. Phase 2 — Research and Verify the Project Inventory

**Goal:** Establish which projects belong in the archive and what can be accurately said about them.

### Initial Project Inventory

The four existing entries are the starting point:

- [ ] Canvas-Lite
- [ ] Raft Key-Value Store
- [ ] CUDA K-Means
- [ ] World Cup Outcome Predictor

These are not necessarily the final complete inventory.

### Research Tasks

- [ ] Review the current life resume and graduate-school CV for additional relevant projects.
- [ ] Review available repositories and project documentation.
- [ ] Identify projects that meaningfully demonstrate different areas of technical work.
- [ ] Verify project titles and concise summaries.
- [ ] Verify technologies actually used in each project.
- [ ] Confirm repository links and whether each repository is intended to be public.
- [ ] Identify working demonstrations, if any.
- [ ] Verify completion status where status is useful to display.
- [ ] Identify defensible performance metrics or other results without inventing missing evidence.
- [ ] Record missing information that requires additional investigation.
- [ ] Identify projects that should remain unpublished because of confidentiality, ownership, or other restrictions.
- [ ] Select the initial set of projects to publish.

### Research Guidelines

The archive should represent the breadth of the actual work, potentially including:

- Backend and full-stack development.
- Distributed systems.
- Parallel and GPU computing.
- Machine learning and data science.
- Other technically meaningful projects supported by the project inventory.

Do not add projects solely to make the archive longer. Each entry should contribute useful information about the work and skills represented.

Detailed historical research can continue during later phases. Missing optional details should not block the entire archive if a project can be presented accurately without them.

### Acceptance Criteria

- [ ] An initial publication-ready project inventory exists.
- [ ] Every selected project has a verified title and concise summary.
- [ ] Technologies and public links are verified to the extent possible.
- [ ] Missing or uncertain details are documented rather than fabricated.
- [ ] The initial category and technology vocabulary can be derived from actual projects.
- [ ] The inventory is sufficient to make a reasoned decision about search and filtering.

## 6. Phase 3 — Define and Implement Shared Project Data

**Goal:** Establish a maintainable project representation that can support the archive, homepage, and Project Details pages.

### Design Decisions

- [ ] Review how project information is currently stored.
- [ ] Determine the smallest data structure that supports the three core features.
- [ ] Establish stable, unique project slugs.
- [ ] Define required versus optional metadata.
- [ ] Define how categories and technologies are represented.
- [ ] Determine how project-specific detailed content will connect to shared metadata.
- [ ] Decide how missing optional fields should be handled.
- [ ] Avoid introducing dependencies or abstractions that are not needed.

### Proposed Shared Metadata

The data model should support these fields where applicable:

- `slug`
- `title`
- `summary`
- `technologies`
- `categories`
- `status`
- `featured`
- `repositoryUrl`
- `demoUrl`
- Optional project visual

This is a proposed conceptual model, not a requirement to use these exact property names. The final structure should follow the repository's existing conventions where sensible.

Detailed technical narratives may be represented separately from the compact metadata used by the archive and homepage, provided they remain linked consistently by project identity.

### Implementation Tasks

- [ ] Implement or refactor the shared project records.
- [ ] Define appropriate TypeScript types for project metadata.
- [ ] Populate the initial records using verified information.
- [ ] Ensure slugs are unique and stable.
- [ ] Handle optional properties without rendering empty labels or broken controls.
- [ ] Refactor the archive to render its project cards from the shared records.
- [ ] Preserve the existing card design during the refactor.
- [ ] Ensure the project collection can grow without requiring new card-specific markup for each project.

### Acceptance Criteria

- [ ] The archive renders from a consistent project data source.
- [ ] Project metadata has appropriate TypeScript types.
- [ ] No duplicate slugs exist.
- [ ] Missing optional data does not break rendering.
- [ ] Existing project cards retain their established appearance.
- [ ] The data structure can support the homepage and detail pages without conflicting copies of shared metadata.
- [ ] The production build succeeds.

## 7. Phase 4 — Implement Search

**Goal:** Make the existing search control functional without disrupting the current layout.

### Tasks

- [ ] Define which project fields should be searchable.
- [ ] Implement case-insensitive matching.
- [ ] Search project titles, summaries, and technologies.
- [ ] Decide whether category names should also match search queries.
- [ ] Connect the search input to the displayed project collection.
- [ ] Ensure results update without a full page reload.
- [ ] Ensure clearing the search restores the collection permitted by active filters.
- [ ] Provide a clear and accessible label for the search control.
- [ ] Provide a useful empty state when no projects match.
- [ ] Preserve the existing visual treatment of the search field.
- [ ] Verify keyboard interaction and narrow-screen behavior.

### Acceptance Criteria

- [ ] Searching for a project title returns relevant projects.
- [ ] Searching for a technology returns projects associated with it.
- [ ] Search is case-insensitive.
- [ ] Partial queries work as expected.
- [ ] Search and category filters work together.
- [ ] Clearing the query restores the appropriate collection.
- [ ] No-match searches produce a helpful message and recovery path.
- [ ] Search works without a backend or external service.
- [ ] The existing design remains visually consistent.

## 8. Phase 5 — Implement Category Filters

**Goal:** Complete the existing category-filter interface using meaningful categories derived from the project inventory.

### Tasks

- [ ] Review the actual project categories and consolidate inconsistent labels.
- [ ] Determine whether the existing category controls can be reused.
- [ ] Implement filtering against project category metadata.
- [ ] Make the active category visually apparent.
- [ ] Define whether the interface supports one active category or multiple simultaneous categories.
- [ ] Ensure category filtering composes correctly with search.
- [ ] Provide a straightforward way to return to all categories.
- [ ] Ensure the interface does not display categories without matching projects.
- [ ] Provide accessible control names and states.
- [ ] Preserve the current filter-control styling wherever possible.

### Decision: Single or Multiple Categories

Start with the simplest behavior that fits the existing interface. A single active category is sufficient unless the design or project inventory establishes a clear need for multi-select filtering.

Do not add complex filter interactions merely for technical sophistication.

### Acceptance Criteria

- [ ] Selecting a category displays the appropriate projects.
- [ ] The active category is visually clear.
- [ ] Search and category filters compose correctly.
- [ ] Clearing the category restores all projects permitted by the search query.
- [ ] Every displayed category corresponds to available project data.
- [ ] Empty results are handled gracefully.
- [ ] The existing layout and interaction style are preserved.

## 9. Phase 6 — Evaluate Technology Filters and Results Information

**Goal:** Decide whether additional controls improve the archive enough to justify their complexity.

This phase is deliberately conditional. The specification permits technology filters but does not require them if the collection is too small or the interface would become unnecessarily complicated.

### Tasks

- [ ] Evaluate the size and diversity of the verified project inventory.
- [ ] Determine whether technology filtering adds meaningful value beyond search.
- [ ] Review whether a result count would help visitors understand the current collection.
- [ ] Assess whether displaying project status improves browsing.
- [ ] Confirm that additional controls can fit the existing design on mobile.
- [ ] Document the decision to implement or defer each optional capability.

### If Technology Filters Are Justified

- [ ] Implement technology filtering using the shared metadata.
- [ ] Define how technology filtering interacts with category filters and search.
- [ ] Make active technology selections visible.
- [ ] Provide a clear way to remove selections.
- [ ] Validate the behavior against projects with multiple technologies.

### Acceptance Criteria

- [ ] The technology-filter decision is documented.
- [ ] Any implemented technology filter works correctly with search and categories.
- [ ] Any displayed result count is accurate.
- [ ] Any displayed status is verified and consistently represented.
- [ ] No unnecessary complexity has been added solely to increase feature count.

## 10. Phase 7 — Integrate with Project Details and Homepage

**Goal:** Ensure the archive is part of a coherent three-page project experience.

This phase may overlap with implementation of the Project Details and Homepage roadmaps.

### Tasks

- [ ] Coordinate shared metadata and slug conventions with `plans/features/project-details-rm.md`.
- [ ] Ensure every published project intended to have a detail page resolves to the correct route.
- [ ] Ensure project detail pages use the same titles and shared metadata as the archive.
- [ ] Coordinate featured-project selection with `plans/features/homepage-rm.md`.
- [ ] Ensure homepage project summaries do not contradict archive summaries.
- [ ] Verify navigation from the homepage to the archive.
- [ ] Verify navigation from the archive to project details.
- [ ] Verify the return path from detail pages to the archive.
- [ ] Handle unknown project slugs through the Project Details feature's not-found behavior.

### Acceptance Criteria

- [ ] Shared project metadata is consistent across all three experiences.
- [ ] All intended archive-to-detail links work.
- [ ] Homepage featured projects correspond to valid shared project records.
- [ ] The archive does not maintain conflicting duplicate project descriptions.
- [ ] Navigation between the three experiences is reliable.

## 11. Phase 8 — Responsive, Accessibility, and Regression Validation

**Goal:** Verify that functional improvements preserve the existing visual quality and usability.

### Tasks

- [ ] Compare the updated archive against the original visual baseline.
- [ ] Verify desktop layout and project-card spacing.
- [ ] Verify tablet and mobile layouts.
- [ ] Check long project titles and descriptions.
- [ ] Check project entries with missing optional metadata.
- [ ] Verify keyboard navigation through search, filters, and project links.
- [ ] Verify visible focus states and accessible control names.
- [ ] Verify active filter states are communicated accessibly.
- [ ] Verify the empty state at narrow viewport widths.
- [ ] Verify internal and external links.
- [ ] Run the production build.
- [ ] Fix regressions introduced by the archive implementation.
- [ ] Record any unrelated pre-existing defects separately rather than expanding the scope.

### Acceptance Criteria

- [ ] The archive remains visually consistent with the approved baseline.
- [ ] No critical layout defects occur at representative viewport widths.
- [ ] Search, filters, and navigation are keyboard accessible.
- [ ] Empty and filtered states remain usable.
- [ ] No known critical rendering or runtime regressions remain.
- [ ] The production build succeeds.

## 12. Phase 9 — Final Acceptance Review

**Goal:** Confirm that the completed archive meets its feature specification.

### Final Checklist

- [ ] Project inventory reviewed and published entries verified.
- [ ] Shared project data implemented.
- [ ] Project cards render consistently.
- [ ] Search works as specified.
- [ ] Category filters work as specified.
- [ ] Optional technology filters evaluated and implemented or deliberately deferred.
- [ ] Empty states and clearing controls work.
- [ ] Navigation to and from project detail pages works.
- [ ] Homepage and archive use consistent shared metadata.
- [ ] Existing visual identity is preserved.
- [ ] Responsive and accessibility checks completed.
- [ ] Production build passes.
- [ ] Remaining noncritical limitations documented.

**Completion rule:** The archive is complete when its accepted requirements are verified, not merely when the page renders or the build passes.

## 13. Dependencies and Coordination

| Dependency | Relationship |
|---|---|
| `specs/features/projects-archive.md` | Defines expected behavior and acceptance criteria |
| `specs/features/project-details.md` | Defines the destination and content structure for project links |
| `specs/features/homepage.md` | Shares featured-project metadata and navigation |
| Shared project data | Connects all three experiences |
| Project inventory research | Establishes accurate initial content and useful filters |
| `specs/design-system-spec.md` | Guides styling and interaction consistency |
| `plans/roadmap.md` | Establishes overall scope and delivery sequence |

The archive should not wait for every historical project to be fully researched before implementation begins. Establish the data foundation with the verified initial inventory, then expand it as additional research is completed.

## 14. Decisions and Blockers Log

### Confirmed Decisions

- Preserve the current archive design and visual identity.
- Improve functionality without treating the work as a redesign.
- Use a shared project data source across the Homepage, Projects Archive, and Project Details pages.
- Begin with the existing project inventory and expand it through research.
- Keep the initial implementation local and maintainable; no backend or CMS is required.
- Evaluate technology filters based on actual need rather than assuming they must be implemented.

### Open Decisions

- [ ] Final initial project inventory.
- [ ] Final category taxonomy.
- [ ] Single-select versus multi-select category behavior.
- [ ] Whether technology filters are worthwhile for the initial collection.
- [ ] Which project fields should be required versus optional.
- [ ] Exact implementation of shared project data and detailed project content.

### Blockers

None currently identified that prevent Phase 1 from beginning.

Record new blockers here with the affected phase and the decision or action required to resolve them.

## 15. Progress Tracking

Update this section as work proceeds.

| Phase | Status |
|---|---|
| 1. Audit and establish baseline | Not started |
| 2. Research and verify inventory | Not started |
| 3. Shared project data | Not started |
| 4. Search | Not started |
| 5. Category filters | Not started |
| 6. Technology filters and results information | Not started |
| 7. Integration with homepage and details | Not started |
| 8. Responsive, accessibility, and regression validation | Not started |
| 9. Final acceptance review | Not started |

Use the following status values consistently: **Not started**, **In progress**, **Blocked**, and **Complete**.

Update task checkboxes, phase statuses, decisions, and blockers directly in this document. Do not create a separate progress tracker.

## 16. Maintenance Rules

- Update this roadmap when implementation reveals a necessary change in approach.
- Keep tasks concrete, actionable, and testable.
- Add research findings to the relevant tasks or project records.
- Record important deviations from the feature specification.
- Do not mark a phase complete until its acceptance criteria have been checked.
- Preserve the original design unless an intentional, justified change is approved.
- Keep unrelated work out of this roadmap.
- Update the feature specification if a product requirement changes, rather than silently changing the expected behavior through implementation.

