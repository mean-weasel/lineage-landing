export type HeroAssetNode = {
  id: string;
  title: string;
  kind: "parent" | "child";
  parentId?: string;
  x: number;
  y: number;
  channel: string;
  selectedForNextVariation?: boolean;
  summary: string;
  promptHint: string;
  status: "seed" | "preview" | "created" | "iterated";
};

export type HeroPromptRecord = {
  id: string;
  label: string;
  prompt: string;
};

export type HeroAgentPatch = {
  id: string;
  label: string;
  operations: Array<{
    op: "add" | "replace";
    path: string;
    assetId: string;
    field?: string;
  }>;
};

export type HeroScenarioSurface = {
  width: number;
  height: number;
};

export type HeroScenarioStep =
  | { type: "idle"; label: string }
  | { type: "select-parent"; label: string; assetId: string }
  | { type: "prompt-create"; label: string; promptId: string }
  | { type: "write-children"; label: string; patchId: string }
  | {
      type: "apply-children";
      label: string;
      parentId: string;
      childIds: string[];
    }
  | { type: "inspect-parent"; label: string; assetId: string }
  | { type: "inspect-child"; label: string; assetId: string }
  | { type: "prompt-iterate"; label: string; promptId: string }
  | { type: "apply-iteration"; label: string; patchId: string; assetId: string }
  | { type: "final"; label: string; assetId: string };

export type HeroScenario = {
  surface: HeroScenarioSurface;
  parent: HeroAssetNode;
  children: HeroAssetNode[];
  prompts: HeroPromptRecord[];
  patches: HeroAgentPatch[];
  steps: HeroScenarioStep[];
};

export const heroScenario: HeroScenario = {
  surface: {
    width: 1440,
    height: 1304,
  },
  parent: {
    id: "local-5748fb8ba6df",
    title: "swissifier linkedin root v1",
    kind: "parent",
    x: 29,
    y: 39,
    channel: "linkedin",
    summary: "Seed image approved as the parent for the next design branch.",
    promptHint: "Source: Swissifier launch direction",
    status: "seed",
  },
  prompts: [
    {
      id: "prompt-swissifier-children-v1",
      label: "Recorded iteration prompt",
      prompt:
        "Create two follow-up Swissifier variations from the selected parent: one vertical poster composition and one root continuation preserving the typography treatment.",
    },
    {
      id: "prompt-swissifier-iterate-v1",
      label: "Human iteration prompt",
      prompt:
        "Make the second direction sharper and more editorial while keeping the Swissifier image language intact.",
    },
  ],
  patches: [
    {
      id: "patch-swissifier-children-v1",
      label: "Agent patch",
      operations: [
        {
          op: "add",
          path: "/children/0",
          assetId: "local-befe299c503d",
        },
        {
          op: "add",
          path: "/children/1",
          assetId: "local-2e102785131f",
        },
      ],
    },
    {
      id: "patch-swissifier-iterate-v1",
      label: "Iteration patch",
      operations: [
        {
          op: "replace",
          path: "/children/1/status",
          assetId: "local-2e102785131f",
          field: "status",
        },
        {
          op: "replace",
          path: "/children/1/selected_for_next_variation",
          assetId: "local-2e102785131f",
          field: "selectedForNextVariation",
        },
      ],
    },
  ],
  children: [
    {
      id: "local-befe299c503d",
      title: "swissifier vertical poster v1",
      kind: "child",
      parentId: "local-5748fb8ba6df",
      x: 43,
      y: 72,
      channel: "local",
      summary: "Poster crop created as one possible visual branch.",
      promptHint: "Agent-created child asset",
      status: "created",
    },
    {
      id: "local-2e102785131f",
      title: "swissifier vertical drill v1",
      kind: "child",
      parentId: "local-5748fb8ba6df",
      x: 50,
      y: 62,
      channel: "local",
      selectedForNextVariation: true,
      summary: "Editorial drill direction selected for the next iteration.",
      promptHint: "Updated after human feedback",
      status: "iterated",
    },
  ],
  steps: [
    { type: "idle", label: "Ready" },
    {
      type: "select-parent",
      label: "Parent selected",
      assetId: "local-5748fb8ba6df",
    },
    {
      type: "prompt-create",
      label: "Prompt recorded",
      promptId: "prompt-swissifier-children-v1",
    },
    {
      type: "write-children",
      label: "JSON patch queued",
      patchId: "patch-swissifier-children-v1",
    },
    {
      type: "apply-children",
      label: "Children created",
      parentId: "local-5748fb8ba6df",
      childIds: ["local-befe299c503d", "local-2e102785131f"],
    },
    {
      type: "inspect-parent",
      label: "Parent inspected",
      assetId: "local-5748fb8ba6df",
    },
    {
      type: "inspect-child",
      label: "Child inspected",
      assetId: "local-2e102785131f",
    },
    {
      type: "prompt-iterate",
      label: "Iteration prompt",
      promptId: "prompt-swissifier-iterate-v1",
    },
    {
      type: "apply-iteration",
      label: "Child refined",
      patchId: "patch-swissifier-iterate-v1",
      assetId: "local-2e102785131f",
    },
    {
      type: "final",
      label: "Shared state ready",
      assetId: "local-2e102785131f",
    },
  ],
};
