"use client";

import Image from "next/image";
import {
  Code2,
  GripVertical,
  Image as ImageIcon,
  MoveHorizontal,
  Play,
  RotateCcw,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroScenario, type HeroScenarioStep } from "@/lib/hero-scenario";

type HeroScenarioPlayerProps = {
  position: number;
  onPositionChange: (position: number) => void;
};

type ScenarioPhase = HeroScenarioStep["type"];
type JsonHighlight = "parent" | "prompt" | "patch" | "children";
const STEP_DURATION_MS = 880;

function stepPhase(stepIndex: number): ScenarioPhase {
  return heroScenario.steps[stepIndex]?.type ?? "idle";
}

function phaseRank(phase: ScenarioPhase) {
  return heroScenario.steps.findIndex((step) => step.type === phase);
}

function hasReached(current: ScenarioPhase, target: ScenarioPhase) {
  return phaseRank(current) >= phaseRank(target);
}

function buildAgentState(phase: ScenarioPhase) {
  const selectedParent = hasReached(phase, "select-parent")
    ? heroScenario.parent.id
    : null;
  const prompt = hasReached(phase, "show-prompt") ? heroScenario.prompts[0] : null;
  const patch = hasReached(phase, "write-json") ? heroScenario.patches[0] : null;
  const children = hasReached(phase, "create-children") ? heroScenario.children : [];

  return {
    selected_parent: selectedParent,
    prompt_id: prompt?.id ?? null,
    prompt: prompt?.prompt ?? null,
    patch_id: patch?.id ?? null,
    patch_status: patch
      ? hasReached(phase, "create-children")
        ? "applied"
        : "queued"
      : null,
    operations:
      patch?.operations.map((operation) => ({
        op: operation.op,
        path: operation.path,
        asset_id: operation.assetId,
      })) ?? [],
    children: children.map((child) => ({
      asset_id: child.id,
      title: child.title,
      parent_asset_id: child.parentId,
    })),
  };
}

function activeJsonHighlight(phase: ScenarioPhase): JsonHighlight | null {
  if (phase === "select-parent") {
    return "parent";
  }

  if (phase === "show-prompt") {
    return "prompt";
  }

  if (phase === "write-json") {
    return "patch";
  }

  if (phase === "create-children") {
    return "children";
  }

  return null;
}

function JsonLine({
  active,
  children,
  indent = 0,
}: {
  active?: boolean;
  children: ReactNode;
  indent?: number;
}) {
  return (
    <span
      className={`scenario-json-line ${active ? "is-active" : ""}`}
      style={{ "--json-indent": indent } as CSSProperties}
    >
      {children}
    </span>
  );
}

function AgentJsonView({
  phase,
  state,
}: {
  phase: ScenarioPhase;
  state: ReturnType<typeof buildAgentState>;
}) {
  const highlight = activeJsonHighlight(phase);
  const firstChild = state.children[0];
  const secondChild = state.children[1];

  return (
    <pre className="scenario-json">
      <code>
        <JsonLine>{"{"}</JsonLine>
        <JsonLine active={highlight === "parent"} indent={1}>
          {`"selected_parent": ${JSON.stringify(state.selected_parent)},`}
        </JsonLine>
        <JsonLine active={highlight === "prompt"} indent={1}>
          {`"prompt_id": ${JSON.stringify(state.prompt_id)},`}
        </JsonLine>
        <JsonLine active={highlight === "prompt"} indent={1}>
          {`"prompt": ${JSON.stringify(state.prompt)},`}
        </JsonLine>
        <JsonLine active={highlight === "patch"} indent={1}>
          {`"patch_id": ${JSON.stringify(state.patch_id)},`}
        </JsonLine>
        <JsonLine active={highlight === "patch"} indent={1}>
          {`"patch_status": ${JSON.stringify(state.patch_status)},`}
        </JsonLine>
        {state.operations.length > 0 ? (
          <>
            <JsonLine active={highlight === "patch"} indent={1}>
              {'"operations": ['}
            </JsonLine>
            {state.operations.map((operation, index) => (
              <JsonLine key={operation.path} active={highlight === "patch"} indent={2}>
                {`${JSON.stringify(operation)}${index === state.operations.length - 1 ? "" : ","}`}
              </JsonLine>
            ))}
            <JsonLine active={highlight === "patch"} indent={1}>
              {"],"}
            </JsonLine>
          </>
        ) : (
          <JsonLine indent={1}>{'"operations": [],'}</JsonLine>
        )}
        {firstChild || secondChild ? (
          <>
            <JsonLine active={highlight === "children"} indent={1}>
              {'"children": ['}
            </JsonLine>
            {firstChild ? (
              <JsonLine active={highlight === "children"} indent={2}>
                {`${JSON.stringify(firstChild)},`}
              </JsonLine>
            ) : null}
            {secondChild ? (
              <JsonLine active={highlight === "children"} indent={2}>
                {JSON.stringify(secondChild)}
              </JsonLine>
            ) : null}
            <JsonLine active={highlight === "children"} indent={1}>
              {"]"}
            </JsonLine>
          </>
        ) : (
          <JsonLine indent={1}>{'"children": []'}</JsonLine>
        )}
        <JsonLine>{"}"}</JsonLine>
      </code>
    </pre>
  );
}

function NodeMarker({
  node,
  active,
  focus,
  preview,
}: {
  node: (typeof heroScenario.children)[number] | typeof heroScenario.parent;
  active: boolean;
  focus?: boolean;
  preview?: boolean;
}) {
  return (
    <div
      className={`scenario-node ${node.kind === "parent" ? "scenario-parent-node" : "scenario-child-node"} ${
        active ? "is-active" : ""
      } ${focus ? "is-focused" : ""} ${preview ? "is-preview" : ""}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span>{node.kind === "parent" ? "Parent" : "Child"}</span>
      <strong>{node.title}</strong>
    </div>
  );
}

export function HeroScenarioPlayer({
  position,
  onPositionChange,
}: HeroScenarioPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timersRef = useRef<number[]>([]);
  const phase = stepPhase(stepIndex);
  const agentState = useMemo(() => buildAgentState(phase), [phase]);
  const showPrompt = hasReached(phase, "show-prompt");
  const showPatch = hasReached(phase, "write-json");
  const showChildren = hasReached(phase, "create-children");
  const selectedParent = hasReached(phase, "select-parent");
  const focusParent = phase === "select-parent" || phase === "show-prompt";
  const focusPatch = phase === "write-json";
  const focusChildren = phase === "create-children";
  const currentStep = heroScenario.steps[stepIndex];
  const isComplete = stepIndex === heroScenario.steps.length - 1;

  function clearTimers() {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current = [];
  }

  function playScenario() {
    clearTimers();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStepIndex(heroScenario.steps.length - 1);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setStepIndex(0);
    heroScenario.steps.slice(1).forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setStepIndex(index + 1);
        if (index === heroScenario.steps.length - 2) {
          setIsPlaying(false);
        }
      }, (index + 1) * STEP_DURATION_MS);
      timersRef.current.push(timer);
    });
  }

  function resetScenario() {
    clearTimers();
    setIsPlaying(false);
    setStepIndex(0);
  }

  useEffect(() => clearTimers, []);

  return (
    <div className="compare-frame">
      <div className="scenario-agent-surface" aria-hidden={position > 95}>
        <div className="scenario-agent-header">
          <Code2 aria-hidden="true" size={15} />
          Agent state
        </div>
        {showPrompt ? (
          <div className="scenario-prompt">
            <span>{heroScenario.prompts[0].label}</span>
            <p>{heroScenario.prompts[0].prompt}</p>
          </div>
        ) : null}
        <AgentJsonView phase={phase} state={agentState} />
      </div>

      <div
        className="scenario-visual-surface"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden={position < 5}
      >
        <Image
          src="/swissifier-lineage-app.png"
          alt="Lineage app screenshot showing the Swissifier image seed graph"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 1040px"
          className="compare-image"
        />
        <div className="scenario-visual-overlay">
          <NodeMarker
            node={heroScenario.parent}
            active={selectedParent}
            focus={focusParent || focusPatch}
          />
          {showPatch ? (
            <div
              className={`scenario-agent-beam ${focusPatch ? "is-active" : ""}`}
              aria-hidden="true"
            />
          ) : null}
          {showPatch || showChildren ? (
            <svg
              className={`scenario-connectors ${showChildren ? "is-applied" : "is-queued"}`}
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              {heroScenario.children.map((child) => (
                <line
                  key={child.id}
                  x1={heroScenario.parent.x}
                  y1={heroScenario.parent.y}
                  x2={child.x}
                  y2={child.y}
                />
              ))}
            </svg>
          ) : null}
          {showPatch || showChildren
            ? heroScenario.children.map((child) => (
                <NodeMarker
                  key={child.id}
                  node={child}
                  active={showPatch || showChildren}
                  focus={focusChildren}
                  preview={showPatch && !showChildren}
                />
              ))
            : null}
        </div>
      </div>

      <input
        className="compare-range"
        aria-label="Compare visual lineage graph with JSON lineage tree"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => onPositionChange(Number(event.target.value))}
      />
      <div className="compare-divider" style={{ left: `${position}%` }} aria-hidden="true">
        <div className="compare-tab">
          <MoveHorizontal aria-hidden="true" size={18} />
          <GripVertical aria-hidden="true" size={16} />
        </div>
      </div>

      <div className="scenario-controls" aria-label="Scenario playback controls">
        <span>{currentStep.label}</span>
        <button
          type="button"
          onClick={playScenario}
          disabled={isPlaying || isComplete}
        >
          <Play aria-hidden="true" size={14} />
          Play
        </button>
        <button type="button" onClick={resetScenario}>
          <RotateCcw aria-hidden="true" size={14} />
          Reset
        </button>
      </div>

      <div className="compare-badge compare-badge-left">
        <ImageIcon aria-hidden="true" size={14} />
        <span className="badge-full">Design surface</span>
        <span className="badge-short">Design</span>
      </div>
      <div className="compare-badge compare-badge-right">
        <Code2 aria-hidden="true" size={14} />
        <span className="badge-full">Agent surface</span>
        <span className="badge-short">Agent</span>
      </div>
    </div>
  );
}
