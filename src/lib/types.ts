export interface PropDoc {
  name: string;
  type: string;
  default: string;
  description: string;
}

/** The hand-written part of a component page (src/lib/components-data.ts). */
export interface WrittenDoc {
  slug: string;
  name: string;
  category: string;
  description: string;
  exports: string[];
  overview?: string;
  /** Extra wording for props; names, types and defaults come from the code. */
  props: { name: string; description: string }[];
  usage: { use: string[]; avoid: string[] };
  content: string[];
  a11y: string[];
  keyboard: { key: string; action: string }[];
}

/** A component page: the written docs plus the real props read from @scopesky/ui. */
export interface ComponentDoc extends Omit<WrittenDoc, "props"> {
  props: PropDoc[];
  propsNote?: string;
}
