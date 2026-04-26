interface POSInput {
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
  const { answers } = input;

  const projectName = (answers.project_name as string) || '';
  const concept = (answers.concept as string) || '';
  const persona = (answers.persona as string) || 'Senior Architect';
  const appType = (answers.app_type as string) || 'Web App';
  const infrastructureRaw = (answers.infrastructure as string) || 'Serverless';
  const dataFlowRaw = (answers.data_flow as string) || 'REST';
  const authRaw = (answers.auth as string) || 'JWT';
  const stateRaw = (answers.state as string) || 'Zustand';

  // Normalize keys for switches
  const infrastructure = infrastructureRaw.toLowerCase().replace(' runtime', '').replace('ized', '');
  const authStrategy = authRaw.toLowerCase().replace('-based', '').replace('oauth2', 'oauth2');

  // Set role based on persona
  let role = '';
  switch (persona) {
    case 'Senior Architect':
      role = `Senior software architect specializing in system design, scalability, and technical leadership for complex applications${projectName ? `, specifically building ${projectName}` : ''}.`;
      break;
    case 'Security Auditor':
      role = 'Cybersecurity expert focused on threat modeling, vulnerability assessment, compliance, and robust protection strategies.';
      break;
    case 'DevOps Engineer':
      role = 'Infrastructure specialist in CI/CD automation, cloud deployment, containerization, and operational excellence.';
      break;
    default:
      role = 'Senior Full-stack Developer & Software Architect.';
  }



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
      securityChecklist = `- Implement HTTP-only cookies for token storage
- Use short-lived access tokens with refresh tokens
- Validate token signatures and expiration
- Implement rate limiting on auth endpoints
- Use HTTPS exclusively`;
      break;
    case 'oauth2':
      securityChecklist = `- Use PKCE for public clients
- Validate state parameters to prevent CSRF
- Implement proper scope minimization
- Secure redirect URI validation
- Store client secrets securely using environment variables`;
      break;
    case 'session':
      securityChecklist = `- Use secure, HttpOnly cookies for session IDs
- Implement CSRF tokens
- Set proper SameSite cookie attributes
- Rotate session IDs after login
- Implement session expiration and idle timeout`;
      break;
    default:
      securityChecklist = `- Implement input validation
- Use parameterized queries to prevent SQL injection
- Set secure HTTP headers
- Implement CORS policies correctly
- Regularly update dependencies`;
  }

  const technicalChecklists = `### Performance & Scalability
${performanceScalability}

### Security Checklist
${securityChecklist}`;

  const techSpecsTable = `| Spec              | Value              |
|-------------------|--------------------|
| Project Name      | ${projectName}    |
| Concept           | ${concept}        |
| App Type          | ${appType}        |
| Infrastructure    | ${infrastructureRaw} |
| Data Flow         | ${dataFlowRaw}    |
| Auth Strategy     | ${authRaw}        |
| State Management  | ${stateRaw}       |`;

  // Deeply nested folder structure following Domain-Driven Design
  const dddStructure = `/src
  /domains
    /[domain-name]
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

  const systemPrompt = `## Project Information
Project Name: ${projectName}
Project Concept: ${concept}

## Tech Specs
${techSpecsTable}

## DDD Folder Structure
${dddStructure}

## Technical Checklists
${technicalChecklists}

## Business Logic Snippets`;

  const metaJSON = {
    role,
    context: `Project Name: ${projectName}, Concept: ${concept}, App Type: ${appType}, Infrastructure: ${infrastructureRaw}, Data Flow: ${dataFlowRaw}, Auth: ${authRaw}, State: ${stateRaw}`,
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