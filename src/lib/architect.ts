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
  const type = appType || 'Web App';
  const vibe = appVibe || 'Minimal';
  const color = colorStyle || 'Dark';

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

export function compilePrompt(answers: AnswerMap): CompiledPrompt {
  const projectName = formatValue(answers.project_name) || 'Untitled Project';
  const concept = formatValue(answers.concept);
  const persona = formatValue(answers.persona);
  const appType = formatValue(answers.app_type);
  const targetPlatform = formatValue(answers.target_platform);
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
  const functionalNotes = formatValue(answers.functional_notes);

  const colors = getColorPalette(String(colorStyle));
  const layoutCSS = getLayoutCSS(String(layoutFeel), String(appType) || String(targetPlatform));
  const signature = getProjectSignature(String(appType) || String(targetPlatform), String(appVibe), String(colorStyle));

  const systemPrompt = `# Project Blueprint: ${projectName}

Generated by Prompt Architect for Claude Code / Kilo CLI

## 1. Project Identity

- **Project Name**: ${projectName}
- **Description**: ${concept}
- **System Persona**: ${persona}

## 2. Functional Specification

- **Core Requirements**: ${functionalNotes}
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

- **Platform**: ${appType || targetPlatform}
- **Platform Details**: ${formatValue(answers.platform_detail)}
- **Infrastructure / Deployment**: ${infrastructure}

${appType === 'Mobile App' || String(targetPlatform).includes('Mobile') ? '### Mobile-Specific Notes\n\n- **Touch Interactions**: Prioritize touch-optimized UI with proper hit targets\n- **Native Feel**: Follow platform conventions (iOS HIG, Material Design)\n- **Performance**: Optimize for mobile devices (bundle size, memory)\n' : ''}
${appType === 'Web App' || String(targetPlatform).includes('Web') ? '### Web-Specific Notes\n\n- **Responsive Design**: Ensure layout works across screen sizes\n- **SEO**: Implement metadata, semantic HTML, and performance optimizations\n- **Accessibility**: WCAG compliance with keyboard navigation\n' : ''}
${appType === 'Desktop' || String(targetPlatform).includes('Desktop') ? '### Desktop-Specific Notes\n\n- **Window Management**: Handle resizing, focus, and native menus if applicable\n- **Offline-First**: Consider local data storage and sync strategies\n- **Cross-Platform**: Ensure compatibility with target OS\n' : ''}

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
- **Accessibility Target**: ${accessibility || 'WCAG 2.1 AA'}

## 5. System Prompt for Claude Code / Kilo CLI

### Role

You are an expert software architect and senior full-stack engineer tasked with implementing a production-ready application based on the specification above.

### Context

Project: ${projectName}

Description: ${concept}

### Constraints

- Follow the design system and UI/UX specifications exactly
- Adhere to the chosen platform conventions (${appType || targetPlatform})
- Implement secure, accessible, and performant code
- Use TypeScript where possible for type safety
- Write clean, maintainable, and well-documented code
- Follow SOLID principles and established design patterns
- ${appType === 'Mobile App' ? 'Optimize for touch interactions and mobile performance' : ''}
- ${appType === 'Web App' ? 'Ensure responsive design and proper SEO' : ''}
- ${accessibility ? `Meet ${accessibility} accessibility standards` : 'Follow WCAG 2.1 AA accessibility standards'}

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
        `Follow ${appType || targetPlatform} conventions`,
        `Adhere to ${accessibility || 'WCAG 2.1 AA'} accessibility standards`,
        'Maintain consistent UI/UX with the defined design system',
        'Implement secure and performant code',
      ],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    },
  };
}
