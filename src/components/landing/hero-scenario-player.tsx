"use client";

import Image from "next/image";
import {
  Code2,
  GitBranch,
  GripVertical,
  Image as ImageIcon,
  MoveHorizontal,
  Play,
  RotateCcw,
} from "lucide-react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroScenario, type HeroScenarioStep } from "@/lib/hero-scenario";

type HeroScenarioPlayerProps = {
  position: number;
  onPositionChange: (position: number) => void;
};

type ScenarioPhase = HeroScenarioStep["type"];
type JsonHighlight = "parent" | "prompt" | "patch" | "children" | "inspect" | "iteration";
const STEP_DURATION_MS = 980;
const HERO_FRAME_ASPECT = 16 / 9;
const SOURCE_ASPECT = heroScenario.surface.width / heroScenario.surface.height;
const SOURCE_VISIBLE_HEIGHT_PERCENT = (SOURCE_ASPECT / HERO_FRAME_ASPECT) * 100;
const SOURCE_CENTER_Y_PERCENT = SOURCE_VISIBLE_HEIGHT_PERCENT / 2;
const SOURCE_MAX_PAN_PERCENT = 100 - SOURCE_VISIBLE_HEIGHT_PERCENT;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

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
  const prompt = hasReached(phase, "prompt-iterate")
    ? heroScenario.prompts[1]
    : hasReached(phase, "prompt-create")
      ? heroScenario.prompts[0]
      : null;
  const patch = hasReached(phase, "apply-iteration")
    ? heroScenario.patches[1]
    : hasReached(phase, "write-children")
      ? heroScenario.patches[0]
      : null;
  const children = hasReached(phase, "apply-children") ? heroScenario.children : [];
  const inspectedAsset =
    phase === "inspect-parent"
      ? heroScenario.parent
      : phase === "inspect-child" || phase === "prompt-iterate" || phase === "apply-iteration" || phase === "final"
        ? heroScenario.children[1]
        : null;
  const iterationApplied = hasReached(phase, "apply-iteration");

  return {
    selected_parent: selectedParent,
    prompt_id: prompt?.id ?? null,
    prompt: prompt?.prompt ?? null,
    patch_id: patch?.id ?? null,
    patch_status: patch
      ? patch.id === heroScenario.patches[1].id || hasReached(phase, "apply-children")
        ? "applied"
        : "queued"
      : null,
    operations:
      patch?.operations.map((operation) => ({
        op: operation.op,
        path: operation.path,
        asset_id: operation.assetId,
        field: operation.field,
      })) ?? [],
    inspected_asset_id: inspectedAsset?.id ?? null,
    children: children.map((child) => ({
      asset_id: child.id,
      title: child.title,
      parent_asset_id: child.parentId,
      status: child.status === "iterated" && !iterationApplied ? "created" : child.status,
      selected_for_next_variation:
        child.selectedForNextVariation && iterationApplied ? true : undefined,
    })),
  };
}

function activeJsonHighlight(phase: ScenarioPhase): JsonHighlight | null {
  if (phase === "select-parent" || phase === "inspect-parent") {
    return "parent";
  }

  if (phase === "prompt-create" || phase === "prompt-iterate") {
    return "prompt";
  }

  if (phase === "write-children") {
    return "patch";
  }

  if (phase === "apply-children" || phase === "final") {
    return "children";
  }

  if (phase === "inspect-child") {
    return "inspect";
  }

  if (phase === "apply-iteration") {
    return "iteration";
  }

  return null;
}

function visualFocusY(phase: ScenarioPhase) {
  if (phase === "write-children") {
    return 56;
  }

  if (phase === "apply-children") {
    return 66;
  }

  if (phase === "inspect-child" || phase === "prompt-iterate" || phase === "apply-iteration" || phase === "final") {
    return heroScenario.children[1].y;
  }

  if (phase === "select-parent" || phase === "prompt-create" || phase === "inspect-parent") {
    return heroScenario.parent.y;
  }

  return 34;
}

function visualPanPercent(phase: ScenarioPhase) {
  return clamp(
    SOURCE_CENTER_Y_PERCENT - visualFocusY(phase),
    -SOURCE_MAX_PAN_PERCENT,
    0,
  );
}

function agentPan(phase: ScenarioPhase) {
  if (phase === "prompt-iterate" || phase === "apply-iteration" || phase === "final") {
    return "-142px";
  }

  if (phase === "inspect-child") {
    return "-112px";
  }

  if (phase === "apply-children" || phase === "inspect-parent") {
    return "-84px";
  }

  if (phase === "write-children") {
    return "-44px";
  }

  return "0px";
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
  const childHighlight = highlight === "children" || highlight === "inspect" || highlight === "iteration";

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
        <JsonLine active={highlight === "patch" || highlight === "iteration"} indent={1}>
          {`"patch_status": ${JSON.stringify(state.patch_status)},`}
        </JsonLine>
        {state.operations.length > 0 ? (
          <>
            <JsonLine active={highlight === "patch" || highlight === "iteration"} indent={1}>
              {'"operations": ['}
            </JsonLine>
            {state.operations.map((operation, index) => (
              <JsonLine key={operation.path} active={highlight === "patch" || highlight === "iteration"} indent={2}>
                {`${JSON.stringify(operation)}${index === state.operations.length - 1 ? "" : ","}`}
              </JsonLine>
            ))}
            <JsonLine active={highlight === "patch" || highlight === "iteration"} indent={1}>
              {"],"}
            </JsonLine>
          </>
        ) : (
          <JsonLine indent={1}>{'"operations": [],'}</JsonLine>
        )}
        <JsonLine active={highlight === "inspect"} indent={1}>
          {`"inspected_asset_id": ${JSON.stringify(state.inspected_asset_id)},`}
        </JsonLine>
        {firstChild || secondChild ? (
          <>
            <JsonLine active={childHighlight} indent={1}>
              {'"children": ['}
            </JsonLine>
            {firstChild ? (
              <JsonLine active={highlight === "children"} indent={2}>
                {`${JSON.stringify(firstChild)},`}
              </JsonLine>
            ) : null}
            {secondChild ? (
              <JsonLine active={childHighlight} indent={2}>
                {JSON.stringify(secondChild)}
              </JsonLine>
            ) : null}
            <JsonLine active={childHighlight} indent={1}>
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
  refined,
}: {
  node: (typeof heroScenario.children)[number] | typeof heroScenario.parent;
  active: boolean;
  focus?: boolean;
  preview?: boolean;
  refined?: boolean;
}) {
  return (
    <div
      className={`scenario-node ${node.kind === "parent" ? "scenario-parent-node" : "scenario-child-node"} ${
        active ? "is-active" : ""
      } ${focus ? "is-focused" : ""} ${preview ? "is-preview" : ""} ${refined ? "is-refined" : ""}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span>{node.kind === "parent" ? "Parent" : "Child"}</span>
      <strong>{node.title}</strong>
    </div>
  );
}

function NodePopover({
  node,
  align = "right",
}: {
  node: (typeof heroScenario.children)[number] | typeof heroScenario.parent;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`scenario-popover scenario-popover-${align}`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <span>{node.kind === "parent" ? "Parent context" : "Child context"}</span>
      <strong>{node.title}</strong>
      <p>{node.summary}</p>
      <em>{node.promptHint}</em>
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
  const frameRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const phase = stepPhase(stepIndex);
  const agentState = useMemo(() => buildAgentState(phase), [phase]);
  const currentPrompt = hasReached(phase, "prompt-iterate")
    ? heroScenario.prompts[1]
    : hasReached(phase, "prompt-create")
      ? heroScenario.prompts[0]
      : null;
  const showPatch = hasReached(phase, "write-children");
  const showChildren = hasReached(phase, "apply-children");
  const selectedParent = hasReached(phase, "select-parent");
  const focusParent =
    phase === "select-parent" || phase === "prompt-create" || phase === "write-children" || phase === "inspect-parent";
  const focusPatch = phase === "write-children";
  const focusChildren = phase === "apply-children" || phase === "inspect-child";
  const focusRefinedChild = phase === "prompt-iterate" || phase === "apply-iteration" || phase === "final";
  const showParentPopover = phase === "inspect-parent";
  const showChildPopover =
    phase === "inspect-child" ||
    phase === "prompt-iterate" ||
    phase === "apply-iteration" ||
    phase === "final";
  const iterationApplied = hasReached(phase, "apply-iteration");
  const currentStep = heroScenario.steps[stepIndex];
  const isComplete = stepIndex === heroScenario.steps.length - 1;
  const modeLabel = "Visual + agent state";
  const modeIcon = <MoveHorizontal aria-hidden="true" size={16} />;

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

  function updateComparePosition(clientX: number) {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;
    onPositionChange(clamp(nextPosition, 0, 100));
  }

  function handleComparePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateComparePosition(event.clientX);
  }

  function handleComparePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) {
      return;
    }

    updateComparePosition(event.clientX);
  }

  function handleComparePointerEnd(event: PointerEvent<HTMLDivElement>) {
    isDraggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  useEffect(() => clearTimers, []);

  return (
    <>
      <div className="compare-toolbar">
        <span>
          <GitBranch aria-hidden="true" size={16} />
          Real Swissifier lineage
        </span>
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
        <span>
          {modeIcon}
          {modeLabel}
        </span>
      </div>

      <div
        ref={frameRef}
        className="compare-frame"
        onPointerDown={handleComparePointerDown}
        onPointerMove={handleComparePointerMove}
        onPointerUp={handleComparePointerEnd}
        onPointerCancel={handleComparePointerEnd}
      >
      <div className="scenario-agent-surface" aria-hidden={position > 95}>
        <div className="scenario-agent-panel">
          <div
            className="scenario-agent-scroll"
            style={{ "--agent-pan": agentPan(phase) } as CSSProperties}
          >
            <div className="scenario-agent-header">
              <Code2 aria-hidden="true" size={15} />
              Agent state
            </div>
            {currentPrompt ? (
              <div className="scenario-prompt">
                <span>{currentPrompt.label}</span>
                <p>{currentPrompt.prompt}</p>
              </div>
            ) : null}
            <AgentJsonView phase={phase} state={agentState} />
          </div>
        </div>
      </div>

      <div
        className="scenario-visual-surface"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        aria-hidden={position < 5}
      >
        <div
          className="scenario-visual-canvas"
          style={
            {
              "--visual-pan": `${visualPanPercent(phase)}%`,
              aspectRatio: `${heroScenario.surface.width} / ${heroScenario.surface.height}`,
            } as CSSProperties
          }
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
                    focus={
                      child.id === heroScenario.children[1].id
                        ? focusChildren || focusRefinedChild
                        : focusChildren
                    }
                    preview={showPatch && !showChildren}
                    refined={child.id === heroScenario.children[1].id && iterationApplied}
                  />
                ))
              : null}
            {showParentPopover ? <NodePopover node={heroScenario.parent} /> : null}
            {showChildPopover ? (
              <NodePopover node={heroScenario.children[1]} align="left" />
            ) : null}
          </div>
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
    </>
  );
}
