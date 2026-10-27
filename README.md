# Personal Website

A responsive personal website built with React, TypeScript, and Vite.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy with Cloudflare Pages

1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages** and create a Pages project connected to the repository.
3. Set the production branch to `main`.
4. Set the build command to `npm run build`.
5. Set the build output directory to `dist`.
6. After the first successful deployment, open the Pages project and add `jaydengmckenna.com` as a custom domain. Follow the DNS instructions Cloudflare provides.

Cloudflare Pages will automatically build and deploy each push to `main`. Pull requests can receive preview deployments.

GitHub Actions in `.github/workflows/ci.yml` separately checks that the app type-checks and builds successfully.

## Before sharing publicly

- Replace the placeholder GitHub and LinkedIn links in `src/main.tsx`.
- Replace the example contact email with an address you actually use.
- Verify the project descriptions and link each project to its real repository.
- Add a real resume only if you want it public.
- Review all public details for accuracy and avoid confidential employer information.
