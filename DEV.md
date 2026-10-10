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
Each cover shows a static image or organization logo, `year` (or `card_date`
for an Experience year), title, and `subtitle`. An optional `card_subtitle`
overrides the cover label, such as the current or most recent industry job title.
Full authors,
abstracts, links, qualifications, and roles remain
in the detail panel below. Experience has separate Education & Research and
Industry card rows using the existing education/work data lists. All six
cards share one detail area beneath both rows. The card markup is shared
through `_includes/archive-card.html`.

Publication detail headings show the year, followed by the underlined `venue`
and optional `venue_location` (for example, `2026, ICRA · Vienna`). Entries
without a venue show only the year. All detail metadata uses the same font
size and wraps naturally when needed.

Hover or keyboard-focus a card to preview its detail and shrink the cards
proportionally, keeping the image, year, full title, and subtitle visible.
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
make build
```

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
