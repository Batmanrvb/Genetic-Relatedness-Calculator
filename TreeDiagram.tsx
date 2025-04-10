import React, { useEffect, useRef } from 'react';
import type { FamilyTree, RelationshipPath } from '../lib/genetics';

interface TreeDiagramProps {
  tree: FamilyTree;
  selectedId1: string;
  selectedId2: string;
  highlightPaths?: RelationshipPath[];
}

export const TreeDiagram: React.FC<TreeDiagramProps> = ({ 
  tree, 
  selectedId1, 
  selectedId2,
  highlightPaths = []
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Group individuals by generation
  const generations = Object.values(tree.individuals).reduce((acc, ind) => {
    if (!acc[ind.generation]) {
      acc[ind.generation] = [];
    }
    acc[ind.generation].push(ind);
    return acc;
  }, {} as Record<number, typeof tree.individuals[keyof typeof tree.individuals][]>);

  // Sort generations to ensure consistent ordering
  Object.values(generations).forEach(gen => {
    gen.sort((a, b) => a.id.localeCompare(b.id));
  });

  // Create a set of nodes that are part of the highlighted paths
  const highlightedNodes = new Set<string>();
  const highlightedEdges = new Set<string>();
  
  highlightPaths.forEach(path => {
    path.path.forEach((id, index) => {
      highlightedNodes.add(id);
      if (index < path.path.length - 1) {
        highlightedEdges.add(`${path.path[index]}-${path.path[index + 1]}`);
        highlightedEdges.add(`${path.path[index + 1]}-${path.path[index]}`);
      }
    });
  });

  const getNodeColor = (id: string) => {
    if (id === selectedId1) return 'bg-blue-500 text-white';
    if (id === selectedId2) return 'bg-green-500 text-white';
    if (highlightedNodes.has(id)) return 'bg-indigo-200 text-indigo-800';
    return 'bg-gray-200 text-gray-800';
  };

  const getEdgeColor = (parentId: string, childId: string) => {
    const edgeKey = `${parentId}-${childId}`;
    return highlightedEdges.has(edgeKey) ? '#4F46E5' : '#CBD5E0';
  };

  useEffect(() => {
    const drawLines = () => {
      if (!svgRef.current) return;
      
      // Clear existing lines
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      // Draw parent-child relationships
      Object.values(tree.individuals).forEach(individual => {
        if (individual.parents) {
          individual.parents.forEach(parentId => {
            const parentEl = document.getElementById(`node-${parentId}`);
            const childEl = document.getElementById(`node-${individual.id}`);
            
            if (parentEl && childEl) {
              const parentRect = parentEl.getBoundingClientRect();
              const childRect = childEl.getBoundingClientRect();
              const svgRect = svgRef.current?.getBoundingClientRect();
              
              if (svgRect) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                
                const x1 = parentRect.left - svgRect.left + parentRect.width / 2;
                const y1 = parentRect.top - svgRect.top + parentRect.height;
                const x2 = childRect.left - svgRect.left + childRect.width / 2;
                const y2 = childRect.top - svgRect.top;
                
                // Create curved path
                const midY = (y1 + y2) / 2;
                const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
                
                line.setAttribute('d', path);
                line.setAttribute('stroke', getEdgeColor(parentId, individual.id));
                line.setAttribute('stroke-width', '2');
                line.setAttribute('fill', 'none');
                
                svgRef.current.appendChild(line);
              }
            }
          });
        }
      });
    };

    drawLines();
    window.addEventListener('resize', drawLines);
    return () => window.removeEventListener('resize', drawLines);
  }, [tree, highlightedEdges]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start relative overflow-auto">
      <svg ref={svgRef} className="absolute inset-0 pointer-events-none" style={{ minHeight: '100%' }} />
      
      {Object.entries(generations).map(([gen, individuals], genIndex) => (
        <div 
          key={gen} 
          className="flex justify-center gap-8 mb-16 relative w-full"
          style={{ 
            marginTop: genIndex === 0 ? '1rem' : '0',
            zIndex: 1
          }}
        >
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 text-sm text-gray-500 font-medium">
            Gen {gen}
          </div>
          {individuals.map((individual) => (
            <div
              key={individual.id}
              id={`node-${individual.id}`}
              className={`
                relative px-4 py-2 rounded-lg flex flex-col items-center
                shadow-md transition-all duration-200 transform
                hover:scale-110 cursor-pointer min-w-[80px]
                ${getNodeColor(individual.id)}
              `}
              title={`Individual ${individual.id} (Generation ${individual.generation})`}
            >
              <span className="font-medium">ID: {individual.id}</span>
              {individual.parents && (
                <span className="text-xs mt-1 opacity-75">
                  Parents: {individual.parents.join(', ')}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};