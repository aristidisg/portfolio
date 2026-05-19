// Minimal markdown-ish renderer (no deps).
// Supports: ## H2, ### H3, paragraphs, - lists, **bold**, `code`, [text](url)
export function Prose({ text }: { text?: string }) {
  if (!text) return null;
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="space-y-5 text-paper-1 leading-relaxed text-pretty">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function renderBlock(block: string, key: number) {
  const trimmed = block.trim();
  if (trimmed.startsWith('### ')) {
    return (
      <h3 key={key} className="font-display text-xl font-semibold text-paper-0 mt-8">
        {inline(trimmed.slice(4))}
      </h3>
    );
  }
  if (trimmed.startsWith('## ')) {
    return (
      <h2 key={key} className="font-display text-2xl font-semibold text-paper-0 mt-10">
        {inline(trimmed.slice(3))}
      </h2>
    );
  }
  if (/^[-*]\s/.test(trimmed)) {
    const items = trimmed.split('\n').map((l) => l.replace(/^[-*]\s/, ''));
    return (
      <ul key={key} className="list-disc list-outside pl-5 space-y-1.5">
        {items.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </ul>
    );
  }
  return (
    <p key={key} className="text-paper-1">
      {inline(trimmed)}
    </p>
  );
}

function inline(text: string): React.ReactNode {
  // Tokenize on **bold**, `code`, [text](url)
  const tokens: React.ReactNode[] = [];
  let rest = text;
  let i = 0;
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/;
  while (rest.length > 0) {
    const m = re.exec(rest);
    if (!m) {
      tokens.push(rest);
      break;
    }
    if (m.index > 0) tokens.push(rest.slice(0, m.index));
    if (m[1] !== undefined) {
      tokens.push(<strong key={i} className="text-paper-0">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      tokens.push(<code key={i} className="font-mono text-sm bg-ink-1 px-1.5 py-0.5 rounded text-accent">{m[2]}</code>);
    } else if (m[3] !== undefined && m[4] !== undefined) {
      tokens.push(
        <a key={i} href={m[4]} target="_blank" rel="noreferrer" className="text-accent link-underline">
          {m[3]}
        </a>,
      );
    }
    rest = rest.slice(m.index + m[0].length);
    i += 1;
  }
  return tokens;
}
