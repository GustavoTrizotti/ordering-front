# Next.js template

This is a Next.js template with shadcn/ui.

## Project guidelines

This project should remain primarily a route-protected Next.js v16 app using
client-side rendering for interactive application surfaces. Avoid making major
server-side rendering the normative architecture; use SSR only where it is
needed for routing, session checks, metadata, or data that benefits from server
execution.

## Running with the local Spring API

The backend Docker Compose file only starts Postgres. Keep the Spring API
running from IntelliJ on the host machine, then run this frontend container with
two API base URLs:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
API_INTERNAL_BASE_URL=http://host.docker.internal:8080
```

`NEXT_PUBLIC_API_BASE_URL` is used by browser-side requests, where `localhost`
means the host machine. `API_INTERNAL_BASE_URL` is used by Next.js route
handlers running inside Docker, where `localhost` means the frontend container,
so it needs Docker Desktop's host bridge address instead.

After changing either value, rebuild the frontend image:

```bash
docker compose up --build
```

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
