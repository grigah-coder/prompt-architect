export type Question = {
  id: string;
  question: string;
};

export type Answers = Record<string, string>;

export type Output = {
  finalPrompt: string;
  designSpec: string;
};

// Template system for different domains
const templates = {
  webApp: {
    questions: [
      { id: 'layout-preference', question: 'What layout preference do you have? (e.g., grid, list, card-based, dashboard)' },
      { id: 'color-scheme', question: 'Do you have a preferred color scheme or brand colors? (e.g., corporate, vibrant, dark mode, pastel)' },
      { id: 'responsiveness', question: 'What devices should this be optimized for? (mobile, tablet, desktop, all)' },
      { id: 'navigation-type', question: 'What navigation style do you prefer? (sidebar, top bar, bottom nav, hamburger)' },
      { id: 'content-type', question: 'What type of content will be primarily displayed? (text, images, videos, data tables, forms)' },
      { id: 'interactivity', question: 'What level of interactivity do you need? (static, basic interactions, complex animations, real-time updates)' },
      { id: 'brand-mood', question: 'What is the target brand mood? (professional, playful, luxurious, minimalist, bold)' }
    ],
    promptPrefix: "Create a detailed UI/UX specification for a web application",
    designSpecSections: [
      "Layout and Structure",
      "Color Scheme and Typography", 
      "Navigation and User Flow",
      "Responsiveness and Breakpoints",
      "Component Specifications",
      "Interactivity and Animations"
    ]
  },
  art: {
    questions: [
      { id: 'medium', question: 'What artistic medium are you envisioning? (digital painting, photography, 3D render, vector art, mixed media)' },
      { id: 'style', question: 'What art style or movement inspires this? (e.g., surrealism, cyberpunk, impressionism, abstract, photorealistic)' },
      { id: 'mood', question: 'What mood or emotion should the artwork convey? (serene, energetic, mysterious, melancholic, joyful)' },
      { id: 'influences', question: 'Any specific artists, films, or works that should influence the direction?' },
      { id: 'resolution', question: 'What resolution and aspect ratio do you need? (e.g., 1920x1080, 1:1, 16:9, 4K)' },
      { id: 'palette', question: 'Describe your preferred color palette (e.g., monochrome, complementary, analogous, vibrant, muted)' },
      { id: 'lighting', question: 'What lighting conditions should be considered? (dramatic, soft, natural light, neon, chiaroscuro)' }
    ],
    promptPrefix: "Create a detailed art generation prompt for Midjourney",
    designSpecSections: [
      "Medium and Technique",
      "Style and Influences",
      "Color Palette and Mood",
      "Composition and Lighting",
      "Technical Specifications",
      "Reference and Inspiration"
    ]
  },
  default: {
    questions: [
      { id: 'purpose', question: 'What is the primary purpose or goal of this concept?' },
      { id: 'target-audience', question: 'Who is the intended audience or user?' },
      { id: 'key-features', question: 'What are the essential features or elements that must be included?' },
      { id: 'style-preference', question: 'What visual or stylistic direction do you prefer?' },
      { id: 'success-metrics', question: 'How will you measure the success of this implementation?' }
    ],
    promptPrefix: "Create a detailed specification for",
    designSpecSections: [
      "Overview and Objectives",
      "Target Audience and Use Cases",
      "Key Features and Functionality",
      "Style and Aesthetic Direction",
      "Success Criteria and Metrics"
    ]
  }
};

/**
 * Determines the appropriate template based on the raw idea
 */
function getTemplateForIdea(rawIdea: string): typeof templates.webApp | typeof templates.art | typeof templates.default {
  const lowerIdea = rawIdea.toLowerCase();
  
  // Check for web/app related keywords
  if (lowerIdea.includes('web') || lowerIdea.includes('app') || lowerIdea.includes('website') || 
      lowerIdea.includes('application') || lowerIdea.includes('dashboard') || lowerIdea.includes('portal')) {
    return templates.webApp;
  }
  
  // Check for art related keywords
  if (lowerIdea.includes('art') || lowerIdea.includes('draw') || lowerIdea.includes('paint') || 
      lowerIdea.includes('illustration') || lowerIdea.includes('sketch') || lowerIdea.includes('design') ||
      lowerIdea.includes('graphic') || lowerIdea.includes('visual') || lowerIdea.includes('artwork')) {
    return templates.art;
  }
  
  // Default template
  return templates.default;
}

/**
 * Generates refinement questions based on the raw idea using template system
 */
export async function generateQuestions(rawIdea: string): Promise<Question[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const template = getTemplateForIdea(rawIdea);
  return template.questions;
}

/**
 * Generates the final prompt and design spec from the raw idea and answers
 */
export async function generateOutput(
  rawIdea: string,
  answers: Answers
): Promise<Output> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const template = getTemplateForIdea(rawIdea);
  
  // Build detailed prompt based on template type
  let finalPrompt = `${template.promptPrefix}: "${rawIdea}"\n\n`;
  
  // Add contextual information from answers
  finalPrompt += "Context and Requirements:\n";
  for (const [key, value] of Object.entries(answers)) {
    if (value.trim()) {
      finalPrompt += `- ${key.replace(/-/g, ' ')}: ${value}\n`;
    }
  }
  
  // Add stylistic directives and technical specifications
  finalPrompt += "\nStylistic Directives:\n";
  finalPrompt += "- Highly detailed and specific\n";
  finalPrompt += "- Professional quality suitable for production use\n";
  finalPrompt += "- Clear, actionable specifications\n";
  
  if (template === templates.webApp) {
    finalPrompt += "- Follow modern UI/UX best practices\n";
    finalPrompt += "- Consider accessibility guidelines (WCAG)\n";
    finalPrompt += "- Include responsive design considerations\n";
  } else if (template === templates.art) {
    finalPrompt += "- Optimized for Midjourney V6 or DALL-E 3\n";
    finalPrompt += "- Include specific artistic terminology\n";
    finalPrompt += "- Technical parameters for optimal generation\n";
  }
  
  finalPrompt += "\nIterative Refinement Options:\n";
  finalPrompt += "- Version 1: Core concept implementation\n";
  finalPrompt += "- Version 2: Enhanced styling and interactions\n";
  finalPrompt += "- Version 3: Polished details and optimization\n";
  
   // Generate design specification
   let designSpec = `## Design Specification\n\n`;
   
   for (const section of template.designSpecSections) {
     designSpec += `### ${section}\n`;
     
     // Add relevant answered questions to each section
     let sectionContentAdded = false;
     for (const [key, value] of Object.entries(answers)) {
       if (value.trim() && 
           (section.toLowerCase().includes(key.replace(/-/g, ' ')) || 
            key.replace(/-/g, ' ').toLowerCase().includes(section.toLowerCase().replace(/\s+/g, ' ')))) {
         designSpec += `- **${key.replace(/-/g, ' ')}**: ${value}\n`;
         sectionContentAdded = true;
       }
     }
     
     if (!sectionContentAdded) {
       designSpec += `- To be determined based on project requirements\n`;
     }
     
     designSpec += `\n`;
   }
   
   designSpec += `*This specification was generated from your answers to refine the initial concept.*\n`;
   
   return { finalPrompt, designSpec };
}