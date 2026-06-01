# Skills And Agents Plan

## 1. Skills I Will Use

### `impeccable`

Нужен для UI-направления:

- помочь с дизайн-концептом;
- проверить, чтобы интерфейс не стал шаблонным;
- подготовить дизайн-токены и component inventory.

### `browser`

Нужен позже, когда появится Angular-приложение:

- открывать локальный `localhost`;
- проверять верстку;
- смотреть responsive-поведение.

## 2. Working Agent Roles

Это не отдельные внешние сервисы, а роли, в которых я буду тебе помогать.

### `DDD Architect`

Отвечает за:

- bounded contexts;
- aggregate roots;
- domain rules;
- context map.

### `Angular Structure Guide`

Отвечает за:

- структуру папок;
- naming;
- standalone components;
- routing;
- dependency direction.

### `Application Layer Reviewer`

Отвечает за:

- use cases;
- repository interfaces;
- DTO и mapper boundaries.

### `UI Integration Reviewer`

Отвечает за:

- связь домена и UI;
- state на уровне presentation;
- отсутствие бизнес-логики в шаблонах и компонентах.

### `Mock API Builder`

Отвечает за:

- Mockoon endpoints;
- форму ответов API;
- правдоподобные seed data.

## 3. When Each Role Is Used

1. До кода: `DDD Architect`
2. При создании Angular-структуры: `Angular Structure Guide`
3. При написании use cases: `Application Layer Reviewer`
4. При верстке и экранах: `UI Integration Reviewer` + `impeccable`
5. При интеграции данных: `Mock API Builder`
