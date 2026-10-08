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
| Publications | `_posts/2025-08-02-publications.md` |
| Projects | `_posts/2025-08-03-projects.md` |
| Title, description, and profile image path | `_config.yml` |
| Main page layout | `index.html` |
| Styles | `_includes/css/main.css` (combined through `combo.css`) |
| Interactions | `site.js` |
| Images and video | `img/` |
| Footer | `_includes/footer.md` |

The sample posts dated `9999` stay hidden because they are future-dated.
Edit the source files above; `_site/` is generated output.

## Build the static site

```bash
make build
```

The generated site is written to `_site/`, which is ignored by Git.
These commands only build and serve locally; publishing is a separate step.

## Troubleshooting

- Missing Bundler or gems: run `make setup` from the repository root.
- Port 4000 already in use: stop the existing preview with `Ctrl-C` first.
- Configuration changes not appearing: restart `make dev`.
- macOS's older RubyGems can print an upgrade warning. Bundler is explicitly
  pinned to a compatible version; no system RubyGems upgrade is needed.

See the [Jekyll command-line documentation](https://jekyllrb.com/docs/usage/)
for additional build and serve options.
