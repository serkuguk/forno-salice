# Правила использования shared-компонентов

Документ фиксирует практику использования компонентов из `src/app/shared/components` после удаления `basic-example`.

## 1) Подключение standalone-компонентов

- Каждый shared-компонент подключается напрямую в `imports` у standalone-компонента.
- Используем точечные импорты, без wildcard и без промежуточных demo-модулей.

```ts
imports: [
  ReactiveFormsModule,
  FormFieldComponent,
  BasicInputComponent,
  BasicSelectComponent,
  ButtonComponent
]
```

## 2) FormField + контролы

- `FormFieldComponent` обязателен для полей, где нужны label, error-state и единый отступ.
- Внутри `FormFieldComponent` размещаем только один управляющий контрол (`BasicInputComponent`, `BasicSelectComponent`, `PasswordInputComponent`, `TextareaInputComponent`).
- Для inline-вида пробрасываем единый флаг (`isInline`) на уровень формы и контролов.

## 3) Reactive Forms и signals

- Базовый паттерн: `FormBuilder` + `markAllAsTouched()` перед submit.
- При невалидной форме не отправляем запросы и не мутируем состояние.
- Для производных значений UI используем `signal/computed` или `toSignal` от `valueChanges`.

```ts
onSubmit() {
  this.form.markAllAsTouched();
  this.form.updateValueAndValidity();
  if (this.form.invalid) return;
}
```

## 4) Входные данные компонентов

- `TableComponent`: передаем иммутабельные `rows`/`columns`; изменения строки применяем через создание нового массива.
- `BasicSelectComponent`/`MultiSelectComponent`: `options` передаются в стабильном формате `{ name, code }` или в согласованном контракте.
- `ChartsComponent`: `data` и `options` всегда валидные для PrimeNG Chart, без прямого обращения к DOM.
- Колбэки (`row change`, `submit`, `selection change`) должны быть чистыми и не содержать скрытых сайд-эффектов.

## 5) UX и валидация

- Ошибки формы показываем только после `touched`/`submit`.
- Кнопки отправки отключаем при `loading` или невалидной форме.
- Ошибки сервера выводим единообразно через shared message/toast-компоненты.

## Do / Don’t

- Do: хранить логику формы в компоненте страницы, а shared-компоненты оставлять максимально презентационными.
- Do: использовать `ChangeDetectionStrategy.OnPush` для shared и страниц.
- Don’t: импортировать shared-компоненты через удаленные demo-пути или feature-прослойки.
- Don’t: связывать shared-компоненты с конкретным state-manager (NgRx, и т.д.).
