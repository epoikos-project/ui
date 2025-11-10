import React, { useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { Button } from "@mui/material";
import "@xyflow/react/dist/style.css";
import { useSimulation } from "../hooks/useSimulation";

import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: { id: string }) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(
    (edge: {
      source: dagre.Edge;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target: string | { [key: string]: any } | undefined;
    }) => {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  );

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node: { id: string | dagre.Label }) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

/**
 * Displays the full relationship graph for the current simulation.
 * Fetches and updates the nodes and edges on each simulation tick.
 */
export function GlobalRelationshipGraph() {
  const { simulation } = useSimulation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    async function fetchGraph() {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/simulation/${simulation.id}/relationship_graph`;
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data: {
          nodes: Array<{ id: string; label: string }>;
          edges: Array<{
            source: string;
            target: string;
            sentiment: number;
            count: number;
          }>;
        } = await res.json();
        const newNodes = data.nodes.map((n) => ({
          id: n.id,
          data: { label: n.label },
        }));
        const newEdges = data.edges.map((e) => ({
          id: `e-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          label: `s:${e.sentiment.toFixed(2)}, c:${e.count}`,
        }));
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(newNodes, newEdges);
        //@ts-expect-error is ok
        setNodes(layoutedNodes);
        //@ts-expect-error is ok
        setEdges(layoutedEdges);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGraph();
  }, [simulation.id, simulation.tick, setNodes, setEdges]);

  const onLayout = useCallback(
    (direction: "TB" | "LR") => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      //@ts-expect-error is ok
      setNodes(layoutedNodes);
      //@ts-expect-error is ok
      setEdges(layoutedEdges);
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        fitView
      >
        <Panel position="top-right">
          <Button className="xy-theme__button" onClick={() => onLayout("TB")}>
            vertical layout
          </Button>
          <Button className="xy-theme__button" onClick={() => onLayout("LR")}>
            horizontal layout
          </Button>
        </Panel>
        <Background />
      </ReactFlow>
    </div>
  );
}
