# Development Guide

This site is a Jekyll-based personal website.

The steps below were verified on macOS with:

- Ruby `2.6.10`
- Jekyll `3.9.5`
- `kramdown-parser-gfm` `1.1.0`

This repo does not include a `Gemfile`, so the setup below installs the required gems into your user gem directory.

## 1. One-time installation

Check the Ruby version:

```bash
ruby -v
```

Install the gems needed to build and serve the site:

```bash
gem install --user-install ffi -v 1.17.4 --platform ruby --no-document
gem install --user-install public_suffix -v 5.1.1 --no-document
gem install --user-install jekyll -v 3.9.5 --no-document
gem install --user-install kramdown-parser-gfm --no-document
```

Add the user gem binaries to your `PATH` for the current shell:

```bash
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
```

To make that persistent in `zsh`, add this line to `~/.zshrc`:

```bash
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
```

Then reload your shell:

```bash
source ~/.zshrc
```

## 2. Build the site

From the repo root:

```bash
cd /Users/lyuxinghe/Desktop/code/websites/personal
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
jekyll build
```

The generated static site will be written to `_site/`.

## 3. Run the site locally

From the repo root:

```bash
cd /Users/lyuxinghe/Desktop/code/websites/personal
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
jekyll serve --host 127.0.0.1 --port 4000
```

Then open:

```text
http://127.0.0.1:4000
```

Stop the server with `Ctrl-C`.

## 4. Quick troubleshooting

- If `jekyll` is not found, your `PATH` is missing `"$HOME/.gem/ruby/2.6.0/bin"`.
- If you change `_config.yml`, restart the Jekyll server.
- If you only want to regenerate static files without starting a server, use `jekyll build`.
