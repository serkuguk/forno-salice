# Session Notes

## Snapshot
- Date: 2026-05-27
- Time: 22:20 (Europe/Madrid)
- Branch: N/A
- Commit: N/A

## Current Objective
- Завершить Forno Home Reskin v1 и перейти к поэтапной реализации DDD-контекстов (Catalog -> Cart -> Ordering).

## Architecture Decisions (Locked)
- Scope текущего шага: Home shell only (без полного покрытия всех контекстных экранов).
- Bottom nav всегда видим (desktop + mobile) по референсу `docs/design/screenshots/01-home.png`.
- До Phase 1 контекстов используются guarded stub routes: `/menu`, `/build`, `/kitchen`, `/cart`.
- Logout обязателен в новом top-nav и использует текущий `AuthStateService.logout()` flow.
- Legacy shell (`app-sidenav/app-header/app-body/app-footer`) убран из App root; корень рендерит только `router-outlet`.

## Completed in This Session
- Реализован новый Forno shell (sticky top nav + fixed bottom nav + active tab states + logout).
- Home (`/dashboard`) перестроен под Forno visual baseline из `docs/design/forno-home.jsx` и `01-home.png`.
- Добавлены guarded stub pages/routes для `/menu`, `/build`, `/kitchen`, `/cart`.
- Токены в `styles.scss` выровнены с `docs/design/forno-tokens.css` с backward-compatible aliases.
- App root упрощен до `router-outlet` с сохранением auth init на `NavigationEnd`.

## Open Work (Priority Order)
1. Начать DDD Phase 1 для Catalog: создать контекстный каркас (`domain/application/infrastructure/presentation`) и первый `GetCatalogItemsUseCase` + PageVm адаптер.
2. Заменить stub `/menu` на реальный Catalog screen с shared-компонентами (`button`, `breadcrumbs`, `controls/basic-select`) и Forno-pattern из `forno-menu.jsx`.
3. Подготовить Cart context MVP: line-items, qty/update/remove/total, затем заменить stub `/cart`.

## Known Issues / Risks
- Jest test-инфра нестабильна: локально падает на резолве `@angular/common/http`, это блокирует надежную unit-валидацию текущих изменений.
- Визуал Home близок к baseline, но может требовать pixel-tuning (типографика/отступы/масштаб hero pizza) после сравнения со скриншотами на нескольких разрешениях.

## Verification Status
- Build: pass (`pnpm build`), есть budget warnings без build errors.
- Tests: blocked (`pnpm test -- app.component.spec.ts` падает из-за test-infra module resolution, не из-за бизнес-логики изменений).
- Manual: проверен guard-redirect (`/dashboard` -> `/login` для неавторизованного), проверены top/bottom nav и переходы на stub routes.

## References
- DDD spec: `docs/ddd-spec.md`
- Roadmap: `docs/angular-ddd-roadmap.md`
- Design source: `docs/design/`
- Latest visual baseline: `docs/design/screenshots/01-home.png`

## How To Continue (Next Chat Prompt)
Продолжай с DDD Phase 1 для Catalog: создай context-структуру `src/app/contexts/catalog/{domain,application,infrastructure,presentation}`, добавь `GetCatalogItemsUseCase` + `PageVm` адаптер, затем замени stub `/menu` на реальный Catalog screen в стиле `docs/design/forno-menu.jsx` без изменений domain-правил других контекстов.
