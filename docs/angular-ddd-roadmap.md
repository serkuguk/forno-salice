# Angular + DDD Roadmap

## 1. Learning Goal

Построить Angular-приложение так, чтобы:

- UI не обращался к API напрямую;
- бизнес-правила жили в `domain` и `application`;
- bounded contexts были видны прямо в структуре папок.

## 2. Final Target Structure

```text
src/
  app/
    core/
      http/
      shared-kernel/
      layout/
    contexts/
      catalog/
        domain/
          entities/
          value-objects/
          repositories/
          services/
        application/
          use-cases/
          dto/
          mappers/
        infrastructure/
          api/
          repositories/
        presentation/
          pages/
          components/
          store/
      cart/
        domain/
        application/
        infrastructure/
        presentation/
      ordering/
        domain/
        application/
        infrastructure/
        presentation/
      customer/
        domain/
        application/
        infrastructure/
        presentation/
      kitchen/
        domain/
        application/
        infrastructure/
        presentation/
```

## 3. Step-By-Step Build Plan

### Step 1. Create Workspace

Команда:

```bash
npx @angular/cli@latest new forno-slice --routing --style=scss
```

Что изучаем:

- базовую структуру Angular;
- standalone components;
- маршрутизацию.

### Step 2. Create High-Level Folders

Сначала руками создаем:

- `core`
- `contexts`
- `shared-kernel`

Что изучаем:

- разницу между техническим и доменным делением;
- почему `catalog` важнее, чем папка `services`.

### Step 3. Implement Shared Kernel

Создаем общие value objects и базовые типы:

- `Money`
- `EntityId`
- `DomainError`
- `Result<T>`

Что изучаем:

- где заканчивается shared kernel;
- почему туда нельзя складывать все подряд.

### Step 4. Start With Catalog Context

Создаем первый контекст:

- `contexts/catalog/domain`
- `contexts/catalog/application`
- `contexts/catalog/infrastructure`
- `contexts/catalog/presentation`

Первые артефакты:

- `MenuItem` entity
- `PizzaTemplate` entity
- `CatalogRepository` interface
- `GetCatalogItemsUseCase`
- `HttpCatalogRepository`
- `CatalogPageComponent`

### Step 5. Add Cart Context

Первые артефакты:

- `Cart` aggregate
- `CartLine`
- `AddItemToCartUseCase`
- `ChangeCartLineQuantityUseCase`
- `CartRepository`

Что изучаем:

- aggregate root;
- инварианты корзины;
- почему `subtotal` считается в домене.

### Step 6. Connect Catalog To Cart

Поток:

`Catalog UI -> Application Use Case -> Cart Aggregate -> Repository -> Presentation State`

Что изучаем:

- как UI вызывает use case вместо "толстого сервиса";
- как маппятся DTO в доменные объекты.

### Step 7. Add Ordering Context

Первые артефакты:

- `Order` aggregate
- `Address` value object
- `PhoneNumber` value object
- `PlaceOrderUseCase`
- `OrdersRepository`

Что изучаем:

- переход из временной корзины в оформленный заказ;
- жизненный цикл заказа.

### Step 8. Add Customer Context

Первые артефакты:

- `CustomerProfile`
- `SavedAddress`
- `GetOrderHistoryUseCase`

Что изучаем:

- отдельный bounded context для клиента;
- повторное использование заказов без смешивания ответственности.

### Step 9. Add Kitchen Context

Первые артефакты:

- `KitchenOrderBoard`
- `AdvanceKitchenOrderStatusUseCase`

Что изучаем:

- другой язык модели в другом контексте;
- почему кухня не обязана знать весь checkout.

### Step 10. Refactor Into Better Boundaries

После первого прохода проверяем:

- нет ли доменной логики в компонентах;
- нет ли `HttpClient` в `domain` и `application`;
- нет ли "god service", который делает все.

## 4. What I Will Show You Practically

На каждом этапе я могу помогать так:

1. сказать, какие папки создать;
2. дать команды Angular CLI;
3. объяснить, что кладем в каждый слой;
4. вместе написать 1-2 ключевых класса;
5. проверить, не нарушили ли мы DDD-границы.

## 5. Order Of Real Work

Рекомендуемый практический порядок:

1. `shared-kernel`
2. `catalog`
3. `cart`
4. `ordering`
5. `customer`
6. `kitchen`
7. интеграционные улучшения

## 6. Common Mistakes

- Делить проект по типам файлов: `components`, `models`, `services`.
- Класть бизнес-правила в Angular component.
- Называть DTO как доменные сущности и смешивать их.
- Делать один `ApiService` на весь проект.
- Вычислять цену только в шаблоне или в presentation state.

## 7. Study Format

Я предлагаю двигаться циклами:

1. Ты создаешь папки и базовые файлы.
2. Я проверяю архитектуру.
3. Потом мы реализуем один use case.
4. Потом связываем его с UI.
5. Потом фиксируем, какое DDD-правило ты изучил на этом шаге.
