import type { WorldConfigState } from "../components/LiveJsonEditor";

/**
 * An agent type in a configuration, including its initialization attributes.
 */
export type AgentType = {
  id: number;
  name: string;
  count: number;
  model?: string;
  personality?: string[];
  objective?: string;
  attributes: Attribute[];
};

export type DistributionSpec =
  | { type: "fixed"; value: number }
  | { type: "normal"; mean: number; stddev: number }
  | { type: "binomial"; trials: number; probability: number }
  | { type: "beta"; alpha: number; beta: number }
  | { type: "dirichlet"; alphas: number[] };

export type Attribute = {
  name: string;
  spec?: DistributionSpec;
};
/**
 * A unified configuration object combining agent definitions and world settings.
 */
export interface UnifiedConfig {
  id: string;
  name: string;
  agents: AgentType[];
  settings: { world: WorldConfigState };
  /** ISO timestamp when this configuration was created */
  created_at: string;
  /** ISO timestamp when this configuration was last used */
  last_used: string;
}

/**
 * A simple struct for active simulation identifiers.
 */
export interface Simulation {
  /** Unique simulation identifier */
  id: string;
  /** ISO timestamp when this simulation was created */
  created_at: string;
  /** ISO timestamp when this simulation was last used */
  last_used: string;
  /** Dimensions of the simulation world as [width, height], or null if unavailable */
  world_size: [number, number] | null;
  /** Current number of active agents in the simulation */
  agent_count: number;
}
