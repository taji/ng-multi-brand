# Multi-Brand Angular Architecture

## System Overview

```mermaid
graph TB
    %% make connectors visible everywhere
    linkStyle default stroke:#1E90FF,stroke-width:2px;

    subgraph "Client Zone"
        User[User Browser]
        Router[Angular Router]
        App[App Component]
        QueryParams[Query Parameters]
        BrandResolver[Brand Resolution]
        UI[Material UI Components]
        BrandService[Brand Service]
        Signals[Angular Signals]
        Theme[Dynamic Theming]
        CSS[CSS Custom Properties]
        BrowserAssetFetcher[Browser Asset Fetcher]

        User --> Router
        Router --> App
        App --> BrandService
        App --> UI
        BrandService --> Signals
        Signals --> Theme
        Theme --> CSS
        Router --> QueryParams
        QueryParams --> BrandResolver
        BrandResolver --> BrandService
        App --> BrowserAssetFetcher
    end

    subgraph "Application Zone"
        BFF[Backend For Frontend]
    end

    subgraph "Data Zone"
        AS[AWS AppSync]
        S3CF[Amazon S3/CloudFront]
        BrandData[(Brand Data)]
        ContentData[(Content Data)]

        AS --> BrandData
        AS --> ContentData
        BrowserAssetFetcher --> S3CF
    end

    BrandService --> BFF
    BFF --> AS
    BFF --> S3CF
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App Component<br>(Client Zone)
    participant DOM as DOM/CSS<br>(Client Zone)
    participant BS as Brand Service<br>(Client Zone)
    participant BFF as Backend For Frontend<br>(Application Zone)
    participant AS as AWS AppSync<br>(Data Zone)
    participant S3CF as Amazon S3/CloudFront<br>(Data Zone)
    
    U->>A: Visit ?brand=acme
    A->>BS: loadBrand('acme')
    BS->>BFF: Request Brand & Content Data
    BFF->>AS: GraphQL Query (Brand Config)
    AS-->>BFF: Brand config (includes asset keys)
    BFF->>AS: GraphQL Query (Content Data)
    AS-->>BFF: Content data (includes asset keys)
    BFF->>BFF: Generate CloudFront Signed URLs for assets
    BFF-->>BS: Aggregated Brand & Content Data (with signed URLs)
    BS->>A: Update component (with theme data)
    A->>DOM: Apply CSS variables
    A->>S3CF: GET Asset (using signed URL)
    S3CF-->>A: Asset data
    A->>U: Render branded UI
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