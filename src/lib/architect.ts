import { CompiledPrompt, AnswerMap, WizardStep } from './schema';

// Color palette mappings
const getColorPalette = (colorStyle: string) => {
  switch (colorStyle) {
    case 'Dark':
      return {
        primary: '#1f2937', // gray-800
        secondary: '#374151', // gray-700
        accent: '#10b981', // emerald-500
        text: '#f9fafb', // gray-50
        background: '#111827', // gray-900
      };
    case 'Light':
      return {
        primary: '#ffffff', // white
        secondary: '#f9fafb', // gray-50
        accent: '#059669', // emerald-600
        text: '#111827', // gray-900
        background: '#f3f4f6', // gray-100
      };
    case 'High Contrast':
      return {
        primary: '#000000', // black
        secondary: '#ffffff', // white
        accent: '#ff0000', // red
        text: '#ffffff', // white
        background: '#000000', // black
      };
    case 'Pastel':
      return {
        primary: '#fef3c7', // yellow-100
        secondary: '#dbeafe', // blue-100
        accent: '#a7f3d0', // emerald-200
        text: '#374151', // gray-700
        background: '#f0fdf4', // emerald-50
      };
    default:
      return {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#10b981',
        text: '#f9fafb',
        background: '#111827',
      };
  }
};

// Project Signature generator
const getProjectSignature = (appType?: string, appVibe?: string, colorStyle?: string): string => {
  const type = cleanValue(appType) || 'Web App';
  const vibe = cleanValue(appVibe) || 'Minimal';
  const color = cleanValue(colorStyle) || 'Dark';

  const vibeDescriptors: Record<string, string> = {
    'Minimal': 'Air',
    'Bold': 'Power',
    'Playful': 'Joy',
    'Corporate': 'Trust',
  };

  const typeDescriptors: Record<string, string> = {
    'Mobile App': '📱 Mobile',
    'Web App': '🌐 Web',
    'Desktop': '💻 Desktop',
  };

  const colorDescriptors: Record<string, string> = {
    'Dark': 'Night',
    'Light': 'Dawn',
    'High Contrast': 'Clarity',
    'Pastel': 'Harmony',
  };

  const typeDesc = typeDescriptors[type] || type;
  const vibeDesc = vibeDescriptors[vibe] || vibe;
  const colorDesc = colorDescriptors[color] || color;

  const signature = `${typeDesc} ${vibeDesc} × ${colorDesc}`;
  return signature;
};

// Layout CSS mappings
const getLayoutCSS = (layoutFeel: string, appType?: string) => {
  const isMobile = appType === 'Mobile App';

  switch (layoutFeel) {
    case 'Compact':
      return `.container { max-width: ${isMobile ? '90vw' : '1024px'}; margin: 0 auto; padding: 0 4px; }
.component { margin-bottom: 4px; padding: 8px; }
.section { margin-bottom: 8px; }`;
    case 'Comfortable':
      return `.container { max-width: ${isMobile ? '95vw' : '1200px'}; margin: 0 auto; padding: 0 16px; }
.component { margin-bottom: 16px; padding: 24px; }
.section { margin-bottom: 24px; }`;
    case 'Spacious':
      return `.container { max-width: ${isMobile ? '100vw' : '1400px'}; margin: 0 auto; padding: 0 24px; }
.component { margin-bottom: 24px; padding: 32px; }
.section { margin-bottom: 32px; }`;
    default:
      return `.container { max-width: ${isMobile ? '95vw' : '1200px'}; margin: 0 auto; padding: 0 16px; }
.component { margin-bottom: 16px; padding: 24px; }
.section { margin-bottom: 24px; }`;
  }
};

function formatValue(value: string | string[] | undefined): string {
  if (value === undefined || value === '') return 'Not specified';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function ynValue(value: string | string[] | undefined): string {
  if (!value || String(value).trim() === '') return 'Not specified';
  const v = String(value).toLowerCase();
  return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : String(value);
}

/**
 * Normalizes an answer into a usable string, treating undefined, empty,
 * whitespace-only, and the "Not specified" placeholder as missing (returns '').
 * This prevents placeholder text from leaking into generated prose such as
 * "Meet Not specified accessibility standards".
 */
function cleanValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    const joined = value
      .map((entry) => String(entry).trim())
      .filter((entry) => entry.length > 0)
      .join(', ');
    return joined.toLowerCase() === 'not specified' ? '' : joined;
  }
  const trimmed = String(value ?? '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'not specified') return '';
  return trimmed;
}

// Matches an existing Markdown bullet ("-", "*", "+", "•") or an ordered marker
// ("1.", "1)") so pasted lists are not double-prefixed.
const BULLET_PREFIX = /^\s*(?:[-*+•‣◦]|\d+[.)])\s+/;

// Platform-specific guidance. Resolved exclusively so exactly one set can ever
// be emitted for a given platform selection.
const PLATFORM_NOTES: Record<'mobile' | 'web' | 'desktop', string> = {
  mobile: `### Mobile-Specific Notes

- **Touch Interactions**: Prioritize touch-optimized UI with proper hit targets
- **Native Feel**: Follow platform conventions (iOS HIG, Material Design)
- **Performance**: Optimize for mobile devices (bundle size, memory)`,
  web: `### Web-Specific Notes

- **Responsive Design**: Ensure layout works across screen sizes
- **SEO**: Implement metadata, semantic HTML, and performance optimizations
- **Accessibility**: WCAG compliance with keyboard navigation`,
  desktop: `### Desktop-Specific Notes

- **Window Management**: Handle resizing, focus, and native menus if applicable
- **Offline-First**: Consider local data storage and sync strategies
- **Cross-Platform**: Ensure compatibility with target OS`,
};

/**
 * Maps the selected platform (e.g. "Web App", "Desktop") to its matching note
 * set. Matching is exclusive and order-sensitive, so selecting Web can never
 * also emit Desktop notes. Empty or unrecognised values yield no notes at all,
 * which lets the caller omit the whole section instead of leaving an empty
 * header behind.
 */
function getPlatformNotes(platform: string): string {
  const value = platform.trim().toLowerCase();
  if (!value || value === 'not specified') return '';
  if (value.includes('mobile')) return PLATFORM_NOTES.mobile;
  if (value.includes('desktop')) return PLATFORM_NOTES.desktop;
  if (value.includes('web')) return PLATFORM_NOTES.web;
  return '';
}

/**
 * Normalizes a free-form requirements answer into a Markdown bullet list.
 *
 * Textarea answers arrive as multiple lines (often already prefixed with "-",
 * "*", or "1."). Each non-empty line becomes its own `- Item` bullet so the
 * content keeps its line breaks instead of collapsing into a single line.
 */
function formatRequirementList(
  value: string | string[] | undefined,
  indent = '',
): string {
  const lines = Array.isArray(value)
    ? value
    : value === undefined
      ? []
      : String(value).split(/\r?\n/);

  const items = lines
    .map((line) => line.replace(BULLET_PREFIX, '').trim())
    .filter((line) => line.length > 0);

  if (items.length === 0) return `${indent}- Not specified`;
  return items.map((item) => `${indent}- ${item}`).join('\n');
}

export function compilePrompt(answers: AnswerMap): CompiledPrompt {
  const projectName = formatValue(answers.project_name) || 'Untitled Project';
  const concept = formatValue(answers.concept);
  const persona = formatValue(answers.persona);
  // The wizard stores the selected platform in `target_platform`. Fall back to
  // the legacy `app_type` answer for backward compatibility, then resolve it
  // once so every platform-aware branch reads the exact same value.
  const selectedPlatform = String(answers.target_platform || answers.app_type || '').trim();
  const platformLabel = selectedPlatform || 'Not specified';
  const platformNotes = getPlatformNotes(selectedPlatform);
  const platformNotesBlock = platformNotes ? `\n${platformNotes}\n` : '';
  const colorStyle = formatValue(answers.color_style);
  const layoutFeel = formatValue(answers.layout_feel);
  const appVibe = formatValue(answers.app_vibe);
  const typographyStyle = formatValue(answers.typography_style);
  const interactionStyle = formatValue(answers.interaction_style);
  const visualHierarchy = formatValue(answers.visual_hierarchy);
  const infrastructure = formatValue(answers.infrastructure);
  const dataFlow = formatValue(answers.data_flow);
  const authStrategy = formatValue(answers.auth_strategy);
  const stateManagement = formatValue(answers.state_management);
  const accessibility = formatValue(answers.accessibility);
  const rawAccessibility = cleanValue(answers.accessibility);
  const functionalNotes = formatRequirementList(answers.functional_notes, '  ');

  const colors = getColorPalette(String(colorStyle));
  const layoutCSS = getLayoutCSS(String(layoutFeel), selectedPlatform);
  const signature = getProjectSignature(selectedPlatform, String(appVibe), String(colorStyle));

  // Constraint items are collected first so empty/placeholder entries can be
  // filtered out before rendering, avoiding stray "- " bullets in the output.
  const constraints: string[] = [
    'Follow the design system and UI/UX specifications exactly',
    `Adhere to the chosen platform conventions (${selectedPlatform || 'the target platform'})`,
    'Implement secure, accessible, and performant code',
    'Use TypeScript where possible for type safety',
    'Write clean, maintainable, and well-documented code',
    'Follow SOLID principles and established design patterns',
    selectedPlatform === 'Mobile App' ? 'Optimize for touch interactions and mobile performance' : '',
    selectedPlatform === 'Web App' ? 'Ensure responsive design and proper SEO' : '',
    rawAccessibility
      ? `Meet ${rawAccessibility} accessibility standards`
      : 'Meet standard WCAG 2.1 AA accessibility guidelines',
  ].filter((item) => item.trim() !== '');
  const constraintsList = constraints.map((item) => `- ${item}`).join('\n');

  const systemPrompt = `# Project Blueprint: ${projectName}

Generated by Prompt Architect for Claude Code / Kilo CLI

## 1. Project Identity

- **Project Name**: ${projectName}
- **Description**: ${concept}
- **System Persona**: ${persona}

## 2. Functional Specification

- **Core Requirements**:
${functionalNotes}
- **Data Flow**: ${dataFlow}
- **Authentication Strategy**: ${authStrategy}
- **State Management**: ${stateManagement}
- **Accessibility Requirements**: ${accessibility}

### Feature Flags & Probes

- **Payments / Billing**: ${ynValue(answers.needs_payments)}
- **Bookings / Scheduling**: ${ynValue(answers.needs_bookings)}
- **Social Features**: ${ynValue(answers.needs_social)}
- **Content Publishing**: ${ynValue(answers.needs_content)}
- **Analytics / Reporting**: ${ynValue(answers.needs_analytics)}
- **File / Media Handling**: ${ynValue(answers.needs_file_handling)}
- **Push Notifications**: ${ynValue(answers.needs_push_notifications)}
- **Offline Mode**: ${ynValue(answers.needs_offline_mode)}
- **Biometric Auth**: ${ynValue(answers.needs_biometric_auth)}
- **SEO Optimization**: ${ynValue(answers.needs_seo)}
- **PWA Installable**: ${ynValue(answers.needs_pwa)}
- **Auto Updater**: ${ynValue(answers.needs_auto_updater)}
- **Native File System Access**: ${ynValue(answers.needs_native_filesystem)}

## 3. Target Platform

- **Platform**: ${platformLabel}
- **Platform Details**: ${formatValue(answers.platform_detail)}
- **Infrastructure / Deployment**: ${infrastructure}
${platformNotesBlock}
## 4. UI/UX Specification

- **App Vibe**: ${appVibe}
- **Color Style**: ${colorStyle}
- **Layout Feel**: ${layoutFeel}
- **Typography Style**: ${typographyStyle}
- **Interaction Style**: ${interactionStyle}
- **Visual Hierarchy**: ${visualHierarchy}

### Color Palette

\`\`\`css
/* Primary Colors */
--color-primary: ${colors.primary};      /* Main brand color */
--color-secondary: ${colors.secondary};  /* Supporting elements */
--color-accent: ${colors.accent};        /* Interactive elements */

/* Text Colors */
--color-text-primary: ${colors.text};    /* Main text */
--color-text-secondary: ${colors.secondary}; /* Secondary text */

/* Background Colors */
--color-background-primary: ${colors.background};   /* Main background */
--color-background-secondary: ${colors.primary};    /* Secondary background */
\`\`\`

### Layout System

\`\`\`css
${layoutCSS}
\`\`\`

### Design Tokens

- **Layout Feel**: ${layoutFeel}
- **Visual Hierarchy**: ${visualHierarchy}
- **Interaction Style**: ${interactionStyle}
- **Accessibility Target**: ${rawAccessibility || 'WCAG 2.1 AA'}

## 5. System Prompt for Claude Code / Kilo CLI

### Role

You are an expert software architect and senior full-stack engineer tasked with implementing a production-ready application based on the specification above.

### Context

Project: ${projectName}

Description: ${concept}

### Constraints

${constraintsList}

### Implementation Requirements

1. **Architecture**: Create a scalable, modular architecture
2. **UI/UX**: Implement the specified design system with proper spacing, colors, and interactions
3. **Functionality**: Build all required features while respecting the feature flags above
4. **Data Layer**: Implement the specified data flow (${dataFlow || 'REST/GraphQL'})
5. **Authentication**: Use the specified auth strategy (${authStrategy || 'As needed'})
6. **State Management**: Apply the specified state management approach (${stateManagement || 'Context/local state'})
7. **Infrastructure**: Deploy to the specified target (${infrastructure || 'Appropriate platform'})
8. **Testing**: Include unit and integration tests where appropriate

### Output Instructions

- Generate a complete, working implementation
- Structure the codebase logically with clear separation of concerns
- Include setup instructions and environment variable templates
- Provide usage examples and documentation
- Ensure the code is ready to run out of the box

---

## Project Signature

${signature}
`;

  return {
    markdown: systemPrompt,
    systemPrompt,
    metaJSON: {
      role: 'Software Architect',
      context: concept,
      constraints: [
        `Follow ${selectedPlatform || 'the target platform'} conventions`,
        `Adhere to ${rawAccessibility || 'WCAG 2.1 AA'} accessibility standards`,
        'Maintain consistent UI/UX with the defined design system',
        'Implement secure and performant code',
      ].filter((item) => item.trim() !== ''),
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    },
  };
}
