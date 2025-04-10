import React, { useState, useEffect } from 'react';
import { TreeDiagram } from './components/TreeDiagram';
import { RelatednessCalculator, StatisticalAnalysis, type FamilyTree, type RelationshipPath } from './lib/genetics';
import { Calculator, Network, BarChart, GitBranch, Brain, User } from 'lucide-react';

// Example family tree for demonstration
const initialTree: FamilyTree = {
  individuals: {
    'A': { id: 'A', generation: 0 },
    'B': { id: 'B', generation: 0 },
    'C': { id: 'C', parents: ['A', 'B'], generation: 1 },
    'D': { id: 'D', parents: ['A', 'B'], generation: 1 },
    'E': { id: 'E', parents: ['C', 'F'], generation: 2 },
    'F': { id: 'F', generation: 1 },
    'G': { id: 'G', parents: ['D', 'F'], generation: 2 },
    'H': { id: 'H', parents: ['E', 'G'], generation: 3 },
  }
};

function App() {
  const [tree, setTree] = useState<FamilyTree>(initialTree);
  const [selectedId1, setSelectedId1] = useState<string>('C');
  const [selectedId2, setSelectedId2] = useState<string>('D');
  const [activeTab, setActiveTab] = useState<'calculator' | 'statistics' | 'visualization' | 'paths' | 'methodology'>('calculator');
  const [relationshipPaths, setRelationshipPaths] = useState<RelationshipPath[]>([]);

  useEffect(() => {
    // Validate and repair tree on load
    const repairedTree = RelatednessCalculator.validateAndRepairTree(tree);
    setTree(repairedTree);
  }, []);

  useEffect(() => {
    const paths = RelatednessCalculator.calculateRelatednessWithPath(tree, selectedId1, selectedId2);
    setRelationshipPaths(paths);
  }, [selectedId1, selectedId2, tree]);

  const relatedness = RelatednessCalculator.calculateRelatedness(tree, selectedId1, selectedId2);
  const commonAncestors = RelatednessCalculator.findCommonAncestors(tree, selectedId1, selectedId2);
  const generationalDistance = RelatednessCalculator.calculateGenerationalDistance(tree, selectedId1, selectedId2);
  const distribution = StatisticalAnalysis.calculateRelatednessDistribution(tree);
  const generationalStats = StatisticalAnalysis.calculateGenerationalStats(tree);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Network className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-semibold">Relatedness Calculator</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Made by Raj Vikrant Brahma</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`${
                  activeTab === 'calculator'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                <Calculator className="w-5 h-5 inline-block mr-2" />
                Calculator
              </button>
              <button
                onClick={() => setActiveTab('paths')}
                className={`${
                  activeTab === 'paths'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                <GitBranch className="w-5 h-5 inline-block mr-2" />
                Relationship Paths
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`${
                  activeTab === 'statistics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                <BarChart className="w-5 h-5 inline-block mr-2" />
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('visualization')}
                className={`${
                  activeTab === 'visualization'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                <Network className="w-5 h-5 inline-block mr-2" />
                Visualization
              </button>
              <button
                onClick={() => setActiveTab('methodology')}
                className={`${
                  activeTab === 'methodology'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-1 py-4 px-1 text-center border-b-2 font-medium`}
              >
                <Brain className="w-5 h-5 inline-block mr-2" />
                Methodology
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab !== 'methodology' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Individual 1</label>
                  <select
                    value={selectedId1}
                    onChange={(e) => setSelectedId1(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.keys(tree.individuals).map((id) => (
                      <option key={id} value={id}>
                        Individual {id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Individual 2</label>
                  <select
                    value={selectedId2}
                    onChange={(e) => setSelectedId2(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {Object.keys(tree.individuals).map((id) => (
                      <option key={id} value={id}>
                        Individual {id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900">Results</h3>
                  <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500">Coefficient of Relatedness</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{relatedness.toFixed(3)}</dd>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500">Generational Distance</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{generationalDistance}</dd>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500">Common Ancestors</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{commonAncestors.length}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'paths' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Relationship Paths</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {relationshipPaths.map((path, index) => (
                    <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{path.description}</span>
                        <span className="text-sm text-gray-500">{path.type}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          {path.path.map((id, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <span className="text-gray-400">→</span>}
                              <span className="px-2 py-1 bg-indigo-100 rounded text-indigo-700">
                                {id}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Contribution to relatedness: {path.coefficient.toFixed(3)}
                        </p>
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {path.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'statistics' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Relatedness Distribution</h4>
                  <div className="space-y-4">
                    {Object.entries(distribution).map(([coefficient, count]) => (
                      <div key={coefficient} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium">r = {coefficient}</span>
                          <span>{count} pairs</span>
                        </div>
                        <div className="relative">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{
                                width: `${(count / Object.values(distribution).reduce((a, b) => a + b, 0)) * 100}%`
                              }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-lg font-medium text-gray-900 mt-8 mb-4">Generational Statistics</h4>
                  <div className="space-y-4">
                    {Object.entries(generationalStats).map(([generation, stats]) => (
                      <div key={generation} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Generation {generation}</span>
                          <span className="text-sm text-gray-500">{stats.count} individuals</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Average relatedness within generation: {stats.averageRelatedness.toFixed(3)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visualization' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Family Tree Visualization</h3>
                <div className="bg-gray-50 rounded-lg p-4" style={{ height: '400px' }}>
                  <TreeDiagram 
                    tree={tree} 
                    selectedId1={selectedId1} 
                    selectedId2={selectedId2}
                    highlightPaths={relationshipPaths}
                  />
                </div>
              </div>
            )}

            {activeTab === 'methodology' && (
              <div className="space-y-8 prose max-w-none">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology Behind the Relatedness Calculator</h2>
                  
                  <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Core Concepts</h3>
                      <p className="text-gray-600">
                        The relatedness calculator implements Wright's coefficient of relatedness, which measures the proportion of identical genes shared between individuals due to common ancestry. The calculation follows these key principles:
                      </p>
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>Each parent contributes exactly 50% of their genes to their offspring</li>
                        <li>The coefficient halves with each generation of separation</li>
                        <li>Multiple paths of relationship are additive in their contribution</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Implementation Details</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">1. Family Tree Structure</h4>
                          <p className="text-gray-600">
                            The family tree is implemented as a directed acyclic graph (DAG) where:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600">
                            <li>Nodes represent individuals</li>
                            <li>Edges represent parent-child relationships</li>
                            <li>Each individual stores their generation number and parent references</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-gray-800">2. Path Finding Algorithm</h4>
                          <p className="text-gray-600">
                            To calculate relatedness, the algorithm:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600">
                            <li>Identifies common ancestors between two individuals</li>
                            <li>Finds all possible paths through these common ancestors</li>
                            <li>Calculates the contribution of each path (0.5^n where n is the path length)</li>
                            <li>Sums the contributions to get the final coefficient</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-gray-800">3. Statistical Analysis</h4>
                          <p className="text-gray-600">
                            The calculator includes several statistical measures:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600">
                            <li>Distribution of relatedness coefficients across the tree</li>
                            <li>Generation-wise analysis of relationships</li>
                            <li>Average relatedness within generations</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium text-gray-800">4. Visualization</h4>
                          <p className="text-gray-600">
                            The tree visualization uses:
                          </p>
                          <ul className="list-disc pl-6 text-gray-600">
                            <li>SVG for dynamic line drawing</li>
                            <li>Hierarchical layout based on generations</li>
                            <li>Interactive highlighting of relationship paths</li>
                            <li>Color coding to indicate relationships and selections</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Technical Challenges</h3>
                      <ul className="list-disc pl-6 text-gray-600">
                        <li>Handling complex relationship paths with multiple common ancestors</li>
                        <li>Efficient path finding in large family trees</li>
                        <li>Accurate calculation of combined relatedness coefficients</li>
                        <li>Dynamic visualization of relationship paths</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;