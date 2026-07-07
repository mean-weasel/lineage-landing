export type HeroAssetNode = {
  id: string;
  title: string;
  kind: "parent" | "child";
  parentId?: string;
  x: number;
  y: number;
  channel: string;
  selectedForNextVariation?: boolean;
};

export type HeroPromptRecord = {
  id: string;
  label: string;
  prompt: string;
};

export type HeroScenarioStep =
  | { type: "idle"; label: string }
  | { type: "select-parent"; label: string; assetId: string }
  | { type: "show-prompt"; label: string; promptId: string }
  | {
      type: "create-children";
      label: string;
      parentId: string;
      childIds: string[];
    };

export type HeroScenario = {
  parent: HeroAssetNode;
  children: HeroAssetNode[];
  prompts: HeroPromptRecord[];
  steps: HeroScenarioStep[];
};

export const heroScenario: HeroScenario = {
  parent: {
    id: "local-5748fb8ba6df",
    title: "swissifier linkedin root v1",
    kind: "parent",
    x: 29,
    y: 39,
    channel: "linkedin",
  },
  prompts: [
    {
      id: "prompt-swissifier-children-v1",
      label: "Recorded iteration prompt",
      prompt:
        "Create two follow-up Swissifier variations from the selected parent: one vertical poster composition and one root continuation preserving the typography treatment.",
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
    },
    {
      id: "local-2e102785131f",
      title: "swissifier vertical drill v1",
      kind: "child",
      parentId: "local-5748fb8ba6df",
      x: 50,
      y: 62,
      channel: "local",
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
      type: "show-prompt",
      label: "Prompt recorded",
      promptId: "prompt-swissifier-children-v1",
    },
    {
      type: "create-children",
      label: "Children created",
      parentId: "local-5748fb8ba6df",
      childIds: ["local-befe299c503d", "local-2e102785131f"],
    },
  ],
};
