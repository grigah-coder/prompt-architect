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

  const techStack = (answers.tech_stack as string) || 'Next.js';
  const uiStyle = (answers.ui_style as string) || 'Tailwind';
  const features = (answers.features as string[]).join(', ') || 'Auth, Database, API';

  const role = 'Senior Full-stack Developer & Software Architect.';
  const task = 'Build a production-ready application based on the provided specs.';
  const specs = `Concept: ${rawIdea}
Tech Stack: ${techStack}
UI Style: ${uiStyle}
Features: ${features}`;
  const deliverables = 'Full folder structure and file-by-file code.';

  const systemPrompt = `## Role
${role}

## Task
${task}

## Specs
${specs}

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