# Next.js template

This is a Next.js template with shadcn/ui.

## Project guidelines

This project should remain primarily a route-protected Next.js v16 app using
client-side rendering for interactive application surfaces. Avoid making major
server-side rendering the normative architecture; use SSR only where it is
needed for routing, session checks, metadata, or data that benefits from server
execution.

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
