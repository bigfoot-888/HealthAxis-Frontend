export type StepConfig =
  | { action: "goto"; value: string }
  | { action: "expectUrl"; value: string }
  | { action: "expectText"; value: string }
  | { action: "fill"; selector: string; value: string }
  | { action: "autocomplete"; selector: string; value: string }
  | { action: "click"; selector: string }
  | { action: "date"; selector: string; value: string }
  | { action: "select"; selector: string; value: string }
  | { action: "clickRow"; selector: string };

// Form configuration
export interface FormConfig {
  url: string;
  steps: StepConfig[];
}
