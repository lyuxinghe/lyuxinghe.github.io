# Local development

This personal website uses Jekyll. Run all commands from the repository root.
The setup supports this Mac's Ruby 2.6.10 and pins Jekyll to the previously
used version, 3.9.5. Exact dependencies are recorded in `Gemfile.lock`.

## First-time setup

Prerequisites: Ruby, RubyGems, Make, and the Xcode command-line build tools.
These are already available on this Mac.

```bash
make setup
```

This downloads Bundler 2.4.22 into `.bundle/bootstrap/` and installs the site
dependencies in `vendor/bundle/`. It does not require `sudo` or changes to
your shell configuration. Both directories are ignored by Git.

Run `make setup` again after pulling changes to `Gemfile` or `Gemfile.lock`.

## Preview and edit

```bash
make dev
```

Open <http://localhost:4000>. Jekyll watches source files, rebuilds the site,
and reloads the browser after edits. Keep the terminal running while you work;
press `Ctrl-C` to stop it. Restart it after changing `_config.yml`.

| What to update | File |
| --- | --- |
| Bio and social links | `_posts/2025-08-01-intro.md` |
| Publications and their card covers | `_data/publications.yml` |
| Projects and their card covers | `_data/projects.yml` |
| Education and work experience | `_data/experience.yml` |
| Shared card layout, styles, and interactions | `_includes/card-deck.html`, `card-deck.css`, `card-deck.js` |
| Shared card schema and validation | `schemas/archive-entry.json`, `scripts/check_cards.rb` |
| Persistent design preferences | `AGENTS.md` |
| Expanded card content | `_includes/portfolio-detail.html`, `_includes/experience-detail.html` |
| Title, description, and profile image path | `_config.yml` |
| Main page layout | `index.html` |
| Styles | `_includes/css/main.css` (combined through `combo.css`) |
| Interactions | `site.js` |
| Images and video | `img/` |
| Footer | `_includes/footer.md` |

The sample posts dated `9999` stay hidden because they are future-dated.
Edit the source files above; `_site/` is generated output.

### Archive cards

Publications, Projects, and Experience use the same layered card deck. Cards
are sorted by numeric `sort_date` (`YYYYMM`); all details are hidden on load.
Every entry in all three data files uses one structure:

```yaml
- id: example
  sort_date: 202610
  card:
    year: '2026'
    title: Example title
    supporting_text: Optional degree or role below the title
    subtitle: Conference or category
    image: img/cards/example.jpg
  detail:
    description: Content for the expanded detail panel
```

`schemas/archive-entry.json` defines this contract. The four required `card`
fields and optional `supporting_text`, `image_shape`, and `image_crop` are the only inputs to
`_includes/archive-card.html`; style settings, legacy
field aliases, and extra card fields are rejected. Full authors, abstracts,
links, qualifications, and roles live in `detail`, whose fields may vary by
section. Experience has separate Education & Research and
Industry card rows using the existing education/work data lists. All six
cards share one detail area beneath both rows. The card markup is shared
through `_includes/archive-card.html`.

Supporting text appears directly below the bold title, inside the same reserved
title slot. Experience cards use it for degrees, visiting roles, and job titles;
their footer lists Education & Research, Research, or Industry. The optional
field is available to every section and uses the same font size as the title
with regular (400) weight.

Publication detail headings show the year, followed by the underlined `venue`
and optional `venue_location` (for example, `2026, ICRA · Vienna`). Entries
without a venue show only the year. All detail metadata uses the same font
size and wraps naturally when needed.

Hover or keyboard-focus a card to preview its detail and shrink the cards
proportionally, keeping the image, year, full title, and subtitle visible.
Every card uses the same 270:350 portrait proportion, including Experience,
at both sizes and all viewport widths. Covers use a shared four-row grid for the
visual, year, title, and subtitle. Images and logos are aligned at the top and
horizontally centered on the plain card face. The shared `image_shape` option
defaults to `rectangle`; Experience records use `circle` to round the logo
inside the same fixed visual slot. This changes only the image's silhouette,
not the card's dimensions or the placement of its text.
Optional `image_crop: {zoom: 2.08, x: 50, y: 75}` zooms a cover within the fixed
visual slot, with `x` and `y` specifying the CSS transform origin in percentages.
Zoom is limited to 1–4 and origins to 0–100. ParticleSplat uses this shared option
to frame its central robot and reconstruction panels without slide headings or
footer text. The original image file and expanded media are independent of this
thumbnail framing.
Experience logos use original 400px square assets, plus CMU's 900px PNG, for
crisp rendering at up to three times the 130px display size. Source pages and
native dimensions are recorded in `img/experience/sources.json`. Prefer original
assets at least 400px square or vectors; do not upscale small thumbnails.
All sections use exactly the same card font family, sizes, weights, colors,
and spacing rules. Shared `--card-year-size`, `--card-title-size`, and
`--card-subtitle-size` tokens control typography. The visual slot is 130px tall
at full size; the title slot reserves four lines, and the footer fits two subtitle
lines. Every slot starts at the same height relative to its card, even for short
titles. Spare title space stays inside the title slot rather than shifting the
other content. These slots scale together with the card; no section receives a
typography or geometry override.
The layout scales from `--card-base-width`, rather than each row's available
width, so responsive rows cannot stretch the card shape.
All decks use the largest row's card count to choose the same responsive
width, including two-card sections, so their text stays the same size at
the same viewport and open/closed state.
Cards stay upright on a shared baseline within each row; the opened card
lifts 14px above its neighbors.
Moving the pointer off a card closes its unpinned preview after a short delay.
During the initial shrink, the space between its original and compact position
stays hoverable so the card can still be reached and pinned.
Keyboard previews stay open while focus remains within the section.
Click or tap a card to toggle its pin, indicated by a small circular metal
nail head. Unpinning keeps the preview open while hovered or keyboard-focused;
leaving the card then closes it. Pin a card to use its detail links.
A pinned detail stays in place when other cards
are hovered; clicking another card moves the pin. Each section has its own
pin. Keyboard users can use Left/Right, Home, and End to navigate,
Enter/Space to pin or unpin, and Escape to close. On small screens the
full-size cards form a swipeable row, then compact when opened.
Card motion uses the shared `--card-motion-duration` (650ms), including the
hover transition guard. Circular silver pins settle into place when added
and lift away when removed. Reduced-motion preferences disable these effects.
Details unfold down from the selected card's edge and fold back up on close.
Their container height animates with the reveal, including when switching
between cards. Outgoing details become inert immediately and are removed
after the exit animation; interrupted motions resume from their visible state.
Without JavaScript, every detail remains readable. Videos only autoplay when
their selected details are on screen; reduced-motion settings keep previews
still, with video controls available for manual playback.

Static covers and lightweight MP4 versions of the original GIFs live in
`img/cards/`. To take a new video frame, for example:

```bash
ffmpeg -ss 16 -i img/publications/particlesplat-short-20s.mp4 -frames:v 1 -vf 'scale=960:-1' -q:v 3 img/cards/new-cover.jpg
```

## Build the static site

```bash
make check
make test
make build
```

`make check` validates all card records, image paths, unique IDs, and the
absence of section- or logo-specific card CSS. `make build` and `make dev`
run this check first. `make test` exercises the validator with valid records
and deliberately invalid data and styling. Run `make check` after editing
data or CSS during an already-running preview; the live reload server does
not rerun Make prerequisites on each file change.

The generated site is written to `_site/`, which is ignored by Git.
These commands only build and serve locally; publishing is a separate step.
Do not push commits or publish changes without the user's explicit permission
for the current changes. A previous push authorization does not cover new work.

## Troubleshooting

- Missing Bundler or gems: run `make setup` from the repository root.
- Port 4000 already in use: stop the existing preview with `Ctrl-C` first.
- Configuration changes not appearing: restart `make dev`.
- macOS's older RubyGems can print an upgrade warning. Bundler is explicitly
  pinned to a compatible version; no system RubyGems upgrade is needed.

See the [Jekyll command-line documentation](https://jekyllrb.com/docs/usage/)
for additional build and serve options.
