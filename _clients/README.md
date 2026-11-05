Private client photo deliveries. Each file here is one unlisted page at
`/deliver/<filename-without-extension>/` — nothing links to it from the site,
it's just a URL to send the client directly.

This file itself is excluded from the build (see `exclude:` in `_config.yml`
— README.md is already in that list), so it's safe to leave here as a note.

## Adding a new delivery

1. **Preview images** (small, web-sized, committed to the repo so the page
   loads fast): resize the edited photos and drop them in
   `assets/img/clients/<slug>/`. What was used for Sophia & Ryan:
   ```
   sips -Z 1600 -s formatOptions 70 input.jpg --out assets/img/clients/<slug>/output.jpg
   ```
   ~1600px on the long edge, quality 70, landed around 150-250KB per photo.

2. **Full-resolution originals**: zip them and host the zip *outside* the
   repo — a GitHub Release asset works well (free, no size issues, doesn't
   bloat git history). Since this repo is public, use a generic release
   title/tag/filename (no client names) so the client's name isn't sitting
   in the public Releases tab — the delivery page itself has their name,
   but that page isn't linked from anywhere or indexed by search engines.

3. **Add `_clients/<slug>.md`** — copy `sophia-ryan.md` as a template and
   update: title, subtitle, gallery_path, zip_url, photo_count, zip_size.
   Keep `excluded: true`, `sitemap: false`, and `noindex: true` — those are
   what keep the page out of site search, sitemap.xml, and search engines.

4. Share `https://klarissapalacios.com/deliver/<slug>/` directly with the
   client. It's not in the navbar (collection documents never are) and not
   discoverable any other way on the site, but it isn't password-protected
   either — treat the URL itself as the access control.
