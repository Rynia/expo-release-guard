export type Severity = 'pass' | 'warn' | 'fail' | 'info';

export interface CheckResult {
  id: string;
  category: string;
  title: string;
  severity: Severity;
  message: string;
  fixRecommendation?: string;
}

export interface ProjectContext {
  projectRoot: string;
  appJsonPath?: string;
  appJson?: any;
  packageJsonPath?: string;
  packageJson?: any;
  easJsonPath?: string;
  easJson?: any;
  tsconfigPath?: string;
}

export interface ReleaseReport {
  timestamp: string;
  projectRoot: string;
  score: number; // 0 to 10
  results: CheckResult[];
  hasFailures: boolean;
}
