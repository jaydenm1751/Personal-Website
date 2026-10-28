# Personal Website — Design System Specification

**Status:** Draft  
**Scope:** Visual identity, design principles, shared interface conventions, and responsive behavior  
**Related Documents:** `constitution/constitution.md`, `specs/product-spec.md`

---

## 1. Purpose

This document defines the design language for the personal website.

The goal is to establish a recognizable, cohesive visual identity that supports the website's purpose: presenting my professional work, technical interests, background, and personality through an experience that encourages exploration.

The design system should provide enough consistency to make the website feel unified without forcing every page or content type into the same layout.

It defines shared design principles and conventions. Detailed page composition, feature-specific interactions, and implementation decisions belong in the relevant feature specifications and technical planning.

---

## 2. Design Vision

The website should feel like a deliberately designed personal digital space rather than a generic portfolio template or a resume with additional styling.

It should balance three qualities:

- **Professional credibility:** The presentation should feel polished, intentional, and trustworthy.
- **Technical character:** The design should reflect an interest in software, systems, and technology without relying on clichéd developer aesthetics.
- **Personal expression:** The interface should have enough character to communicate an individual identity rather than looking interchangeable with other portfolios.

The design should support curiosity. Visitors should feel encouraged to explore projects, follow connections, and discover more about the person behind the work.

Visual design should reinforce the content, not compete with it.

---

## 3. Guiding Design Principles

### 3.1 Distinctive, Not Generic

Avoid a design that could belong to any developer with only the name and projects changed.

The website should develop a recognizable identity through its typography, layout, spacing, visual hierarchy, content presentation, and restrained use of distinctive visual elements.

Distinctiveness should come from a coherent design direction rather than an accumulation of decorative effects.

### 3.2 Content First

Projects, technical explanations, and personal stories are the primary content.

Layouts should make this information easy to discover and read. Decorative elements should never obscure the content or make important information harder to understand.

### 3.3 Exploration Without Clutter

The interface should make available content discoverable through clear navigation, meaningful links, and consistent page structure.

Exploration should feel natural rather than requiring visitors to decipher unconventional navigation or interact with unnecessary effects.

### 3.4 Consistency With Flexibility

Shared elements should behave and look consistently across the website.

However, project summaries, technical diagrams, photographs, long-form explanations, and personal highlights may require different presentation patterns. The design system should support those differences within a common visual identity.

### 3.5 Restraint

Animations, gradients, shadows, borders, background effects, and other decorative treatments should have a clear purpose.

Use them when they improve hierarchy, feedback, atmosphere, or understanding—not simply because they are available.

### 3.6 Readability

Typography, contrast, line length, spacing, and content width should support comfortable reading.

Technical content may be dense, but the interface should organize it into understandable sections rather than presenting large, uninterrupted blocks of text.

### 3.7 Responsive by Design

The experience should be deliberately usable across desktop, tablet, and mobile layouts.

Mobile should not be treated as a compressed version of the desktop interface. Navigation, content hierarchy, spacing, and interactive elements should adapt to the available space.

### 3.8 Accessible by Default

The design should support keyboard navigation, visible focus, sufficient color contrast, understandable interaction states, and appropriate semantic structure.

Visual distinction should not depend on color alone.

---

## 4. Visual Identity

### 4.1 Overall Direction

The exact visual direction remains an open design decision.

The chosen direction should satisfy the following requirements:

- Feel personal and recognizable.
- Support both technical and nontechnical content.
- Work for short summaries and long-form project explanations.
- Accommodate screenshots, diagrams, photographs, and external resources.
- Remain readable and visually coherent across page types.
- Avoid excessive visual complexity that makes future maintenance difficult.

The design direction should be validated against representative content from several parts of the website, not just the homepage.

### 4.2 Color

A deliberate color palette should establish the website's visual identity and communicate hierarchy.

The palette should define roles for:

- Primary page backgrounds.
- Secondary surfaces and elevated content.
- Main text and secondary text.
- Borders and dividers.
- Primary interactive elements.
- Links and interactive states.
- Status or feedback messages when needed.

Color decisions should account for contrast, readability, and consistent application.

**Open decision:** The specific palette, including whether the site uses a light theme, dark theme, or both, must be established during design exploration rather than assumed by this specification.

### 4.3 Typography

Typography should communicate hierarchy and support the different reading experiences the website requires.

The system should establish roles for:

- Primary page headings.
- Section headings.
- Subheadings.
- Body text.
- Secondary descriptions and metadata.
- Links and navigation.
- Technical content, including code and commands.

Font choices should balance personality with readability. Heading styles may provide stronger visual character, while body text should remain comfortable for extended reading.

Technical typography should be used when it improves the presentation of code, commands, identifiers, or other technical material—not as decoration applied indiscriminately.

**Open decision:** Specific typefaces, font weights, and a type scale will be selected during design exploration.

### 4.4 Spacing and Layout

The system should use a consistent spacing scale and establish clear relationships between elements.

Spacing should distinguish related content from separate sections and allow important information to stand out without relying on excessive decoration.

Page layouts should use content widths appropriate to their purpose. Long-form text should remain readable, while project grids and visual collections may use wider spaces.

The design system should establish reusable spacing and layout conventions without requiring every page to share the same composition.

### 4.5 Borders, Shadows, and Surfaces

Borders, shadows, surface changes, and similar treatments should help communicate grouping, separation, hierarchy, or interaction.

They should not be applied automatically to every element.

Cards and panels should be used when they clarify the structure of the content. Not every section, link, or text block needs to be enclosed in a box.

### 4.6 Imagery and Media

The design should accommodate multiple types of visual content:

- Project screenshots and application interfaces.
- Architecture diagrams and technical illustrations.
- Photographs and personal highlights.
- Thumbnails and preview images.
- External demonstrations or embedded media when justified.

Media should have consistent presentation rules for sizing, cropping, spacing, captions, and responsive behavior where appropriate.

Images should support the surrounding content. They should not be included merely to fill empty space.

---

## 5. Shared Interface Conventions

### 5.1 Navigation

Navigation should make the site's major destinations understandable and easy to reach.

Labels should be clear, hierarchy should be predictable, and visitors should be able to identify their current location when useful.

The navigation model must adapt to smaller screens without sacrificing access to important destinations.

Detailed navigation structure and placement will be specified in the relevant feature specifications.

### 5.2 Links and Actions

Links and interactive controls should be visually distinguishable from static content.

Interactive elements should provide appropriate feedback for hover, focus, active, and disabled states where applicable.

External links should behave predictably, and their destinations should be understandable from their labels or surrounding context.

### 5.3 Project Summaries

Project summaries should present information in a consistent, scannable format.

Depending on the project, a summary may include its name, short description, technical areas, technologies, role or contribution, and a path to further details.

The presentation should prioritize useful context over a wall of technology badges or decorative metadata.

The projects feature specification will define the actual content model and summary layout.

### 5.4 Technical Content

Technical explanations should remain readable and structured.

The design should support headings, lists, code blocks, inline code, diagrams, screenshots, and external references as appropriate.

Code and diagrams should remain usable on smaller screens. Wide technical content should have an intentional responsive treatment rather than breaking the page layout.

### 5.5 Feedback and State

Interactive features should communicate relevant states clearly.

Where applicable, the interface should distinguish loading, success, error, empty, selected, and disabled states.

Feedback should be concise, understandable, and consistent with the overall visual language.

### 5.6 Motion and Animation

Motion may be used to reinforce transitions, interactions, or spatial relationships.

Animations should be purposeful, restrained, and performant. Essential information and navigation must remain accessible without animation.

The implementation should respect reduced-motion preferences.

---

## 6. Responsive Design

The website should work across a range of viewport sizes without requiring visitors to zoom, tolerate horizontal page overflow, or struggle with small interactive controls.

Responsive behavior should account for:

- Navigation changes on smaller screens.
- Flexible content widths and margins.
- Project grids adapting to available space.
- Readable typography and line lengths.
- Images and diagrams scaling appropriately.
- Code blocks and tables remaining usable.
- Touch-friendly interactive elements.
- Content order and hierarchy remaining logical.

Breakpoints should be selected based on when the layout needs to change, rather than relying on device names alone.

The exact breakpoints and layout rules will be determined during implementation planning and validated against real page content.

---

## 7. Accessibility and Usability

Accessibility is a design requirement, not a final polish step.

The design system should support:

- Sufficient text and interface contrast.
- Keyboard-accessible navigation and controls.
- Clearly visible focus indicators.
- Logical heading hierarchy.
- Readable text sizing and spacing.
- Descriptive link labels.
- Appropriate alternative text for meaningful images.
- Non-color indicators for important states.
- Reduced-motion preferences.
- Touch targets appropriate for interactive controls.

Semantic HTML and accessible interaction patterns should be used wherever possible.

Accessibility should be evaluated through both automated checks and practical interaction testing.

---

## 8. Design System Implementation Principles

The design system should be maintainable and consistent with the existing application architecture.

### Shared Design Tokens

Recurring values—such as colors, spacing, typography, borders, radii, and other visual properties—should be centralized where doing so improves consistency.

### Reusable Components

Common interface patterns should be reused when they share meaningful structure or behavior.

Components should not be abstracted solely to reduce line count. Reuse should make the design easier to maintain and evolve.

### Clear Separation of Responsibilities

Shared design rules should remain distinguishable from page-specific composition and feature behavior.

Feature-specific needs may extend the system when justified, but should not create unnecessary competing conventions.

### Incremental Evolution

The design system may evolve as the website's actual content and requirements become clearer.

Changes should preserve coherence across existing pages rather than optimizing one page at the expense of the rest of the experience.

---

## 9. Design Validation

The design system should be evaluated against representative website experiences before it is treated as stable.

Validation should include:

1. The homepage, to evaluate identity, hierarchy, and first impressions.
2. The projects archive, to evaluate browsing, scanning, and content density.
3. A detailed technical project page, to evaluate long-form reading, code, and diagrams.
4. The About experience, to evaluate narrative content and personal expression.
5. A narrow mobile viewport, to evaluate responsive behavior and navigation.

The design should also be checked for keyboard usability, contrast, readable typography, interaction feedback, and unnecessary visual complexity.

A design that looks compelling in a single screenshot but fails across these experiences does not satisfy the specification.

---

## 10. Acceptance Criteria

The design system is ready to guide feature implementation when:

- [ ] A coherent visual direction has been selected and documented.
- [ ] The color palette and its intended semantic roles are defined.
- [ ] Typography roles and a usable hierarchy are established.
- [ ] Spacing and layout conventions are documented.
- [ ] Shared navigation, link, and interactive-state conventions are established.
- [ ] The design can accommodate both technical and personal content.
- [ ] Responsive behavior is defined at the level needed to guide implementation.
- [ ] Accessibility requirements are reflected in the design rules.
- [ ] Representative pages demonstrate that the system works beyond the homepage.
- [ ] Shared design decisions can be implemented without unnecessary duplication.
- [ ] Remaining unresolved choices are explicitly documented rather than silently assumed.

---

## 11. Open Design Decisions

The following decisions require deliberate exploration and should not be finalized solely from generic portfolio conventions:

- Primary visual direction and overall atmosphere.
- Light theme, dark theme, or support for both.
- Primary and accent colors.
- Typeface selection and typography scale.
- Degree of minimalism versus expressive visual detail.
- Use of grids, borders, surfaces, and card treatments.
- Role of photography, diagrams, and other media in the visual identity.
- Appropriate level of animation and interaction.
- How the design should balance professional credibility with personal character.

These decisions should be evaluated together because the website's identity will emerge from the complete visual system rather than any isolated choice.

---

## 12. Relationship to Other Documents

- `constitution/constitution.md` establishes durable project principles.
- `specs/product-spec.md` defines product goals, audiences, capabilities, and scope.
- `specs/features/` defines the behavior and acceptance criteria of individual website experiences.
- `plans/roadmap.md` organizes implementation priorities.
- `plans/features/` contains living implementation plans and progress for each feature.

This document defines the shared design language. It should be updated when an intentional design decision changes, and related feature specifications should remain consistent with it.
