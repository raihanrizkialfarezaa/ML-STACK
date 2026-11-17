export interface TargetDistribution {
  scope: string;
  n_rows: number;
  tier_low: number;
  tier_med: number;
  tier_high: number;
  quality_high_n: number;
  quality_high_pct: number;
}

export interface DuplicateSummary {
  scope: string;
  n_rows: number;
  duplicate_rows: number;
  duplicate_pct: number;
}

export interface RFModelMetric {
  scope: string;
  model: string;
  threshold: number;
  accuracy: number;
  balanced_acc: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  f1_macro: number;
  mcc: number;
  roc_auc: number;
  pr_auc: number;
}

export interface FeatureImportance {
  scope: string;
  feature: string;
  gini: number;
  perm_mean: number;
  perm_std: number;
  gini_rank: number;
  perm_rank: number;
  selected_top6: boolean;
}

export interface BinningBoundary {
  scope: string;
  group: string;
  feature: string;
  bin: string;
  lower_bound: number | string;
  upper_bound: number | string;
  n_train: number;
  share_train: number;
  n_test: number;
  share_test: number;
  observed_min: number;
  observed_max: number;
}

export interface AssociationRule {
  rule_id: string;
  scope: string;
  consequent_tier: "High" | "Low";
  antecedents: string;
  consequent: string;
  rule: string;
  n_antecedents: number;
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
  antecedent_support: number;
  consequent_support: number;
  support_test: number;
  confidence_test: number;
  lift_test: number;
  holdout_pass: boolean;
  rank: number;
}

export interface ROCCurvePoint {
  scope: string;
  model: string;
  fpr: number;
  tpr: number;
}

export interface ConfusionMatrixItem {
  scope: string;
  model: string;
  threshold: number;
  true_negative: number;
  false_positive: number;
  false_negative: number;
  true_positive: number;
  n_test: number;
}

export interface ProjectMetadata {
  generated_at: string;
  runtime_seconds: number;
  seed: number;
  test_size: number;
  top_features: {
    Combined: string[];
    Red: string[];
    White: string[];
  };
  miner: string;
  mlxtend_available: boolean;
  rule_thresholds: Array<{
    consequent: string;
    min_support: number;
    min_confidence: number;
    min_lift: number;
  }>;
  n_rules: number;
  n_rules_holdout_pass: number;
  versions: Record<string, string>;
}

export interface WineDataBundle {
  target_distribution: TargetDistribution[];
  duplicate_summary: DuplicateSummary[];
  rf_model_comparison: RFModelMetric[];
  feature_importance: FeatureImportance[];
  binning_boundaries: BinningBoundary[];
  association_rules_all_scopes: AssociationRule[];
  top_wine_association_rules: AssociationRule[];
  roc_curves: ROCCurvePoint[];
  confusion_matrices: ConfusionMatrixItem[];
  metadata: ProjectMetadata;
}
