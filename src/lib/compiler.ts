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

  // ROLE
  const projectType = (answers.projectType as string) || 'Web App';
  const techStack = (answers.techStack as string) || 'modern web technologies';
  const role = `You are an expert ${projectType} architect specializing in ${techStack}.`;

  // CONTEXT
  const targetAudience = (answers.targetAudience as string) || 'general users';
  const coreEntities = (answers.coreEntities as string) || 'basic entities';
  const userRoles = (answers.userRoles as string[]).join(', ') || 'User';
  const context = `Project: ${rawIdea}
Target Users: ${targetAudience}
Core Entities: ${coreEntities}
User Roles: ${userRoles}`;

  // CONSTRAINTS
  const constraints: string[] = [];
  const securityLevel = (answers.securityLevel as number) || 3;
  constraints.push(`Security level: ${securityLevel}/5`);
  const scalingTarget = (answers.scalingTarget as string) || 'Prototype';
  constraints.push(`Scale target: ${scalingTarget}`);
  const customConstraints = (answers.constraints as string) || '';
  if (customConstraints.trim()) {
    constraints.push(customConstraints);
  }
  constraints.push(`Never: ${customConstraints || 'break the defined scope'}`);

  const constraintsBullets = constraints.map(c => `- ${c}`).join('\n');

  // STYLE
  const toneOfOutput = (answers.toneOfOutput as string) || 'Technical';
  const responseFormat = (answers.responseFormat as string[]) || ['Markdown'];
  const outputDensity = (answers.outputDensity as string) || 'Balanced';
  const style = `Tone: ${toneOfOutput}. Format responses using: ${responseFormat.join(', ')}.
Output density: ${outputDensity}.`;

  // SYSTEM PROMPT
  const systemPrompt = `## ROLE
${role}

## CONTEXT
${context}

## CONSTRAINTS
${constraintsBullets}

## STYLE
${style}`;

  // META JSON
  const metaJSON = {
    role,
    context,
    constraints,
    style: {
      tone: toneOfOutput,
      format: responseFormat,
      density: outputDensity,
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