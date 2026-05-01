interface POSInput {
  rawIdea: string;
  answers: Record<string, string | string[] | number>;
}

interface CompiledPrompt {
  systemPrompt: string;
  metaJSON: {
    role: string;
    context: string;
    constraints: string[];
    style: {
      tone: string;
      format: string[];
      density: string;
    };
  };
}

function compilePrompt(input: POSInput): CompiledPrompt {
  const { rawIdea, answers } = input;

  const appType = (answers.app_type as string) || 'web';
  const infrastructure = (answers.infrastructure as string) || 'serverless';
  const dataFlow = (answers.data_flow as string) || 'rest';
  const authStrategy = (answers.auth_strategy as string) || 'jwt';
  const stateManagement = (answers.state_management as string) || 'zustand';

  const role = 'Senior Full-stack Developer & Software Architect.';
  const task = 'Build a production-ready application based on the provided specs.';
  
  // Performance & Scalability based on Infrastructure
  let performanceScalability = '';
  switch (infrastructure) {
    case 'serverless':
      performanceScalability = 'Utilize serverless functions for automatic scaling, implement edge caching for static assets, use CDN for global distribution, and optimize cold start times with provisioned concurrency.';
      break;
    case 'docker':
      performanceScalability = 'Use container orchestration with Kubernetes or Docker Swarm, implement horizontal pod autoscaling, use Redis for distributed caching, and configure resource limits and health checks.';
      break;
    case 'edge':
      performanceScalability = 'Deploy to edge locations for ultra-low latency, use edge functions for compute-at-the-edge, implement smart routing based on geographic location, and cache aggressively at edge nodes.';
      break;
    default:
      performanceScalability = 'Implement caching strategies, use CDN for static assets, optimize database queries, and apply code splitting for bundle optimization.';
  }

  // Security Checklist based on Auth Selection
  let securityChecklist = '';
  switch (authStrategy) {
    case 'jwt':
      securityChecklist = 'Implement HTTP-only cookies for token storage, use short-lived access tokens with refresh tokens, validate token signatures and expiration, implement rate limiting on auth endpoints, and use HTTPS exclusively.';
      break;
    case 'oauth2':
      securityChecklist = 'Use PKCE for public clients, validate state parameters to prevent CSRF, implement proper scope minimization, secure redirect URI validation, and store client secrets securely using environment variables.';
      break;
    case 'session':
      securityChecklist = 'Use secure, HttpOnly cookies for session IDs, implement CSRF tokens, set proper SameSite cookie attributes, rotate session IDs after login, and implement session expiration and idle timeout.';
      break;
    default:
      securityChecklist = 'Implement input validation, use parameterized queries to prevent SQL injection, set secure HTTP headers, implement CORS policies correctly, and regularly update dependencies.';
  }

  const specs = `App Type: ${appType}
Infrastructure: ${infrastructure}
Data Flow: ${dataFlow}
Auth Strategy: ${authStrategy}
State Management: ${stateManagement}`;

  // Deeply nested folder structure following Domain-Driven Design
  const deliverables = `Complete application with Domain-Driven Design structure:
/src
  /domains
    /[domain-name]  // e.g., /users, /orders, /products
      /application    // Use cases, DTOs, application services
      /domain         // Entities, value objects, domain services, aggregates
      /infrastructure // Repositories, external services, database mappers
      /interfaces     // Controllers, API handlers, GraphQL resolvers
      /components     // UI components (if applicable)
  /shared
    /kernel           // Shared utilities, constants, types
    /infrastructure   // Database, logging, caching, external service clients
  /types              // Shared TypeScript types and interfaces
  /config             // Configuration files
  /tests              // Unit, integration, and e2e tests
  /docs               // Documentation`;

  const systemPrompt = `## Role
${role}

## Task
${task}

## Specs
${specs}

## Performance & Scalability
${performanceScalability}

## Security Checklist
${securityChecklist}

## Deliverables
${deliverables}`;

  const metaJSON = {
    role,
    context: specs,
    constraints: [],
    style: {
      tone: 'Professional',
      format: ['Markdown'],
      density: 'Detailed',
    },
  };

  return {
    systemPrompt,
    metaJSON,
  };
}

async function copyToClipboard(prompt: string): Promise<void> {
  await navigator.clipboard.writeText(prompt);
}

export { compilePrompt, copyToClipboard };
export type { POSInput, CompiledPrompt };