# Multi-Brand Angular Architecture

## System Overview

```mermaid
graph TD
    subgraph "Client Zone"
        U[User] --> R(Angular Router)
        R --> A(App Component)
        A -- "loads global brand" --> BS(Brand Service)
        BS -- "provides brand state" --> TS(Theme Service)
        TS --> CSS[CSS Custom Properties]

        BS -- "provides brand$" --> HRX(Hero RxJS Component)
        HRX -- "requests hero content" --> BS
        BS -- "provides brand signal" --> HSG(Hero Signals Component)
        HSG -- "requests hero content" --> BS

        HRX --> UI[Material UI Components]
        HSG --> UI
        UI --> U
    end

    subgraph "Application Zone"
        BFF[Backend For Frontend]
    end

    subgraph "Data Zone"
        AS[AWS AppSync]
        S3CF[Amazon S3/CloudFront]
        BD[(Brand Data)]
        HCD[(Hero Content Data)]

        AS --> BD
        AS --> HCD
    end

    BS --> BFF
    BFF --> AS
    BFF --> S3CF
    S3CF -- "serves assets" --> Browser[Browser Asset Fetcher]
    Browser --> U
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as Angular Router
    participant A as App Component
    participant UI as UI Components
    participant DOM as DOM/CSS
    participant BS as Brand Service
    participant TS as Theme Service
    participant BFF as Backend For Frontend

    U->>R: Visit ?brand=acme
    R->>A: Activate with query param
    A->>BS: loadBrand('acme')
    BS->>BFF: Request Brand & Content Data
    BFF-->>BS: Aggregated brand data
    BS->>BS: Update internal state (Subjects)

    alt Reactive Updates
        BS-->>UI: UI Components react to new brand state
        UI->>U: Render brand name, logo, etc.

        BS-->>TS: Theme Service reacts to new brand state
        TS->>DOM: Apply CSS variables for theme
    end
```

## Key Components

### 1. Brand Service
- **Purpose**: Central brand management and data orchestration
- **Technology**: Angular Signals for reactive state
- **Responsibilities**:
  - Fetch brand configuration and content data via BFF
  - Provide aggregated brand and content data (including signed asset URLs) to components

### 2. Dynamic Theming
- **Method**: CSS custom properties + Angular Material
- **Benefits**: Runtime theme switching without rebuilds
- **Implementation**: CSS variables applied by the App Component (or a dedicated theming component) via host bindings.

### 3. Backend For Frontend (BFF)
- **Technology**: Node.js with Express.js (example)
- **Purpose**: Securely aggregate and transform data for the frontend.
- **Endpoints**: Unified API endpoint for brand and content data.
- **Responsibilities**:
  - Authenticate and authorize requests from the client.
  - Orchestrate calls to AWS AppSync for structured data.
  - Generate CloudFront Signed URLs for assets from S3/CloudFront.
  - Aggregate and transform data into a format optimized for the frontend.

### 4. AWS AppSync
- **Purpose**: Real-time GraphQL API for structured content delivery.
- **Role**: Provides brand configuration and content metadata.

### 5. Amazon S3/CloudFront
- **Purpose**: Scalable and performant storage and delivery of media assets.
- **Role**: Stores and delivers images (logos, hero images) via CloudFront Signed URLs.

## Brand Routing Strategy

Current implementation uses query parameters:
- `?brand=acme` → ACME Corp branding
- `?brand=globex` → Globex Industries branding

Alternative approaches:
- Subdomain routing: `acme.example.com`
- Path-based routing: `/acme/home`
- Header-based detection

## Technology Choices

### Angular Signals vs RxJS
- **Chosen**: Angular Signals
- **Reason**: Simpler state management, better performance
- **Alternative**: RxJS Observables for complex async operations

### CSS Custom Properties vs SCSS Variables
- **Chosen**: CSS Custom Properties
- **Reason**: Runtime theme switching capability
- **Implementation**: CSS variables are dynamically updated by the App Component (or a dedicated theming component) via host bindings.
- **Alternative**: SCSS with build-time compilation

### Standalone Components vs NgModules
- **Chosen**: Standalone Components
- **Reason**: Angular 17 best practice, simpler dependency management