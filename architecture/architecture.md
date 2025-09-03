# Multi-Brand Angular Architecture

## System Overview

```mermaid
graph TB
    User[User Browser] --> Router[Angular Router]
    Router --> App[App Component]
    App --> BrandService[Brand Service]
    BrandService --> CMS[Mock CMS Server]
    
    subgraph "Angular Application"
        App --> UI[Material UI Components]
        BrandService --> Signals[Angular Signals]
        Signals --> Theme[Dynamic Theming]
        Theme --> CSS[CSS Custom Properties]
    end
    
    subgraph "Mock CMS"
        CMS --> BrandAPI[Brand API]
        CMS --> ContentAPI[Content API]
        BrandAPI --> BrandData[(Brand Data)]
        ContentAPI --> ContentData[(Content Data)]
    end
    
    subgraph "Brand Detection"
        Router --> QueryParams[Query Parameters]
        QueryParams --> BrandResolver[Brand Resolution]
        BrandResolver --> BrandService
    end
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App Component
    participant BS as Brand Service
    participant CMS as Mock CMS
    participant DOM as DOM/CSS
    
    U->>A: Visit ?brand=acme
    A->>BS: loadBrand('acme')
    BS->>CMS: GET /api/brands/acme
    CMS-->>BS: Brand config
    BS->>CMS: GET /api/content/acme
    CMS-->>BS: Content data
    BS->>DOM: Apply CSS variables
    BS->>A: Update signals
    A->>U: Render branded UI
```

## Key Components

### 1. Brand Service
- **Purpose**: Central brand management
- **Technology**: Angular Signals for reactive state
- **Responsibilities**:
  - Fetch brand configuration from CMS
  - Apply dynamic theming via CSS custom properties
  - Manage brand-specific content

### 2. Dynamic Theming
- **Method**: CSS custom properties + Angular Material
- **Benefits**: Runtime theme switching without rebuilds
- **Implementation**: CSS variables updated via JavaScript

### 3. Mock CMS
- **Technology**: Express.js server
- **Endpoints**:
  - `GET /api/brands/:id` - Brand configuration
  - `GET /api/content/:brandId` - Brand-specific content
- **Data**: JSON responses with colors, logos, text, images

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
- **Alternative**: SCSS with build-time compilation

### Standalone Components vs NgModules
- **Chosen**: Standalone Components
- **Reason**: Angular 17 best practice, simpler dependency management