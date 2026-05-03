import { CompiledPrompt, AnswerMap } from './schema';

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

  // Maps for dynamic signature generation
  const vibeDescriptors: Record<string, string> = {
    'Minimal': 'Air',
    'Bold': 'Power',
    'Playful': 'Joy',
    'Corporate': 'Trust'
  };

  const typeDescriptors: Record<string, string> = {
    'Mobile App': '📱 Mobile',
    'Web App': '🌐 Web',
    'Desktop': '💻 Desktop'
  };

  const colorDescriptors: Record<string, string> = {
    'Dark': 'Night',
    'Light': 'Dawn',
    'High Contrast': 'Clarity',
    'Pastel': 'Harmony'
  };

  // Generate signature components
  const typeDesc = typeDescriptors[type] || type;
  const vibeDesc = vibeDescriptors[vibe] || vibe;
  const colorDesc = colorDescriptors[color] || color;

  // Create dynamic signature
  const signature = `${typeDesc} ${vibeDesc} × ${colorDesc}`;

  // Add brief description based on combination
  const descriptions: Record<string, string> = {
    '📱 Mobile Air': 'A breath of fresh design in the palm of your hand',
    '📱 Mobile Power': 'Commanding presence meets mobile perfection',
    '📱 Mobile Joy': 'Delightful interactions that dance in your pocket',
    '📱 Mobile Trust': 'Professional excellence, perfectly portable',
    '🌐 Web Air': 'Clean digital spaces that breathe and flow',
    '🌐 Web Power': 'Bold web presence that commands attention',
    '🌐 Web Joy': 'Playful experiences that make browsing magical',
    '🌐 Web Trust': 'Professional web design that builds confidence',
    '💻 Desktop Air': 'Focused workspaces with elegant simplicity',
    '💻 Desktop Power': 'Powerful desktop experiences that dominate',
    '💻 Desktop Joy': 'Productive workspaces infused with delight',
    '💻 Desktop Trust': 'Reliable desktop solutions for serious work'
  };

  const description = descriptions[signature] || `A unique ${vibe.toLowerCase()} experience crafted for ${type.toLowerCase()}`;

  return `${signature} - ${description}`;
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

export function compilePrompt(answers: AnswerMap): CompiledPrompt {
  const appType = answers.app_type as string;
  const colorStyle = answers.color_style as string;
  const layoutFeel = answers.layout_feel as string;

  const colors = getColorPalette(colorStyle || 'Dark');
  const layoutCSS = getLayoutCSS(layoutFeel || 'Comfortable', appType);

  const systemPrompt = `# Product Vision

## Overview
${(answers.concept || answers.project_name) ?? 'Build an application'}
${appType === 'Mobile App' ? ' using React Native, Swift, or Flutter for cross-platform mobile development' : appType === 'Web App' ? ' using React/Next.js with modern web technologies and SEO optimization' : ''}

## Target Audience
${'General users'}

## Platform
${appType === 'Mobile App' ? 'Mobile application for iOS and Android platforms' : appType === 'Web App' ? 'Web application with responsive design and cross-browser compatibility' : appType ?? 'Web application'}

# User Experience Strategy

## Design Philosophy
${answers.app_vibe ?? 'Clean and modern'} design approach focusing on user-centered experiences.

## Layout Strategy
${layoutFeel ?? 'Comfortable'} spacing with clear information hierarchy.

## Interaction Model
Intuitive interactions that provide ${answers.app_vibe?.toLowerCase() ?? 'smooth'} user experience${appType === 'Mobile App' ? ', including touch gestures, swipe navigation, and native mobile interactions' : appType === 'Web App' ? ', optimized for mouse and keyboard interactions with proper focus management and accessibility' : ''}.

# Technical UI Implementation

## Visual Design System
- **Color Palette**: ${colorStyle ?? 'Dark'} theme
- **Typography**: Clean and readable font system
- **Component Density**: ${layoutFeel ?? 'Balanced'} spacing throughout the interface

## Implementation Guidelines
- Ensure ${colorStyle?.toLowerCase() ?? 'consistent'} color usage across all components
- Apply readable typography hierarchy
- Maintain ${layoutFeel?.toLowerCase() ?? 'comfortable'} spacing patterns
- Implement smooth transitions and feedback

# Style Guide

## Color Palette
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

## Layout System
\`\`\`css
${layoutCSS}
\`\`\`

## Design Tokens

### Spacing System
${layoutFeel === 'Compact'
  ? `- **Base Gap**: 4px (minimum touch targets, tight layouts)\n- **Component Spacing**: 8px (card padding, element margins)\n- **Section Spacing**: 12px (between major UI sections)\n- **Container Padding**: 4px (edge margins, consistent breathing room)\n- **Layout Units**: 4px, 8px, 12px, 16px, 20px`
  : layoutFeel === 'Spacious'
  ? `- **Base Gap**: 24px (generous touch targets, breathing room)\n- **Component Spacing**: 32px (card padding, element margins)\n- **Section Spacing**: 40px (between major UI sections)\n- **Container Padding**: 24px (edge margins, spacious layouts)\n- **Layout Units**: 16px, 24px, 32px, 40px, 48px, 56px`
  : `- **Base Gap**: 16px (balanced touch targets, comfortable layouts)\n- **Component Spacing**: 24px (card padding, element margins)\n- **Section Spacing**: 32px (between major UI sections)\n- **Container Padding**: 16px (edge margins, moderate breathing room)\n- **Layout Units**: 8px, 16px, 24px, 32px, 40px, 48px`}

### Component Styling
- **Border Radius**: ${answers.app_vibe === 'Minimal' ? '2px, 4px, 6px (subtle, clean edges)' : answers.app_vibe === 'Bold' ? '8px, 12px, 16px (pronounced, modern curves)' : '4px, 8px, 12px (balanced, approachable)'}
- **Typography Scale**: ${answers.app_vibe === 'Corporate' ? '12px, 14px, 16px, 18px, 24px, 32px (formal hierarchy)' : '14px, 16px, 18px, 20px, 28px, 36px (readable, modern scale)'}

### Layout Guidelines
- **Grid System**: ${layoutFeel === 'Compact' ? (appType === 'Mobile App' ? '1rem base grid (dense, efficient)' : '8px base grid (dense, efficient)') : layoutFeel === 'Spacious' ? (appType === 'Mobile App' ? '2rem base grid (generous, breathing room)' : '16px base grid (generous, breathing room)') : (appType === 'Mobile App' ? '1.5rem base grid (balanced, flexible)' : '12px base grid (balanced, flexible)')}
- **Container Max-Width**: ${layoutFeel === 'Compact' ? (appType === 'Mobile App' ? '90vw' : '1024px') : layoutFeel === 'Spacious' ? (appType === 'Mobile App' ? '100vw' : '1400px') : (appType === 'Mobile App' ? '95vw' : '1200px')}
- **Responsive Breakpoints**: ${appType === 'Mobile App' ? '480px, 640px, 768px, 1024px (mobile-first approach)' : '640px, 768px, 1024px, 1280px'}

# Project Signature

${getProjectSignature(appType, answers.app_vibe || answers.ui_mood, colorStyle)}`;

  return {
    systemPrompt,
    metaJSON: {
      role: 'Developer',
      context: (answers.concept || answers.project_name) ?? '',
      constraints: ['Follow the design system guidelines', 'Maintain consistent user experience', 'Ensure accessibility standards'],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    },
  };
}