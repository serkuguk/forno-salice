# DDD + Design Matrix Plan (Forno & Slice)

## Summary
Ты строишь DDD-контексты, я натягиваю дизайн из `docs/design` на presentation-слой без нарушения доменных границ.

Опорные документы:
- `docs/ddd-spec.md`
- `docs/angular-ddd-roadmap.md`
- `docs/design/*`

---

## Matrix: Context -> Screens -> Shared -> Design Pattern

### Catalog
- Screens: `home/landing`, `menu/catalog`
- Shared: `button`, `breadcrumbs`, `controls/basic-select`, `charts` (при необходимости промо-метрик)
- Design pattern: `docs/design/forno-home.jsx`, `docs/design/forno-menu.jsx`, `docs/design/forno-shared.jsx`

### Cart
- Screens: `cart`, `cart drawer`
- Shared: `table` (line-items), `button`, `message`, `toast`
- Design pattern: `docs/design/forno-cart.jsx`, `docs/design/forno-shared.jsx` (`CartDrawer`)

### Ordering
- Screens: `checkout`
- Shared: `controls/*`, `form-field`, `button`, `stepper`, `message`, `toast`
- Design pattern: `docs/design/forno-cart.jsx` (`CheckoutScreen`)

### Customer
- Screens: профиль, адреса, история заказов (phase 2)
- Shared: `avatar`, `controls/*`, `table`, `breadcrumbs`
- Design pattern: визуальные токены из `docs/design/forno-tokens.css`, карточные паттерны из `docs/design/forno-home.jsx`

### Kitchen
- Screens: `kitchen board`
- Shared: `table` или card-grid + `button`, `message`, `toast`
- Design pattern: `docs/design/forno-kitchen.jsx`

### Cross-context flow
- Screens: `tracking`
- Shared: `stepper`, `message`, `button`
- Design pattern: `docs/design/forno-tracking.jsx`

---

## Implementation Plan

### 1) Foundation (UI tokens)
- Перенести палитру/типографику/spacing/shadows из `docs/design/forno-tokens.css` в глобальные SCSS токены.
- Ввести 2 шрифтовые роли:
  - editorial для заголовков
  - UI для интерфейса
- Ввести semantic-токены: `surface`, `surface-alt`, `accent`, `danger`, `muted`, `border`.

### 2) App Shell Re-skin (без слома auth)
- Переделать текущие `sidenav/header/footer/body` под стиль Forno.
- Навигацию shell привязать к контекстам: `catalog`, `cart`, `ordering`, `tracking`, `kitchen`.
- Сохранить поведение `login/logout/guard/AuthStateService` без изменения логики.

### 3) Presentation by context (MVP order)
- Phase 1: `catalog`, `cart`, `ordering` (Home/Menu/Cart/Checkout).
- Phase 2: `tracking`.
- Phase 3: `kitchen`.
- Для каждой страницы:
  1. сначала ViewModel/DTO-адаптер в `application`,
  2. затем UI на существующих shared-компонентах.

### 4) DDD boundary enforcement
- `domain` не знает про Angular и дизайн.
- `application` выдает чистые модели для UI (`PageVm`, `ItemVm`).
- `presentation` только рендерит и вызывает use-cases.
- API/Mockoon интеграции остаются в `infrastructure`.

### 5) Migration strategy
- Не делать big-bang: использовать поэтапный переход по роутам.
- После приемки каждого контекста удалять legacy UI этого контекста.
- Сначала обновить layout-shell, чтобы новые экраны сразу были в одном визуальном языке.

---

## Test & Acceptance

- Визуально:
  - desktop/mobile для shell;
  - desktop/mobile для каждой MVP-страницы.
- Функционально:
  - `login/logout/guards` без регрессий;
  - корректные переходы между контекстами.
- Контекстные сценарии:
  - Catalog: фильтры, карточки, добавление в корзину.
  - Cart: qty/update/remove/total.
  - Ordering: валидация checkout, submit flow.
  - Tracking/Kitchen: корректное отображение статусов.
- Технически:
  - `pnpm build` обязателен;
  - unit/integration стабилизируются по ходу миграции.

---

## Assumptions

- Источник истины по дизайну: `docs/design/*`.
- Архитектура контекстов и слоев: `docs/angular-ddd-roadmap.md`.
- Shared-компоненты переиспользуются обязательно; новые создаются только при реальном gap.
- Первый delivery-фокус: `Catalog + Cart + Ordering` (MVP из `docs/ddd-spec.md`).
