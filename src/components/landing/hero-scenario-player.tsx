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
import { useEffect, useMemo, useRef, useState } from "react";
import { heroScenario, type HeroScenarioStep } from "@/lib/hero-scenario";

type HeroScenarioPlayerProps = {
  position: number;
  onPositionChange: (position: number) => void;
};

type ScenarioPhase = HeroScenarioStep["type"];

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
  const children = hasReached(phase, "create-children") ? heroScenario.children : [];

  return {
    selected_parent: selectedParent,
    prompt_id: prompt?.id ?? null,
    prompt: prompt?.prompt ?? null,
    children: children.map((child) => ({
      asset_id: child.id,
      title: child.title,
      parent_asset_id: child.parentId,
    })),
  };
}

function NodeMarker({
  node,
  active,
}: {
  node: (typeof heroScenario.children)[number] | typeof heroScenario.parent;
  active: boolean;
}) {
  return (
    <div
      className={`scenario-node ${node.kind === "parent" ? "scenario-parent-node" : "scenario-child-node"} ${
        active ? "is-active" : ""
      }`}
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
  const showChildren = hasReached(phase, "create-children");
  const selectedParent = hasReached(phase, "select-parent");
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
      }, (index + 1) * 620);
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
        <pre>
          <code>{JSON.stringify(agentState, null, 2)}</code>
        </pre>
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
          <NodeMarker node={heroScenario.parent} active={selectedParent} />
          {showChildren
            ? heroScenario.children.map((child) => (
                <NodeMarker key={child.id} node={child} active />
              ))
            : null}
          {showChildren ? (
            <svg className="scenario-connectors" viewBox="0 0 100 100" aria-hidden="true">
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
