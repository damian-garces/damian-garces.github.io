# Damián Garcés — Portfolio

Personal portfolio site, built with [Astro 5](https://astro.build) + TypeScript (strict),
Content Collections and native i18n (English/Spanish). Static output, deployed to GitHub Pages
via GitHub Actions.

## Editing content

Every piece of CV content (bio, services, skills, soft skills, languages, education, experience,
contact copy, social links) lives in `src/content/<collection>/{en,es}.json`, validated against
the schemas in `src/content/config.ts`. **Updating the site should never require touching a
component** — edit the relevant JSON file for the locale you want to change.

UI chrome strings that aren't CV content (nav labels, button captions, footer copy) live in
`src/i18n/ui.ts`.

## Development

```sh
npm install
cp .env.example .env   # add your Web3Forms access key (https://web3forms.com)
npm run dev
```

| Command           | Action                                                |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`       | Start the local dev server                              |
| `npm run build`     | Type-check (`astro check`) and build the static site to `dist/` |
| `npm run preview`   | Preview the production build locally                    |
| `npm run check`     | Type-check only                                          |

## Architecture

- **Astro components by default** — HTML-first, zero client JS. React is used only for the four
  genuinely interactive pieces: `ThemeToggle`, `CodeEditor` and `ContactForm`
  (`src/components/islands/`). The language switcher is a plain server-rendered link swap — no
  client JS needed for a navigation.
- **Content Collections** (`src/content/`) are the single source of truth for CV content, typed
  and schema-validated. `src/lib/content.ts` wraps entry loading with a locale fallback so a
  missing translation degrades gracefully instead of crashing the build.
- **Shiki** highlights the hero code-editor snippets at build time (`src/lib/shiki.ts`) — no
  client-side syntax highlighting.
- **i18n**: English at `/`, Spanish at `/es/`, via Astro's built-in i18n routing
  (`astro.config.ts`) plus hreflang alternates in `src/layouts/BaseLayout.astro`.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site and publishes it
to GitHub Pages. In the repo settings, **Settings → Pages → Source** must be set to
**"GitHub Actions"** (not "Deploy from a branch") for this to take effect. Add the
`PUBLIC_WEB3FORMS_KEY` repository secret before the first deploy so the contact form works in
production.
