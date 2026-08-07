/**
 * Source for the hero "code editor" widget. Deliberately not localized —
 * code, identifiers and comments stay in English regardless of site
 * locale, per the project's engineering standards.
 */
export type SnippetLang = "cs" | "ts" | "py";

export interface CodeSnippet {
  lang: SnippetLang;
  /** Language id Shiki understands, for build-time highlighting. */
  shikiLang: "csharp" | "typescript" | "python";
  tabLabel: string;
  filename: string;
  code: string;
}

export const codeSnippets: readonly CodeSnippet[] = [
  {
    lang: "cs",
    shikiLang: "csharp",
    tabLabel: "C#",
    filename: "Profile.cs",
    code: `// The AI writes the draft. I decide the architecture.
// That gap is the job.

public class Portfolio
{
    static readonly Engineer Damian = new(
        Since: 2011,
        Stack: ["C#/.NET", "NestJS", "Azure", "Prisma"]);

    public async Task<Product> Build(Idea idea)
    {
        var draft  = await ai.GenerateAsync(idea); // anyone can prompt
        var design = Decide(draft); // few can judge
        return Ship(design); // fewer still deliver
    }
}`,
  },
  {
    lang: "ts",
    shikiLang: "typescript",
    tabLabel: "TypeScript",
    filename: "profile.ts",
    code: `// The AI writes the draft. I decide the architecture.
// That gap is the job.

interface Engineer {
  readonly since: 2011;
  readonly stack: ["C#/.NET", "NestJS", "Azure", "Prisma"];
}

export async function build(idea: Idea): Promise<Product> {
  const draft  = await ai.generate(idea);   // anyone can prompt
  const design = damian.decide(draft);      // few can judge
  return ship(design);                      // fewer still deliver
}`,
  },
  {
    lang: "py",
    shikiLang: "python",
    tabLabel: "Python",
    filename: "profile.py",
    code: `# The AI writes the draft. I decide the architecture.
# That gap is the job.

@dataclass(frozen=True)
class Engineer:
    since: int = 2011
    stack: tuple[str, ...] = ("C#/.NET", "NestJS", "Azure", "Prisma")

async def build(idea: Idea) -> Product:
    draft  = await ai.generate(idea)   # anyone can prompt
    design = damian.decide(draft)      # few can judge
    return ship(design)                # fewer still deliver`,
  },
] as const;
