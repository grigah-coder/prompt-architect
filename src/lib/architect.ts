import { NormalizedInput, CompiledPrompt } from './schema';

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

// Layout CSS mappings
const getLayoutCSS = (layoutFeel: string) => {
  switch (layoutFeel) {
    case 'Compact':
      return `.container { max-width: 1024px; margin: 0 auto; padding: 0 1rem; }
.component { margin-bottom: 0.5rem; padding: 0.75rem; }
.section { margin-bottom: 1rem; }`;
    case 'Comfortable':
      return `.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.component { margin-bottom: 1rem; padding: 1.5rem; }
.section { margin-bottom: 2rem; }`;
    case 'Spacious':
      return `.container { max-width: 1400px; margin: 0 auto; padding: 0 3rem; }
.component { margin-bottom: 2rem; padding: 2.5rem; }
.section { margin-bottom: 3rem; }`;
    default:
      return `.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.component { margin-bottom: 1rem; padding: 1.5rem; }
.section { margin-bottom: 2rem; }`;
  }
};

export function compilePrompt(input: NormalizedInput): CompiledPrompt {
  const colors = getColorPalette(input.color_style || 'Dark');
  const layoutCSS = getLayoutCSS(input.layout_feel || 'Comfortable');

  const systemPrompt = `# Product Vision

## Overview
${input.rawIdea ?? 'Build a web application'}

## Target Audience
${input.system_persona ?? 'General users'}

## Platform
${input.app_type ?? 'Web application'}

# User Experience Strategy

## Design Philosophy
${input.app_vibe ?? 'Clean and modern'} design approach focusing on user-centered experiences.

## Layout Strategy
${input.layout_feel ?? 'Comfortable'} spacing with ${input.visual_hierarchy ?? 'clear'} information hierarchy.

## Interaction Model
${input.interaction_style ?? 'Intuitive'} interactions that provide ${input.app_vibe?.toLowerCase() ?? 'smooth'} user experience.

# Technical UI Implementation

## Visual Design System
- **Color Palette**: ${input.color_style ?? 'Modern color scheme'}
- **Typography**: ${input.typography_style ?? 'Clean and readable'} font system
- **Component Density**: ${input.layout_feel ?? 'Balanced'} spacing throughout the interface

## Implementation Guidelines
- Ensure ${input.color_style?.toLowerCase() ?? 'consistent'} color usage across all components
- Apply ${input.typography_style?.toLowerCase() ?? 'readable'} typography hierarchy
- Maintain ${input.layout_feel?.toLowerCase() ?? 'comfortable'} spacing patterns
- Implement ${input.interaction_style?.toLowerCase() ?? 'smooth'} transitions and feedback

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
- **Spacing Scale**: ${input.layout_feel === 'Compact' ? '4px, 8px, 12px, 16px, 24px' : input.layout_feel === 'Spacious' ? '8px, 16px, 24px, 32px, 48px' : '6px, 12px, 18px, 24px, 36px'}
- **Border Radius**: ${input.app_vibe === 'Minimal' ? '2px, 4px, 6px' : input.app_vibe === 'Bold' ? '8px, 12px, 16px' : '4px, 8px, 12px'}
- **Typography Scale**: ${input.app_vibe === 'Corporate' ? '12px, 14px, 16px, 18px, 24px, 32px' : '14px, 16px, 18px, 20px, 28px, 36px'}`;

  return {
    systemPrompt,
    metaJSON: {
      role: input.system_persona ?? 'Developer',
      context: input.rawIdea ?? '',
      constraints: ['Follow the design system guidelines', 'Maintain consistent user experience', 'Ensure accessibility standards'],
      style: {
        tone: 'professional',
        format: ['markdown'],
        density: 'detailed',
      },
    },
  };
}