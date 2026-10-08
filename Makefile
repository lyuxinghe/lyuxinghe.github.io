BUNDLER_VERSION := 2.4.22
BUNDLE_HOME := $(CURDIR)/.bundle/bootstrap
BUNDLE := env GEM_HOME="$(BUNDLE_HOME)" GEM_PATH="$(BUNDLE_HOME)" "$(BUNDLE_HOME)/bin/bundle"

.PHONY: setup dev build

setup: .bundle/bootstrap/bin/bundle
	$(BUNDLE) config set --local path vendor/bundle
	$(BUNDLE) config set --local force_ruby_platform true
	$(BUNDLE) install

.bundle/bootstrap/bin/bundle:
	gem install bundler -v $(BUNDLER_VERSION) --install-dir "$(BUNDLE_HOME)" --no-document

dev:
	$(BUNDLE) exec jekyll serve --host 127.0.0.1 --port 4000 --livereload

build:
	$(BUNDLE) exec jekyll build
