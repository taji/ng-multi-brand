You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- Extract shared models, such as interfaces and types, into their own dedicated files (e.g., `*.interface.ts`) and import them where needed.

## Angular Best Practices (Angular v17)

- Always use standalone components. Explicitly set `standalone: true` in component, directive, and pipe decorators.
- Use RxJS for asynchronous state management and data streams. Use Signals for fine-grained reactivity within components where appropriate.
- Implement lazy loading for feature routes.
- Use the `host` object in `@Component` or `@Directive` for host bindings instead of `@HostBinding` and `@HostListener` decorators.
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility.
- Inject services as `private` dependencies. The component should expose its own properties (Observables for RxJS, Signals for Signals) for the template to bind to, rather than exposing the entire service publicly.
- Use external template (`.html`) and style (`.scss`) files. Avoid inline templates and styles.
- Prefer `input()` and `output()` functions for new components, but `@Input()` and `@Output()` decorators are also valid.
- Use RxJS operators for derived state from observables, and `computed()` for derived state from signals.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator.
- Prefer Reactive forms instead of Template-driven ones.
- Do NOT use `ngClass`, use `class` bindings instead.
- Do NOT use `ngStyle`, use `style` bindings instead.

## State Management

- Use RxJS for managing asynchronous data streams and component-level state.
- Use Signals for fine-grained reactivity within components where appropriate.
- Use RxJS operators for derived state from observables, and `computed()` for derived state from signals.
- Keep state transformations pure and predictable.
- When using Signals, do NOT use `mutate`, use `update` or `set` instead.

## Templates

- Keep templates simple and avoid complex logic.
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
- Use the async pipe to handle observables.

## Services

- Design services around a single responsibility.
- Use the `providedIn: 'root'` option for singleton services.
- Prefer `inject()` function for dependency injection in functions and providers, and constructor injection for classes.

## Testing Best Practices

- **Verification Workflow:** After making code changes, always run the project's build and test commands to verify correctness and prevent regressions.
  - To check for compilation and template errors without starting the dev server, run `npm run build` in the `simple-multi-brand-solution` directory.
  - To run unit tests, execute `npm test` in the `simple-multi-brand-solution` directory.

- **Component Testing Strategy:**
  - **Prefer Shallow Tests:** When testing a component, aim for shallow tests by mocking its direct dependencies (services, child components) rather than instantiating their full implementations. This isolates the component under test and prevents its test from breaking due to changes in its dependencies.
  - **Thin Components (UI-focused):** For components that primarily process UI events, update view model properties (Observables/Signals), and delegate complex logic to services, use a `TestBed`-based approach. These tests ensure the component correctly binds data to the template, handles UI interactions, and calls appropriate service methods.
  - **Thick Components (Logic-heavy):** If a component contains significant business logic, consider the following:
    1.  **Refactor First:** Consult with the developer to explore refactoring the component into a thinner, UI-focused component by moving complex logic into dedicated services.
    2.  **Isolated Tests (if refactoring not feasible):** If refactoring is not immediately feasible, consider using isolated component class tests (direct instantiation) alongside `TestBed`-based tests. Isolated tests can cover the complex logic efficiently, while `TestBed` tests ensure the UI integration.
