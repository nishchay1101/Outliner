export type BlockType =
  | 'hero'
  | 'section'
  | 'problem'
  | 'tip'
  | 'table'
  | 'code'
  | 'checklist'
  | 'exercise'
  | 'timeline'
  | 'divider';

export interface HeroData {
  title: string;
  subtitle: string;
  badges: string[];
  metaChips: { label: string; value: string }[];
}

export interface SectionData {
  title: string;
  content: string;
}

export interface ProblemStep {
  num: number;
  text: string;
}

export interface DryRunTable {
  headers: string[];
  rows: string[][];
}

export interface ProblemData {
  number: number;
  title: string;
  timeMin: number;
  link: string;
  platform: string;
  steps: ProblemStep[];
  dryRun: DryRunTable[];
  insights: string[];
  warnings: string[];
  complexity: { time: string; space: string };
}

export interface TipData {
  label: string;
  content: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface CodeLine {
  text: string;
  indent: number;
  type: 'keyword' | 'var' | 'comment' | 'normal';
}

export interface CodeData {
  title?: string;
  language?: string;
  lines: CodeLine[];
}

export interface ChecklistData {
  title: string;
  items: string[];
}

export interface ExerciseItem {
  badge: string;
  text: string;
}

export interface ExerciseData {
  title: string;
  items: ExerciseItem[];
}

export interface TimelineSegment {
  time: string;
  label: string;
  active: boolean;
}

export interface TimelineData {
  segments: TimelineSegment[];
}

export interface DividerData {
  style?: 'solid' | 'dashed' | 'gradient';
}

export type BlockData =
  | HeroData
  | SectionData
  | ProblemData
  | TipData
  | TableData
  | CodeData
  | ChecklistData
  | ExerciseData
  | TimelineData
  | DividerData;

export interface Block {
  id: string;
  type: BlockType;
  data: Record<string, any>;
  order: number;
}

export interface PageJSON {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceFilename: string;
  blocks: Block[];
}

export interface PageSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  sourceFilename: string;
}

export interface DocSection {
  level: number;
  title: string;
  content: string;
}

export interface DocTable {
  headers: string[];
  rows: string[][];
}

export interface DocContent {
  rawText: string;
  sections: DocSection[];
  tables: DocTable[];
  lists: string[][];
}
