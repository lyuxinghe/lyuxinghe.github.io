# Persistent project preferences

Read `DEV.md` before changing this website.

## Shared archive cards

The user requires Publications, Projects, and Experience cards to use the
same data structure, font family, font sizes, weights, colors, spacing rules,
and proportions. This is an explicit preference, not a default to vary by section.

- Every entry uses `{id, sort_date, card, detail}`. The shared `card` record
  contains `{year, title, subtitle, image}` and optional `supporting_text` and
  `image_shape` and `image_crop`, as defined in `schemas/archive-entry.json`. Expanded `detail`
  content may vary by section.
- Render every card through `_includes/archive-card.html`. It consumes only
  the shared record; do not add section-specific fallbacks or card variants.
- Define card typography and geometry once in `card-deck.css`. Do not add
  section-, logo-, or item-specific font sizes, styles, or dimensions. A shared
  responsive scale may shrink the entire card proportionally.
- Reduce whitespace with common layout rules. Do not enlarge only project
  titles or experience names to fill short cards. Keep all text visible.
- Use fixed shared slots for the visual, year, title, and subtitle. Their top
  edges must align relative to every card, regardless of text length or section.
  Reserve four title lines and two subtitle lines; align images at the top of
  their slot. Never let the media area expand to absorb unused text space.
  Compare actual card width and height across sections at the same state.
- Optional supporting text sits directly under the title within its reserved
  slot, using the same font size as the title with regular (400) weight.
  Experience cards use it for the
  degree/visiting role or job title. Their footer shows the category
  (Education & Research, Research, or Industry), not the job title.
- Logos sit on the plain card face without gray panels. Images and logos use
  the same media slot. The user explicitly requests circular Experience icons:
  use the shared `image_shape: circle` option to round the image alone, keeping
  card dimensions, typography, and slot positions identical across sections.
  Other card visuals default to rectangles.
- Frame cover artwork with the shared optional `image_crop` metadata (zoom and
  percentage transform origin). Crops only affect artwork inside the visual
  slot. ParticleSplat focuses on the central robot and reconstruction panels,
  excluding the slide's heading and footer text.
- Use original logo assets at least 400px square (or vectors) for the 130px
  icon slot on high-density screens; do not enlarge low-resolution thumbnails.
  Keep download provenance in `img/experience/sources.json`.
- Preserve the two experience rows and their shared detail area, hover,
  pin/unpin, circular nail indicator, upright lift, and reveal animations.
- Keep the rest of the website's content and design intact unless requested.

Run `make check`, `make test`, and `make build` after changing the card contract.
Visually verify both large and compact cards on desktop and mobile when
changing their layout. Compare computed typography, dimensions, and slot offsets
across sections at equal card sizes; check the longest titles and subtitles for
overflow. Schema consistency alone does not guarantee visual consistency.

## Git

Do not commit or push unless the user requests it. Push permission must be
explicit for the current changes; permission for an earlier push does not carry over.
