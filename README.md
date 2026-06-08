# Task Management React

Frontend for the Task Management & Analytics Platform. A **React 19 / TypeScript / Vite** SPA that talks to two backends:

| Backend | Role |
|---------|------|
| [Laravel API](https://github.com/your-username/task-management-laravel-api) | Auth, users, teams, tasks (CRUD) |
| [Node Services](https://github.com/your-username/task-management-node-services) | Analytics, exports, notifications |

---

## Live URLs

| Service | URL |
|---------|-----|
| **React Frontend (this repo)** | [https://task-management-react-exam-1gnmeomqi.vercel.app](https://task-management-react-exam-1gnmeomqi.vercel.app) |
| **Dashboard** | [https://task-management-react-exam-1gnmeomqi.vercel.app/dashboard](https://task-management-react-exam-1gnmeomqi.vercel.app/dashboard) |
| **Laravel API** | [https://task-management-laravel-api-u2v9.onrender.com/api](https://task-management-laravel-api-u2v9.onrender.com/api) |
| **Node.js Services** | [https://task-management-node-services-g5ie.onrender.com/api](https://task-management-node-services-g5ie.onrender.com/api) |

---

## Table of Contents

- [Live URLs](#live-urls)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Data Fetching](#data-fetching)
- [Form Validation](#form-validation)
- [State Management](#state-management)
- [Routing & Authorization](#routing--authorization)
- [UI & Components](#ui--components)
- [Adding a New Feature](#adding-a-new-feature)
- [Scripts](#scripts)

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| npm | 10+ |
| Laravel API | Running on port 8000 |
| Node Services | Running on port 3000 |

### Setup

```bash
git clone https://github.com/your-username/task-management-react.git
cd task-management-react
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to Laravel and `/node-api` to Node (see `vite.config.ts`).

---

## Environment Variables

| Variable | Description | Local example |
|----------|-------------|---------------|
| `VITE_LARAVEL_API_URL` | Laravel API base URL (include `/api`) | `/api` |
| `VITE_NODE_API_URL` | Node service base URL (include `/api`) | `/node-api` |
| `VITE_APP_NAME` | App title in header / browser tab | `Task Management` |

Production values (live app on Vercel) are commented in [`.env.example`](.env.example).

| Variable | Production value |
|----------|------------------|
| `VITE_LARAVEL_API_URL` | `https://task-management-laravel-api-u2v9.onrender.com/api` |
| `VITE_NODE_API_URL` | `https://task-management-node-services-g5ie.onrender.com/api` |
| `VITE_APP_NAME` | `Task Management` |

---

## Project Structure

Feature-based layout. Each domain owns its API layer, business logic, UI, and types. Pages are thin composition layers.

```text
src/
├── app/                  # Root App component
├── components/
│   ├── Fields/           # Reusable form field wrappers (Input, Select, etc.)
│   └── ui/               # shadcn/ui primitives (Button, Card, Dialog, …)
├── config/
│   ├── env.ts            # Typed Vite env access
│   └── routes.ts         # Route path constants
├── features/             # Domain modules (primary code lives here)
│   ├── auth/
│   ├── dashboard/
│   ├── team-management/
│   ├── task-management/
│   ├── user-management/
│   ├── analytics/
│   ├── settings/
│   └── shared/           # Cross-feature types, schemas, API clients, utils
├── hooks/                # App-wide hooks (e.g. useAuth)
├── layouts/              # Route shells (AppLayout, AuthLayout, ProtectedRoutes)
├── pages/                # Route entry points — compose feature components
├── routes/               # React Router config + lazy-loaded pages
├── services/
│   └── BaseApiService.ts # RTK Query base API (Laravel)
├── slices/               # Redux slices (auth)
└── store/                # Redux store configuration
```

### Feature module convention

Every feature follows the same internal structure:

```text
features/<feature>/
├── _api/          # Raw HTTP calls (Axios — used by Node-backed features)
├── _service/      # RTK Query endpoints OR service facade over _api
├── _hooks/        # Custom hooks that wrap queries/mutations + UI state
├── _components/   # Feature-specific UI
├── _schema/       # Zod validation schemas
├── _types/        # TypeScript types
├── _utils/        # Permissions, formatters, table columns
└── index.ts       # Public API — only import from here outside the feature
```

**Rule:** Pages and other features import from `@/features/<feature>`, never from internal `_` folders.

---

## Tech Stack

| Category | Library | Purpose |
|----------|---------|---------|
| Framework | React 19 | UI |
| Language | TypeScript | Type safety |
| Build | Vite 8 | Dev server & bundling |
| Routing | React Router 7 | Client-side routing |
| Server state | RTK Query (`@reduxjs/toolkit`) | Laravel API — caching, mutations, invalidation |
| Client state | Redux Toolkit | Auth session (user in store + localStorage) |
| HTTP (Node) | Axios | Analytics & export calls to Node service |
| Forms | React Hook Form | Form state & submission |
| Validation | Zod + `@hookform/resolvers` | Client-side schema validation |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| UI kit | shadcn/ui + Base UI | Accessible component primitives |
| Icons | Lucide React | Icon set |
| Charts | Recharts | Analytics visualizations |
| Toasts | Sonner | Success / error feedback |

---

## Architecture Overview

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│   Page      │────▶│  Feature     │────▶│  _service (RTK Q)   │──▶ Laravel API
│  (compose)  │     │  _hooks      │     │  or _api (Axios)    │──▶ Node API
└─────────────┘     └──────────────┘     └─────────────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐     ┌──────────────┐
│  _components│     │  _schema     │  Zod schemas
└─────────────┘     └──────────────┘
```

**Data flow (read):** Page → custom hook → RTK Query hook / service → API → normalized response → UI.

**Data flow (write):** Form submit → Zod validation → mutation hook → API → cache invalidation + toast.

---

## Data Fetching

The app uses **two HTTP strategies**, split by backend.

### 1. Laravel API — RTK Query (primary)

All CRUD for auth, users, teams, and tasks goes through a single RTK Query instance.

| File | Responsibility |
|------|----------------|
| `services/BaseApiService.ts` | `createApi` — base URL, auth header, 401 → logout |
| `features/<feature>/_service/` | `api.injectEndpoints()` — queries & mutations per domain |

**Setup highlights:**

- JWT attached via `prepareHeaders` from `localStorage`
- `401` responses clear the token and dispatch `logout`
- Tag-based cache invalidation (`Auth`, `Users`, `Teams`, `Tasks`, `Analytics`)
- `transformResponse` unwraps the Laravel envelope `{ status, message, data }`

**Example — define an endpoint:**

```ts
// features/task-management/_service/index.ts
export const taskService = api.injectEndpoints({
    endpoints: (builder) => ({
        getTask: builder.query<Task, number>({
            query: (taskId) => /tasks/,
            transformResponse: (res: ApiResponse<Task>) => res.data,
            providesTags: (_r, _e, id) => [{ type: 'Tasks', id }],
        }),
    }),
});
export const { useGetTaskQuery } = taskService;
```

**Example — consume in a hook:**

```ts
// features/task-management/_hooks/useTasks.ts
const { data, isLoading, error, refetch } = useTeamTasksQuery(args, { skip: !teamId });
```

**Mutations** use `invalidateOnMutationSuccess()` to refresh related lists after create/update/delete.

### 2. Node API — Axios (analytics & export)

Analytics and file export hit the Node service via typed Axios clients.

| File | Responsibility |
|------|----------------|
| `features/shared/api/index.ts` | `laravelClient` and `nodeClient` with auth interceptor |
| `features/analytics/_api/` | Raw GET/POST calls |
| `features/analytics/_service/` | Thin facade returning unwrapped `data` |
| `features/analytics/_hooks/` | `useState` + `useEffect` for fetch lifecycle |

**When to use which:**

| Use RTK Query | Use Axios + custom hooks |
|---------------|--------------------------|
| Laravel CRUD | Node analytics / blob export |
| Needs cache & invalidation | One-off or manually managed fetches |
| Standard JSON responses | Binary (`responseType: 'blob'`) responses |

### Error handling

| Utility | Use case |
|---------|----------|
| `getApiErrorMessage()` | User-facing message from RTK Query or Axios errors |
| `handleFormApiError()` | Map Laravel `422` field errors onto React Hook Form |
| `toast` (Sonner) | Loading / success / error feedback on mutations |

---

## Form Validation

Validation is **client-first with Zod**, integrated into forms via React Hook Form.

### Layers

| Layer | Tool | When it runs |
|-------|------|--------------|
| Client | Zod schema + `zodResolver` | On submit |
| Server | Laravel validation | On API `422` — mapped back to form fields |

### Schema location

- **Shared fields** (email, password): `features/shared/_schema/`
- **Feature forms**: `features/<feature>/_schema/index.schema.ts`
- Export inferred types: `type FormValues = z.infer<typeof SCHEMA>`

### Standard form pattern

```tsx
const { register, handleSubmit, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(MY_SCHEMA),
    defaultValues: { ... },
});

const onSubmit = async (values: FormValues) => {
    try {
        await mutation(values).unwrap();
        toast.success('Saved');
    } catch (error) {
        const { message } = handleFormApiError(error, setError, 'Failed to save.');
        toast.error(message);
    }
};
```

### Field components

Use `@/components/Fields` (`InputField`, `PasswordField`, `SelectField`, `TextareaField`). They accept an `error` prop bound to `errors.<field>?.message`.

---

## State Management

| State type | Solution | Example |
|------------|----------|---------|
| Server / API | RTK Query cache | Task lists, user lists |
| Auth session | `authSlice` + `localStorage` | Current user, login/logout |
| UI-local | `useState` in hooks/components | Filters, pagination, dialog open state |
| Form | React Hook Form | Dialog forms, login |

On logout, a Redux listener resets the entire RTK Query cache (`api.util.resetApiState()`).

---

## Routing & Authorization

| Layer | File | Purpose |
|-------|------|---------|
| Routes | `routes/index.tsx` | Route tree |
| Lazy loading | `routes/LazyPages.ts` | Code-split page imports |
| Auth guard | `layouts/ProtectedRoutes.tsx` | Redirect unauthenticated users to login |
| Role guard | `canAccess*` utils per feature | Hide nav links & redirect from pages |

**Auth lifecycle:**

1. `useAuthInit` — on load, calls `/auth/me` if a token exists
2. `useLogin` — stores token, dispatches `setCredentials`, navigates to dashboard
3. `useLogout` — clears token, dispatches `logout`, navigates to login

**Role helpers** (import from feature public API):

- `canAccessTeamManagement(user)`
- `canAccessUserManagement(user)`
- `canAccessAnalytics(user)`

---

## UI & Components

| Layer | Location | Notes |
|-------|----------|-------|
| Primitives | `components/ui/` | shadcn/ui — do not edit casually |
| Form fields | `components/Fields/` | Label + input + error message |
| Feature UI | `features/*/_components/` | Domain-specific tables, dialogs, panels |
| Layout | `layouts/` | Header nav, auth shell, suspense wrapper |

Styling uses Tailwind utility classes. Design tokens (`text-muted-foreground`, `bg-card`, etc.) come from the theme in `index.css`.

---

## Adding a New Feature

1. **Scaffold** `features/<name>/` with `_types`, `_schema`, `_service`, `_hooks`, `_components`, `index.ts`.
2. **Define types** in `_types/`.
3. **Add Zod schemas** in `_schema/` for any forms.
4. **Wire API:**
   - Laravel CRUD → inject endpoints in `_service/` using `api` from `BaseApiService.ts`
   - Node endpoints → add Axios calls in `_api/`, facade in `_service/`
5. **Build hooks** in `_hooks/` to encapsulate query args, filters, and mutation side effects.
6. **Build components** in `_components/`.
7. **Export public API** from `index.ts`.
8. **Add a page** in `pages/<name>/` that composes feature components.
9. **Register route** in `config/routes.ts`, `routes/index.tsx`, and `routes/LazyPages.ts`.
10. **Gate access** with a `canAccess*` helper if role-restricted.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

---

## Related Repositories

| Repo | Port (local) |
|------|--------------|
| [task-management-laravel-api](https://github.com/your-username/task-management-laravel-api) | 8000 |
| [task-management-node-services](https://github.com/your-username/task-management-node-services) | 3000 |
