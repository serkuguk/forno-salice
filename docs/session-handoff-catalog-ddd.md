# DDD Progress Handoff (Shared Kernel + Catalog v1)

## Context
- Project: `forno-salice`
- Date: 2026-05-28
- Goal: Start DDD Phase 1 in order (`Catalog -> Cart -> Ordering`) without applying full design to all contexts at once.

## What Was Created

### 1. Shared Kernel (base primitives)
Created under `src/app/core/shared-kernel`:
- `errors/domain-error/domain-error.ts`
- `types/entity-id/entity-id.ts`
- `types/result/result.ts`
- `value-objects/money/money.value-object.ts`

Status:
- No imports from `contexts/*`.
- No Angular dependencies in shared-kernel classes.

### 2. Catalog Context skeleton
Created under `src/app/contexts/catalog`:
- `domain/entities/menu-item.entity.ts`
- `domain/entities/pizza-template.entity.ts`
- `domain/repositories/catalog.repository.ts`
- `application/dto/catalog-item.vm.ts`
- `application/mappers/catalog-item.mapper.ts`
- `application/use-cases/get-catalog-items.use-case.ts`
- `infrastructure/api/catalog-api.dto.ts`
- `infrastructure/repositories/http-catalog.repository.ts`
- `presentation/components/catalog-page/catalog-page.component.ts`
- `presentation/components/catalog-page/catalog-page.component.html`
- `presentation/components/catalog-page/catalog-page.component.scss`

### 3. Route wiring
Updated `src/app/app.routes.ts`:
- Route `/menu` now loads `CatalogPageComponent` instead of stub.

## Important Refactor Done (Angular 21 style)
All `async/Promise` usage in created Catalog files was replaced with Observable + signals approach.

### Current flow
- `CatalogPageComponent` (signals state) -> `GetCatalogItemsUseCase` (Observable) -> `CatalogRepository` port (Observable) -> `HttpCatalogRepository` adapter (`HttpClient` + RxJS map).

### Component style
- Uses Angular control flow in template: `@if`, `@for`.
- Uses `signal(...)` state.
- Uses RxJS subscription with:
  - `takeUntilDestroyed(...)`
  - `catchError(...)`
  - `finalize(...)`

## Quick Verification Completed
- Search check: no `async`/`Promise<` remains in `src/app/contexts/catalog` and `src/app/core/shared-kernel` for created files.

## Known Notes
- `DomainError` currently may be minimal in codebase; if strict contract required, align it to include both `code` and `message`.
- `Result<T>` and `EntityId` can be tightened later (trim validation, stronger typing), but base scaffolding exists.

## Next Recommended Step
Start `Cart` context MVP in the same architectural style:
1. `domain`: `Cart`, `CartLine`, invariants (merge identical config, totals in domain).
2. `application`: add/update/remove line use cases.
3. `infrastructure`: repository adapter.
4. `presentation`: replace `/cart` stub with real page using signals + RxJS.
