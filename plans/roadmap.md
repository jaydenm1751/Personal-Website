# Personal Website — Roadmap

**Status:** Draft  
**Scope:** High-level product development and delivery  
**Related Documents:** `constitution/constitution.md`, `specs/product-spec.md`, `specs/design-system-spec.md`

---

## 1. Purpose

This roadmap defines the broad phases for developing the personal website from its current implementation into the intended MVP and establishing a foundation for future expansion.

It describes what needs to happen, in what general order, and how the phases depend on one another.

This is an overview, not a detailed task list. Each major feature will have its own specification and living implementation roadmap containing phased tasks, TODOs, acceptance criteria, progress, and relevant decisions.

The roadmap should evolve as implementation reveals new requirements or changes the best sequence of work.

---

## 2. Current State

The repository already contains a working foundation built with React, TypeScript, Vite, and React Router.

Existing functionality includes a homepage, an About page, a projects archive with four project entries, basic project detail routes, modular stylesheets, and a build workflow.

The current implementation is an early foundation rather than a completed MVP. Some visible controls are not functional, project detail pages lack substantive content, and launch-critical details require verification.

Development should build on the existing application where practical rather than replacing working functionality without justification.

---

## 3. Development Phases

### Phase 1 — Establish Requirements and Baseline

**Objective:** Establish a shared understanding of the intended product, the current implementation, and the work required to reach the MVP.

**Major activities:**
- Finalize the constitution, product spec, and design-system spec.
- Audit the current implementation against the intended product.
- Identify existing functionality to retain, improve, or replace.
- Identify unresolved content, design, and technical decisions.
- Define the dependent feature specs and implementation roadmaps.

**Completion criteria:**
- The core product direction and MVP boundaries are documented.
- Existing functionality and known gaps are understood well enough to plan the next phase.
- Major feature dependencies and unresolved decisions are recorded.

### Phase 2 — Define Feature Requirements and Design Direction

**Objective:** Translate the product vision into testable requirements and a coherent design direction.

**Major activities:**
- Define the homepage requirements.
- Define the projects archive requirements.
- Define the project detail requirements.
- Define the About requirements.
- Define resume and contact requirements.
- Establish the shared design system using representative content from the actual site.
- Create or refine a living roadmap for each feature.

**Completion criteria:**
- Each MVP feature has a specification and acceptance criteria.
- Each feature has an actionable implementation roadmap.
- Shared design decisions are sufficiently clear to guide implementation.
- Cross-feature dependencies are reflected in the overall roadmap.

### Phase 3 — Refine the Shared Foundation

**Objective:** Establish the shared application and design foundations needed for a consistent MVP.

**Major activities:**
- Refine shared typography, color, spacing, and layout conventions.
- Establish reusable interface patterns where appropriate.
- Ensure navigation and page structure work consistently.
- Address foundational accessibility, responsiveness, and application-structure issues.
- Preserve useful existing functionality while resolving identified defects.

**Completion criteria:**
- Shared design conventions are implemented consistently.
- The application foundation supports the planned feature work.
- Foundational navigation and responsive behavior are verified.

### Phase 4 — Complete the Core Website Experiences

**Objective:** Turn the existing pages into a cohesive, content-rich personal website.

**Major activities:**
- Complete the homepage's introduction and pathways into the rest of the site.
- Build out the projects archive and its discovery experience.
- Develop substantive project detail pages.
- Refine the About experience.
- Complete resume, professional-profile, and contact access.
- Integrate features into a consistent end-to-end browsing experience.

**Completion criteria:**
- All MVP experiences are implemented to their feature acceptance criteria.
- Visitors can move naturally between the homepage, archive, project details, and background.
- Project descriptions and links have been verified to the extent supported by available evidence.
- No important visible control is presented as functional when it is not.

### Phase 5 — Validate and Prepare for Launch

**Objective:** Verify the website as a complete product and prepare it for public use.

**Major activities:**
- Validate functionality against feature acceptance criteria.
- Test desktop and mobile layouts.
- Review keyboard accessibility, semantic structure, contrast, and interaction states.
- Verify project information, external links, resume availability, and contact behavior.
- Check build reliability, loading behavior, and deployment configuration.
- Review public content for accuracy and confidentiality.
- Resolve launch-blocking defects.

**Completion criteria:**
- The production build succeeds.
- Core user journeys work as intended.
- Responsive behavior and accessibility have been reviewed.
- Public content and links are accurate and intentional.
- Deployment and contact expectations are clear.
- The MVP meets the definition of success in the product spec.

### Phase 6 — Extend the Personal Experience

**Objective:** Expand the website beyond its professional and technical foundation once the MVP is stable.

**Potential activities:**
- Add a Study Abroad or travel experience.
- Present selected photographs and personal highlights.
- Introduce additional personal-interest content.
- Refine existing experiences based on actual use and feedback.

**Completion criteria:**
- Each extension has a clear purpose and appropriate feature requirements before implementation.
- New content fits the existing design system and overall identity.
- Extensions do not compromise the usability or maintainability of the core website.

This phase is intentionally broad. Individual future features should be planned when they become priorities rather than fully specified in advance.

---

## 4. Feature Workstreams

The following workstreams make up the MVP. Their exact implementation order may change as dependencies become clearer.

| Workstream | Primary responsibility | Key dependency |
|---|---|---|
| Shared design system | Establish consistent visual and interaction rules | Product direction and design exploration |
| Homepage | Introduce the person and guide exploration | Shared design system; content selection |
| Projects archive | Enable discovery of technical work | Project inventory and content model |
| Project details | Explain individual projects in depth | Project inventory; detail-page requirements |
| About | Present background and personal identity | Verified biographical content |
| Resume and contact | Provide professional resources and contact paths | Verified links, resume, and contact method |

The projects archive and project detail experiences are closely related. Their specifications should be developed together enough to ensure that project summaries, metadata, and detail pages use a coherent content model.

The shared design system should guide all workstreams, but it need not be completely frozen before feature development begins. It can be refined through representative implementations.

---

## 5. Planning and Execution Rules

- **Feature roadmaps are the detailed execution source.** Do not duplicate their task checklists in this document.
- **Specifications define expected behavior.** Feature implementation should be evaluated against documented acceptance criteria.
- **Preserve useful existing work.** Replace or restructure existing functionality only when there is a clear reason.
- **Research content before asserting details.** Historical projects and personal information must be accurately represented.
- **Resolve dependencies deliberately.** Shared design and content-model decisions should be addressed before dependent features become difficult to change.
- **Keep future scope separate.** Long-term ideas should not delay the MVP unless they reveal a fundamental product requirement.
- **Update the roadmap as discoveries occur.** Phase order and scope may change when evidence justifies it.
- **Verify outcomes, not just task completion.** A completed implementation task does not count as finished if its acceptance criteria are unmet.

---

## 6. MVP Completion

The MVP is complete when the core website experiences are implemented and verified against the product spec and their individual feature acceptance criteria.

At a minimum, visitors should be able to:

- Understand who I am and what I do.
- Discover projects across relevant technical areas.
- Explore meaningful details about individual projects.
- Learn about my background and interests.
- Access my resume and professional profiles.
- Contact me through an explicitly supported method.

The website must also be responsive, accessible to a reasonable standard, reliable to navigate, accurate in its public claims, and maintainable enough to support future growth.

---

## 7. Current Status and Next Actions

- [x] Draft constitution.
- [x] Draft product specification.
- [x] Draft design-system specification.
- [x] Inspect the initial repository structure and major page components.
- [ ] Review and finalize the planning documents.
- [ ] Complete any additional repository investigation needed to resolve material unknowns.
- [ ] Create the feature specifications.
- [ ] Create the corresponding living feature roadmaps.
- [ ] Execute the feature roadmaps and update this document as milestones are completed.

The checkboxes indicate planning status, not proof that the website implementation itself is complete.

---

## 8. Maintenance

Update this roadmap when:

- A major phase is completed.
- Feature priorities or dependencies change.
- The MVP scope changes.
- New evidence materially changes the implementation sequence.
- A future extension becomes an active priority.

Keep updates concise and focused on the overall delivery plan. Detailed implementation progress belongs in the corresponding feature roadmap.
