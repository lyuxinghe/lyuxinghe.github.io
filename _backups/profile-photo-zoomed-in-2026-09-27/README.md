# Previous profile photo framing

Saved before reducing the zoom at the user's request.

- `intro.md`: exact home-section source for the previous framing.
- `graduation_me.jpg`: original photo used by that version.
- `preview.png`: screenshot of the previous framing on localhost.

Previous crop: a 4:5 frame, `object-fit: cover`, `object-position: 62% center`,
`transform: scale(1.18)`, and `transform-origin: center bottom`.

This underscore-prefixed backup folder is excluded from the normal Jekyll build.
To restore only the framing, reapply the previous crop properties to
`.intro-photo img` in `_posts/2025-08-01-intro.md`.
