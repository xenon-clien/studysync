import React, { useState } from 'react';
import { LuZoomIn, LuCheck, LuInfo } from 'react-icons/lu';

/**
 * High-definition visual vector diagram library for StudySync.
 * Renders interactive, crisp SVG illustrations and architectural flowcharts
 * across all engineering subjects and units.
 */
export default function VisualDiagram({ type = 'generic', title, caption, style }) {
  const [zoomed, setZoomed] = useState(false);

  // Normalize diagram key
  const key = (type || '').toLowerCase().trim();

  // Color tokens
  const c = {
    bg: 'var(--paper, #FFFFFF)',
    border: 'var(--line, #E5E7EB)',
    ink: 'var(--ink, #1F2937)',
    muted: 'var(--ink-faint, #6B7280)',
    amber: '#E8A33D',
    amberLight: '#FEF3C7',
    amberDeep: '#B45309',
    sage: '#10B981',
    sageLight: '#D1FAE5',
    sageDeep: '#047857',
    coral: '#EF4444',
    coralLight: '#FEE2E2',
    coralDeep: '#B91C1C',
    slate: '#3B82F6',
    slateLight: '#DBEAFE',
    slateDeep: '#1D4ED8',
    purple: '#8B5CF6',
    purpleLight: '#EDE9FE',
    purpleDeep: '#6D28D9',
  };

  const renderSvg = () => {
    // 1. Machine Learning: Gradient Descent
    if (key.includes('gradient') || key.includes('linear-reg') || key.includes('cost-func')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Axes */}
          <line x1="60" y1="200" x2="480" y2="200" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="60" y1="200" x2="60" y2="30" stroke={c.ink} strokeWidth="2" />
          <text x="440" y="222" fill={c.muted} fontSize="12" fontWeight="600">Weight (w)</text>
          <text x="25" y="35" fill={c.muted} fontSize="12" fontWeight="600" transform="rotate(-90 25 35)">Loss J(w)</text>

          {/* Convex Cost Parabola */}
          <path d="M 100 60 Q 270 240 440 60" fill="none" stroke={c.slateDeep} strokeWidth="3.5" />

          {/* Gradient Descent steps */}
          <circle cx="130" cy="85" r="6" fill={c.coral} />
          <text x="142" y="85" fill={c.coralDeep} fontSize="11" fontWeight="700">Initial w0</text>

          <path d="M 130 85 Q 165 125 190 135" fill="none" stroke={c.amberDeep} strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
          <circle cx="190" cy="135" r="5" fill={c.amber} />

          <path d="M 190 135 Q 225 155 245 160" fill="none" stroke={c.amberDeep} strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
          <circle cx="245" cy="160" r="5" fill={c.amber} />

          {/* Global Minimum */}
          <circle cx="270" cy="165" r="7" fill={c.sage} stroke="#FFF" strokeWidth="2" />
          <text x="285" y="170" fill={c.sageDeep} fontSize="12" fontWeight="700">Global Minimum J(w)*</text>

          {/* Formula pill */}
          <rect x="290" y="30" width="230" height="42" rx="8" fill="#FFF" stroke={c.amber} strokeWidth="1.5" />
          <text x="305" y="55" fill={c.ink} fontSize="12" fontWeight="600">w := w - α · ∂J/∂w (Step Update)</text>
        </svg>
      );
    }

    // 2. Machine Learning: Sigmoid / Logistic Regression
    if (key.includes('sigmoid') || key.includes('logistic')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <line x1="60" y1="180" x2="480" y2="180" stroke={c.ink} strokeWidth="1.5" />
          <line x1="270" y1="210" x2="270" y2="30" stroke={c.ink} strokeWidth="1.5" />
          
          <line x1="60" y1="60" x2="480" y2="60" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4" />
          <text x="40" y="65" fill={c.muted} fontSize="11" fontWeight="700">1.0</text>
          <text x="40" y="125" fill={c.amberDeep} fontSize="11" fontWeight="700">0.5</text>
          <text x="40" y="185" fill={c.muted} fontSize="11" fontWeight="700">0.0</text>
          <line x1="60" y1="120" x2="480" y2="120" stroke={c.amber} strokeWidth="1" strokeDasharray="3" />

          {/* S-curve */}
          <path d="M 80 178 C 210 178, 220 62, 460 62" fill="none" stroke={c.purpleDeep} strokeWidth="3.5" />

          {/* Decision boundary annotation */}
          <rect x="300" y="130" width="210" height="50" rx="8" fill="#FFF" stroke={c.purple} strokeWidth="1.5" />
          <text x="315" y="150" fill={c.ink} fontSize="11" fontWeight="700">Threshold = 0.5 (Decision)</text>
          <text x="315" y="168" fill={c.muted} fontSize="11">z ≥ 0 → Class 1 | z &lt; 0 → Class 0</text>
          
          <text x="80" y="38" fill={c.purpleDeep} fontSize="13" fontWeight="700">σ(z) = 1 / (1 + e^-z)</text>
        </svg>
      );
    }

    // 3. Machine Learning: Confusion Matrix
    if (key.includes('confusion') || key.includes('metric') || key.includes('precision') || key.includes('eval')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Header */}
          <text x="180" y="28" fill={c.ink} fontSize="13" fontWeight="700">Predicted Positive</text>
          <text x="350" y="28" fill={c.ink} fontSize="13" fontWeight="700">Predicted Negative</text>
          <text x="25" y="90" fill={c.ink} fontSize="12" fontWeight="700" transform="rotate(-90 25 90)">Actual Positive</text>
          <text x="25" y="175" fill={c.ink} fontSize="12" fontWeight="700" transform="rotate(-90 25 175)">Actual Negative</text>

          {/* TP */}
          <rect x="140" y="42" width="160" height="75" rx="8" fill={c.sageLight} stroke={c.sage} strokeWidth="2" />
          <text x="180" y="75" fill={c.sageDeep} fontSize="16" fontWeight="800">True Positive (TP)</text>
          <text x="180" y="98" fill={c.sageDeep} fontSize="11">Correctly Detected</text>

          {/* FN */}
          <rect x="315" y="42" width="160" height="75" rx="8" fill={c.coralLight} stroke={c.coral} strokeWidth="2" />
          <text x="350" y="75" fill={c.coralDeep} fontSize="16" fontWeight="800">False Negative (FN)</text>
          <text x="350" y="98" fill={c.coralDeep} fontSize="11">Type II Error (Missed)</text>

          {/* FP */}
          <rect x="140" y="127" width="160" height="75" rx="8" fill={c.coralLight} stroke={c.coral} strokeWidth="2" />
          <text x="180" y="160" fill={c.coralDeep} fontSize="16" fontWeight="800">False Positive (FP)</text>
          <text x="180" y="183" fill={c.coralDeep} fontSize="11">Type I Error (False Alarm)</text>

          {/* TN */}
          <rect x="315" y="127" width="160" height="75" rx="8" fill={c.sageLight} stroke={c.sage} strokeWidth="2" />
          <text x="350" y="160" fill={c.sageDeep} fontSize="16" fontWeight="800">True Negative (TN)</text>
          <text x="350" y="183" fill={c.sageDeep} fontSize="11">Correctly Rejected</text>

          <text x="140" y="222" fill={c.muted} fontSize="11" fontWeight="600">Precision = TP / (TP + FP)  |  Recall = TP / (TP + FN)  |  F1 = 2PR / (P + R)</text>
        </svg>
      );
    }

    // 4. Machine Learning: Neural Network / ANN / Backpropagation
    if (key.includes('neural') || key.includes('ann') || key.includes('backprop') || key.includes('deep-learn')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Connections */}
          {[60, 120, 180].map((y1, i) =>
            [40, 90, 140, 190].map((y2, j) => (
              <line key={`c1-${i}-${j}`} x1="120" y1={y1} x2="270" y2={y2} stroke="#CBD5E1" strokeWidth="1.2" />
            ))
          )}
          {[40, 90, 140, 190].map((y2, j) =>
            [90, 150].map((y3, k) => (
              <line key={`c2-${j}-${k}`} x1="270" y1={y2} x2="420" y2={y3} stroke="#CBD5E1" strokeWidth="1.2" />
            ))
          )}

          {/* Input Layer */}
          <text x="90" y="25" fill={c.muted} fontSize="12" fontWeight="700">Input Layer</text>
          {[60, 120, 180].map((y, i) => (
            <g key={`in-${i}`}>
              <circle cx="120" cy={y} r="16" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
              <text x="113" y={y + 5} fill={c.slateDeep} fontSize="11" fontWeight="700">X{i + 1}</text>
            </g>
          ))}

          {/* Hidden Layer */}
          <text x="240" y="25" fill={c.muted} fontSize="12" fontWeight="700">Hidden Layer</text>
          {[40, 90, 140, 190].map((y, j) => (
            <g key={`hid-${j}`}>
              <circle cx="270" cy={y} r="16" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
              <text x="263" y={y + 5} fill={c.amberDeep} fontSize="11" fontWeight="700">h{j + 1}</text>
            </g>
          ))}

          {/* Output Layer */}
          <text x="390" y="25" fill={c.muted} fontSize="12" fontWeight="700">Output Layer</text>
          {[90, 150].map((y, k) => (
            <g key={`out-${k}`}>
              <circle cx="420" cy={y} r="16" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
              <text x="414" y={y + 5} fill={c.sageDeep} fontSize="11" fontWeight="700">Y{k + 1}</text>
            </g>
          ))}

          {/* Backpropagation arrow */}
          <path d="M 400 215 L 140 215" fill="none" stroke={c.coral} strokeWidth="2" strokeDasharray="5" markerEnd="url(#arrow)" />
          <text x="210" y="210" fill={c.coralDeep} fontSize="11" fontWeight="700">◄ Backpropagation (Chain Rule Error Update)</text>
        </svg>
      );
    }

    // 5. Machine Learning: Decision Tree (ID3 / Information Gain)
    if (key.includes('decision-tree') || key.includes('tree') || key.includes('id3') || key.includes('entropy')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Root node */}
          <rect x="200" y="20" width="140" height="38" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="220" y="44" fill={c.amberDeep} fontSize="12" fontWeight="800">Weather (Root)</text>

          {/* Lines */}
          <line x1="230" y1="58" x2="120" y2="105" stroke={c.ink} strokeWidth="1.5" />
          <line x1="270" y1="58" x2="270" y2="105" stroke={c.ink} strokeWidth="1.5" />
          <line x1="310" y1="58" x2="420" y2="105" stroke={c.ink} strokeWidth="1.5" />

          <text x="135" y="85" fill={c.muted} fontSize="11" fontWeight="600">Sunny</text>
          <text x="275" y="85" fill={c.muted} fontSize="11" fontWeight="600">Overcast</text>
          <text x="375" y="85" fill={c.muted} fontSize="11" fontWeight="600">Rainy</text>

          {/* Internal Node Left */}
          <rect x="60" y="105" width="120" height="36" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.5" />
          <text x="75" y="128" fill={c.slateDeep} fontSize="11" fontWeight="700">Humidity &gt; 70%?</text>

          {/* Leaf Overcast */}
          <rect x="220" y="105" width="100" height="36" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.5" />
          <text x="240" y="128" fill={c.sageDeep} fontSize="12" fontWeight="800">PLAY (Yes)</text>

          {/* Internal Node Right */}
          <rect x="360" y="105" width="120" height="36" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.5" />
          <text x="382" y="128" fill={c.slateDeep} fontSize="11" fontWeight="700">Wind Strong?</text>

          {/* Final Leaves */}
          <line x1="90" y1="141" x2="70" y2="180" stroke={c.ink} strokeWidth="1" />
          <line x1="150" y1="141" x2="170" y2="180" stroke={c.ink} strokeWidth="1" />
          <rect x="30" y="180" width="75" height="32" rx="6" fill={c.coralLight} stroke={c.coral} strokeWidth="1.5" />
          <text x="44" y="201" fill={c.coralDeep} fontSize="11" fontWeight="800">NO (Stay)</text>
          <rect x="135" y="180" width="75" height="32" rx="6" fill={c.sageLight} stroke={c.sage} strokeWidth="1.5" />
          <text x="149" y="201" fill={c.sageDeep} fontSize="11" fontWeight="800">YES (Play)</text>

          <line x1="390" y1="141" x2="370" y2="180" stroke={c.ink} strokeWidth="1" />
          <line x1="450" y1="141" x2="470" y2="180" stroke={c.ink} strokeWidth="1" />
          <rect x="330" y="180" width="75" height="32" rx="6" fill={c.coralLight} stroke={c.coral} strokeWidth="1.5" />
          <text x="344" y="201" fill={c.coralDeep} fontSize="11" fontWeight="800">NO (Stay)</text>
          <rect x="435" y="180" width="75" height="32" rx="6" fill={c.sageLight} stroke={c.sage} strokeWidth="1.5" />
          <text x="449" y="201" fill={c.sageDeep} fontSize="11" fontWeight="800">YES (Play)</text>
        </svg>
      );
    }

    // 6. Machine Learning: SVM (Support Vector Machine Margin)
    if (key.includes('svm') || key.includes('hyperplane') || key.includes('margin')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Hyperplane Center */}
          <line x1="80" y1="210" x2="440" y2="30" stroke={c.ink} strokeWidth="3" />
          <text x="410" y="24" fill={c.ink} fontSize="11" fontWeight="700">w·x + b = 0</text>

          {/* Margin Dashed Lines */}
          <line x1="40" y1="180" x2="400" y2="0" stroke={c.slate} strokeWidth="2" strokeDasharray="5" />
          <line x1="120" y1="240" x2="480" y2="60" stroke={c.coral} strokeWidth="2" strokeDasharray="5" />

          {/* Support Vectors */}
          <circle cx="160" cy="90" r="12" fill="none" stroke={c.slateDeep} strokeWidth="2.5" strokeDasharray="2" />
          <circle cx="160" cy="90" r="6" fill={c.slate} />
          <text x="90" y="85" fill={c.slateDeep} fontSize="11" fontWeight="700">Support Vector 1</text>

          <circle cx="360" cy="180" r="12" fill="none" stroke={c.coralDeep} strokeWidth="2.5" strokeDasharray="2" />
          <circle cx="360" cy="180" r="6" fill={c.coral} />
          <text x="380" y="185" fill={c.coralDeep} fontSize="11" fontWeight="700">Support Vector 2</text>

          {/* Other points */}
          <circle cx="100" cy="50" r="6" fill={c.slate} />
          <circle cx="140" cy="40" r="6" fill={c.slate} />
          <circle cx="420" cy="210" r="6" fill={c.coral} />
          <circle cx="460" cy="190" r="6" fill={c.coral} />

          {/* Margin width arrow */}
          <line x1="220" y1="100" x2="265" y2="135" stroke={c.amberDeep} strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="230" y="145" width="130" height="30" rx="6" fill="#FFF" stroke={c.amber} strokeWidth="1.5" />
          <text x="242" y="165" fill={c.amberDeep} fontSize="11" fontWeight="800">Margin = 2 / ||w||</text>
        </svg>
      );
    }

    // 7. Discrete Structures: Hasse Diagram (Poset / Divisibility D24 / D36)
    if (key.includes('hasse') || key.includes('poset') || key.includes('lattice') || key.includes('relation')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="180" y="24" fill={c.ink} fontSize="12" fontWeight="700">Hasse Diagram for Divisibility D24 = {'{1, 2, 3, 4, 6, 8, 12, 24}'}</text>

          {/* Edges */}
          <line x1="270" y1="205" x2="190" y2="155" stroke={c.ink} strokeWidth="1.8" />
          <line x1="270" y1="205" x2="350" y2="155" stroke={c.ink} strokeWidth="1.8" />
          
          <line x1="190" y1="155" x2="140" y2="105" stroke={c.ink} strokeWidth="1.8" />
          <line x1="190" y1="155" x2="270" y2="105" stroke={c.ink} strokeWidth="1.8" />
          <line x1="350" y1="155" x2="270" y2="105" stroke={c.ink} strokeWidth="1.8" />

          <line x1="140" y1="105" x2="190" y2="55" stroke={c.ink} strokeWidth="1.8" />
          <line x1="270" y1="105" x2="350" y2="55" stroke={c.ink} strokeWidth="1.8" />
          <line x1="140" y1="105" x2="350" y2="55" stroke={c.ink} strokeWidth="1.8" />

          <line x1="190" y1="55" x2="270" y2="35" stroke={c.ink} strokeWidth="1.8" />
          <line x1="350" y1="55" x2="270" y2="35" stroke={c.ink} strokeWidth="1.8" />

          {/* Nodes */}
          {/* Level 0: 1 */}
          <circle cx="270" cy="205" r="14" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="267" y="210" fill={c.slateDeep} fontSize="12" fontWeight="800">1</text>

          {/* Level 1: 2, 3 */}
          <circle cx="190" cy="155" r="14" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="187" y="160" fill={c.amberDeep} fontSize="12" fontWeight="800">2</text>
          <circle cx="350" cy="155" r="14" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="347" y="160" fill={c.amberDeep} fontSize="12" fontWeight="800">3</text>

          {/* Level 2: 4, 6 */}
          <circle cx="140" cy="105" r="14" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="137" y="110" fill={c.purpleDeep} fontSize="12" fontWeight="800">4</text>
          <circle cx="270" cy="105" r="14" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="267" y="110" fill={c.purpleDeep} fontSize="12" fontWeight="800">6</text>

          {/* Level 3: 8, 12 */}
          <circle cx="190" cy="55" r="14" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="187" y="60" fill={c.sageDeep} fontSize="12" fontWeight="800">8</text>
          <circle cx="350" cy="55" r="14" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="344" y="60" fill={c.sageDeep} fontSize="12" fontWeight="800">12</text>

          {/* Level 4: 24 (Top) */}
          <circle cx="270" cy="35" r="15" fill={c.coralLight} stroke={c.coralDeep} strokeWidth="2" />
          <text x="263" y="40" fill={c.coralDeep} fontSize="12" fontWeight="800">24</text>

          <text x="390" y="215" fill={c.muted} fontSize="10">✓ No loops, No arrows, Transitive edges deleted!</text>
        </svg>
      );
    }

    // 8. Discrete Structures: Euler vs Hamiltonian / Planar
    if (key.includes('euler') || key.includes('graph') || key.includes('planar') || key.includes('hamiltonian')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          {/* Euler Graph */}
          <g transform="translate(40, 20)">
            <text x="40" y="20" fill={c.amberDeep} fontSize="13" fontWeight="800">Eulerian Circuit (Traverse All Edges)</text>
            <polygon points="100,50 40,150 160,150" fill="none" stroke={c.slate} strokeWidth="2" />
            <polygon points="100,120 40,150 160,150" fill="none" stroke={c.slate} strokeWidth="2" />
            <circle cx="100" cy="50" r="10" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="96" y="54" fontSize="10" fontWeight="700">A</text>
            <circle cx="40" cy="150" r="10" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="36" y="154" fontSize="10" fontWeight="700">B</text>
            <circle cx="160" cy="150" r="10" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="156" y="154" fontSize="10" fontWeight="700">C</text>
            <text x="15" y="185" fill={c.muted} fontSize="11">Condition: Every vertex has EVEN degree!</text>
          </g>

          {/* Planar Formula */}
          <g transform="translate(300, 20)">
            <text x="30" y="20" fill={c.sageDeep} fontSize="13" fontWeight="800">Euler's Planar Formula: V - E + F = 2</text>
            <rect x="30" y="50" width="140" height="90" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
            <line x1="30" y1="50" x2="170" y2="140" stroke={c.sageDeep} strokeWidth="2" />
            <circle cx="30" cy="50" r="6" fill={c.sage} />
            <circle cx="170" cy="50" r="6" fill={c.sage} />
            <circle cx="30" cy="140" r="6" fill={c.sage} />
            <circle cx="170" cy="140" r="6" fill={c.sage} />
            <text x="70" y="85" fill={c.sageDeep} fontSize="11" fontWeight="700">Face 1</text>
            <text x="120" y="115" fill={c.sageDeep} fontSize="11" fontWeight="700">Face 2</text>
            <text x="30" y="185" fill={c.muted} fontSize="11">V=4, E=5, F=3 → 4 - 5 + 3 = 2 ✓</text>
          </g>
        </svg>
      );
    }

    // 9. DBMS: Normalization Ladder (1NF to BCNF)
    if (key.includes('normal') || key.includes('bcnf') || key.includes('1nf') || key.includes('2nf') || key.includes('3nf')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="25" fill={c.ink} fontSize="13" fontWeight="700">Relational Database Normalization Ladder</text>

          {/* Steps */}
          {/* 1NF */}
          <rect x="40" y="160" width="105" height="55" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="75" y="185" fill={c.slateDeep} fontSize="13" fontWeight="800">1 NF</text>
          <text x="50" y="202" fill={c.slateDeep} fontSize="10">Atomic Values</text>

          <line x1="145" y1="185" x2="165" y2="155" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          {/* 2NF */}
          <rect x="165" y="125" width="105" height="55" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="200" y="150" fill={c.amberDeep} fontSize="13" fontWeight="800">2 NF</text>
          <text x="175" y="167" fill={c.amberDeep} fontSize="10">No Partial Key Dep</text>

          <line x1="270" y1="150" x2="290" y2="120" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          {/* 3NF */}
          <rect x="290" y="90" width="105" height="55" rx="8" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="325" y="115" fill={c.purpleDeep} fontSize="13" fontWeight="800">3 NF</text>
          <text x="298" y="132" fill={c.purpleDeep} fontSize="10">No Transitive Dep</text>

          <line x1="395" y1="115" x2="415" y2="85" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          {/* BCNF */}
          <rect x="415" y="55" width="105" height="55" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="445" y="80" fill={c.sageDeep} fontSize="13" fontWeight="800">BCNF</text>
          <text x="422" y="97" fill={c.sageDeep} fontSize="10">Strict Superkey (X→A)</text>
        </svg>
      );
    }

    // 10. DBMS: B+ Tree Indexing
    if (key.includes('b+tree') || key.includes('btree') || key.includes('index')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="175" y="24" fill={c.ink} fontSize="13" fontWeight="700">B+ Tree Multi-Level Index Architecture</text>

          {/* Root Node */}
          <rect x="220" y="45" width="100" height="35" rx="6" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="245" y="68" fill={c.purpleDeep} fontSize="12" fontWeight="800">[ 50 | • ]</text>

          {/* Internal Nodes */}
          <line x1="240" y1="80" x2="140" y2="115" stroke={c.ink} strokeWidth="1.5" />
          <line x1="300" y1="80" x2="400" y2="115" stroke={c.ink} strokeWidth="1.5" />

          <rect x="80" y="115" width="120" height="35" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="105" y="138" fill={c.slateDeep} fontSize="12" fontWeight="800">[ 20 | 35 ]</text>

          <rect x="340" y="115" width="120" height="35" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="365" y="138" fill={c.slateDeep} fontSize="12" fontWeight="800">[ 70 | 85 ]</text>

          {/* Leaf Nodes */}
          <rect x="20" y="180" width="105" height="35" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="35" y="202" fill={c.sageDeep} fontSize="11" fontWeight="800">[ 10, 15 → ]</text>

          <rect x="150" y="180" width="105" height="35" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="165" y="202" fill={c.sageDeep} fontSize="11" fontWeight="800">[ 20, 30 → ]</text>

          <rect x="285" y="180" width="105" height="35" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="300" y="202" fill={c.sageDeep} fontSize="11" fontWeight="800">[ 50, 60 → ]</text>

          <rect x="415" y="180" width="105" height="35" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="430" y="202" fill={c.sageDeep} fontSize="11" fontWeight="800">[ 70, 90 ]</text>

          {/* Linked List pointer between leaves */}
          <line x1="125" y1="197" x2="150" y2="197" stroke={c.coral} strokeWidth="2.5" markerEnd="url(#arrow)" />
          <line x1="255" y1="197" x2="285" y2="197" stroke={c.coral} strokeWidth="2.5" markerEnd="url(#arrow)" />
          <line x1="390" y1="197" x2="415" y2="197" stroke={c.coral} strokeWidth="2.5" markerEnd="url(#arrow)" />

          <text x="20" y="230" fill={c.muted} fontSize="10">✓ All real data sits at Leaf Level; leaves are linked as Doubly Linked List for blazing range queries!</text>
        </svg>
      );
    }

    // 11. Operating Systems: Virtual Memory Paging & TLB
    if (key.includes('paging') || key.includes('virtual-mem') || key.includes('tlb') || key.includes('memory')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="150" y="24" fill={c.ink} fontSize="13" fontWeight="700">Virtual Memory Address Translation & TLB</text>

          {/* CPU Virtual Address */}
          <rect x="40" y="50" width="140" height="45" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="50" y="70" fill={c.slateDeep} fontSize="11" fontWeight="800">CPU Logical Address</text>
          <text x="60" y="87" fill={c.slateDeep} fontSize="11">[ Page p | Offset d ]</text>

          {/* TLB Cache */}
          <line x1="180" y1="72" x2="230" y2="72" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="230" y="45" width="120" height="55" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="245" y="68" fill={c.amberDeep} fontSize="12" fontWeight="800">TLB (Cache)</text>
          <text x="240" y="88" fill={c.sageDeep} fontSize="10" fontWeight="700">TLB Hit → Fast Frame!</text>

          {/* Page Table */}
          <line x1="290" y1="100" x2="290" y2="135" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="230" y="135" width="120" height="85" rx="8" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="248" y="155" fill={c.purpleDeep} fontSize="11" fontWeight="800">Page Table</text>
          <text x="245" y="175" fill={c.purpleDeep} fontSize="10">Page 0 → Frame 5</text>
          <text x="245" y="193" fill={c.purpleDeep} fontSize="10">Page 1 → Frame 2</text>
          <text x="245" y="210" fill={c.coralDeep} fontSize="10">Page 2 → Page Fault!</text>

          {/* Physical RAM */}
          <line x1="350" y1="72" x2="410" y2="72" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
          <rect x="410" y="45" width="110" height="175" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="425" y="70" fill={c.sageDeep} fontSize="12" fontWeight="800">Physical RAM</text>
          <text x="430" y="100" fill={c.sageDeep} fontSize="10">[Frame 0]</text>
          <text x="430" y="130" fill={c.sageDeep} fontSize="10">[Frame 1]</text>
          <text x="430" y="160" fill={c.sageDeep} fontSize="10">[Frame 2: Code]</text>
          <text x="430" y="190" fill={c.sageDeep} fontSize="10">[Frame 5: Data]</text>
        </svg>
      );
    }

    // 12. Operating Systems: Process State Transition
    if (key.includes('process') || key.includes('scheduling') || key.includes('state')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="170" y="24" fill={c.ink} fontSize="13" fontWeight="700">5-State Process Model & Transitions</text>

          {/* New */}
          <rect x="30" y="90" width="80" height="45" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
          <text x="52" y="118" fill={c.slateDeep} fontSize="13" fontWeight="800">NEW</text>

          <line x1="110" y1="112" x2="160" y2="112" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="115" y="105" fill={c.muted} fontSize="10">Admitted</text>

          {/* Ready */}
          <rect x="160" y="90" width="90" height="45" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
          <text x="182" y="118" fill={c.amberDeep} fontSize="13" fontWeight="800">READY</text>

          {/* Dispatch */}
          <line x1="250" y1="102" x2="310" y2="102" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="255" y="95" fill={c.muted} fontSize="10">Dispatch</text>

          {/* Interrupt (Running to Ready) */}
          <path d="M 320 90 Q 285 55 240 90" fill="none" stroke={c.coral} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="260" y="65" fill={c.coralDeep} fontSize="10">Interrupt</text>

          {/* Running */}
          <rect x="310" y="90" width="90" height="45" rx="8" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="2" />
          <text x="325" y="118" fill={c.purpleDeep} fontSize="13" fontWeight="800">RUNNING</text>

          {/* Exit / Terminated */}
          <line x1="400" y1="112" x2="445" y2="112" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <rect x="445" y="90" width="80" height="45" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
          <text x="455" y="118" fill={c.sageDeep} fontSize="12" fontWeight="800">EXIT</text>

          {/* Waiting / Blocked */}
          <path d="M 355 135 Q 355 180 295 180" fill="none" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="325" y="165" fill={c.muted} fontSize="10">I/O Wait</text>

          <rect x="210" y="160" width="90" height="45" rx="8" fill={c.coralLight} stroke={c.coralDeep} strokeWidth="2" />
          <text x="228" y="188" fill={c.coralDeep} fontSize="12" fontWeight="800">WAITING</text>

          <path d="M 210 180 Q 170 180 170 135" fill="none" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
          <text x="120" y="170" fill={c.muted} fontSize="10">I/O Done</text>
        </svg>
      );
    }

    // 13. Compiler Design: 6 Phases of Compiler
    if (key.includes('compiler') || key.includes('parser') || key.includes('lex') || key.includes('syntax')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="180" y="24" fill={c.ink} fontSize="13" fontWeight="700">6 Phases of Compiler Pipeline</text>

          {/* Phase Boxes */}
          <g transform="translate(30, 45)">
            <rect x="0" y="0" width="130" height="35" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.5" />
            <text x="10" y="22" fill={c.slateDeep} fontSize="11" fontWeight="700">1. Lexical (Scanner)</text>

            <line x1="130" y1="17" x2="160" y2="17" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="160" y="0" width="130" height="35" rx="6" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="1.5" />
            <text x="175" y="22" fill={c.amberDeep} fontSize="11" fontWeight="700">2. Syntax (Parser)</text>

            <line x1="290" y1="17" x2="320" y2="17" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="320" y="0" width="140" height="35" rx="6" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="1.5" />
            <text x="330" y="22" fill={c.purpleDeep} fontSize="11" fontWeight="700">3. Semantic Analyzer</text>
          </g>

          <g transform="translate(30, 105)">
            <rect x="320" y="0" width="140" height="35" rx="6" fill={c.coralLight} stroke={c.coralDeep} strokeWidth="1.5" />
            <text x="330" y="22" fill={c.coralDeep} fontSize="11" fontWeight="700">4. Intermediate Code</text>

            <line x1="320" y1="17" x2="290" y2="17" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="160" y="0" width="130" height="35" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.5" />
            <text x="175" y="22" fill={c.sageDeep} fontSize="11" fontWeight="700">5. Code Optimizer</text>

            <line x1="160" y1="17" x2="130" y2="17" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="0" y="0" width="130" height="35" rx="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <text x="12" y="22" fill="#854D0E" fontSize="11" fontWeight="700">6. Target Code Gen</text>
          </g>

          {/* Symbol Table & Error Handler Shared Bar */}
          <rect x="30" y="165" width="220" height="45" rx="8" fill="#F1F5F9" stroke={c.ink} strokeWidth="1.5" />
          <text x="70" y="192" fill={c.ink} fontSize="12" fontWeight="700">🗂️ Symbol Table Manager</text>

          <rect x="270" y="165" width="220" height="45" rx="8" fill="#FEE2E2" stroke={c.coral} strokeWidth="1.5" />
          <text x="320" y="192" fill={c.coralDeep} fontSize="12" fontWeight="700">⚠️ Error Handler</text>
        </svg>
      );
    }

    // 14. Computer Networks: OSI 7-Layers vs TCP/IP Stack
    if (key.includes('network') || key.includes('osi') || key.includes('tcp') || key.includes('ip')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="140" y="24" fill={c.ink} fontSize="13" fontWeight="700">OSI 7 Layers vs TCP/IP 4-Layer Architecture</text>

          {/* OSI Layers */}
          <g transform="translate(30, 40)">
            <text x="40" y="-8" fill={c.purpleDeep} fontSize="12" fontWeight="800">OSI 7 Layers</text>
            {['7. Application (HTTP, DNS)', '6. Presentation (SSL, JSON)', '5. Session (RPC, Sockets)', '4. Transport (TCP, UDP)', '3. Network (IP, Routers)', '2. Data Link (Ethernet, MAC)', '1. Physical (Bits, Cables)'].map((l, i) => (
              <rect key={`osi-${i}`} x="0" y={i * 24} width="220" height="20" rx="4" fill={i < 3 ? c.purpleLight : i === 3 ? c.slateLight : i === 4 ? c.amberLight : c.sageLight} stroke={c.border} />
            ))}
            {['7. Application (HTTP, DNS)', '6. Presentation (SSL, JSON)', '5. Session (RPC, Sockets)', '4. Transport (TCP, UDP)', '3. Network (IP, Routers)', '2. Data Link (Ethernet, MAC)', '1. Physical (Bits, Cables)'].map((l, i) => (
              <text key={`ot-${i}`} x="12" y={i * 24 + 14} fontSize="10" fontWeight="600" fill={c.ink}>{l}</text>
            ))}
          </g>

          {/* Mapping Lines */}
          <path d="M 255 75 L 305 60" stroke={c.muted} strokeWidth="1.5" strokeDasharray="3" />
          <path d="M 255 115 L 305 110" stroke={c.muted} strokeWidth="1.5" strokeDasharray="3" />
          <path d="M 255 140 L 305 140" stroke={c.muted} strokeWidth="1.5" strokeDasharray="3" />
          <path d="M 255 175 L 305 180" stroke={c.muted} strokeWidth="1.5" strokeDasharray="3" />

          {/* TCP/IP Layers */}
          <g transform="translate(310, 40)">
            <text x="40" y="-8" fill={c.slateDeep} fontSize="12" fontWeight="800">TCP/IP 4 Layers</text>
            <rect x="0" y="0" width="200" height="60" rx="6" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="1.5" />
            <text x="30" y="35" fill={c.purpleDeep} fontSize="11" fontWeight="700">Application Layer</text>

            <rect x="0" y="68" width="200" height="35" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.5" />
            <text x="35" y="90" fill={c.slateDeep} fontSize="11" fontWeight="700">Transport (Host-to-Host)</text>

            <rect x="0" y="110" width="200" height="35" rx="6" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="1.5" />
            <text x="45" y="132" fill={c.amberDeep} fontSize="11" fontWeight="700">Internet (IP Layer)</text>

            <rect x="0" y="152" width="200" height="42" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.5" />
            <text x="35" y="178" fill={c.sageDeep} fontSize="11" fontWeight="700">Network Access (Host-Net)</text>
          </g>
        </svg>
      );
    }

    // 15. Data Structures: AVL Tree Self-Balancing Rotations
    if (key.includes('avl') || key.includes('dsa') || key.includes('binary-tree') || key.includes('tree-rotation') || key.includes('heap') || key.includes('stack') || key.includes('queue')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="175" y="24" fill={c.ink} fontSize="13" fontWeight="700">AVL Tree Self-Balancing Rotations (LL, RR)</text>

          {/* Left: Unbalanced */}
          <g transform="translate(40, 40)">
            <text x="35" y="0" fill={c.coralDeep} fontSize="11" fontWeight="700">Left-Heavy (BF = +2)</text>
            <line x1="70" y1="20" x2="40" y2="60" stroke={c.ink} strokeWidth="1.8" />
            <line x1="40" y1="60" x2="20" y2="105" stroke={c.ink} strokeWidth="1.8" />
            
            <circle cx="70" cy="20" r="14" fill={c.coralLight} stroke={c.coralDeep} strokeWidth="2" />
            <text x="64" y="25" fontSize="12" fontWeight="800">30</text>

            <circle cx="40" cy="60" r="14" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="34" y="65" fontSize="12" fontWeight="800">20</text>

            <circle cx="20" cy="105" r="14" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
            <text x="14" y="110" fontSize="12" fontWeight="800">10</text>
          </g>

          {/* Arrow */}
          <g transform="translate(180, 95)">
            <path d="M 0 10 Q 30 -15 60 10" fill="none" stroke={c.purple} strokeWidth="2.5" markerEnd="url(#arrow)" />
            <text x="5" y="32" fill={c.purpleDeep} fontSize="11" fontWeight="800">Right Rotation (LL)</text>
          </g>

          {/* Right: Balanced */}
          <g transform="translate(320, 40)">
            <text x="35" y="0" fill={c.sageDeep} fontSize="11" fontWeight="700">Balanced (BF = 0 for all)</text>
            <line x1="70" y1="30" x2="35" y2="80" stroke={c.ink} strokeWidth="1.8" />
            <line x1="70" y1="30" x2="105" y2="80" stroke={c.ink} strokeWidth="1.8" />

            <circle cx="70" cy="30" r="15" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
            <text x="64" y="35" fontSize="12" fontWeight="800">20</text>

            <circle cx="35" cy="80" r="14" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
            <text x="29" y="85" fontSize="12" fontWeight="800">10</text>

            <circle cx="105" cy="80" r="14" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="99" y="85" fontSize="12" fontWeight="800">30</text>
          </g>
          
          <text x="70" y="215" fill={c.muted} fontSize="11">✓ Balance Factor = Height(Left) - Height(Right). Allowed values: {'{-1, 0, +1}'}.</text>
        </svg>
      );
    }

    // 16. C Programming & Memory Architecture: Stack vs Heap & Pointers
    if (key.includes('c-prog') || key.includes('pointer') || key.includes('stack-heap') || key.includes('memory-layout') || key.includes('c programming')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="24" fill={c.ink} fontSize="13" fontWeight="700">C Memory Layout: Virtual Address Space</text>

          {/* Memory Bar */}
          <g transform="translate(60, 40)">
            {/* Stack */}
            <rect x="0" y="0" width="160" height="42" fill={c.coralLight} stroke={c.coral} strokeWidth="1.5" rx="4" />
            <text x="35" y="25" fill={c.coralDeep} fontSize="11" fontWeight="800">Stack (Local Vars, frames) ↓</text>

            {/* Free space with arrows */}
            <rect x="0" y="44" width="160" height="30" fill="#F1F5F9" stroke="#CBD5E1" strokeDasharray="3" rx="2" />
            <text x="35" y="63" fill={c.muted} fontSize="10">Shared Free Space</text>

            {/* Heap */}
            <rect x="0" y="76" width="160" height="42" fill={c.amberLight} stroke={c.amber} strokeWidth="1.5" rx="4" />
            <text x="30" y="102" fill={c.amberDeep} fontSize="11" fontWeight="800">Heap (malloc / calloc) ↑</text>

            {/* BSS / Data */}
            <rect x="0" y="120" width="160" height="28" fill={c.slateLight} stroke={c.slate} strokeWidth="1.5" rx="4" />
            <text x="30" y="138" fill={c.slateDeep} fontSize="10" fontWeight="700">Data / BSS (Global/Static)</text>

            {/* Text / Code */}
            <rect x="0" y="150" width="160" height="28" fill={c.purpleLight} stroke={c.purple} strokeWidth="1.5" rx="4" />
            <text x="40" y="168" fill={c.purpleDeep} fontSize="10" fontWeight="700">Text / Code Segment</text>
          </g>

          {/* Pointer Concept */}
          <g transform="translate(260, 50)">
            <rect x="0" y="0" width="230" height="135" rx="8" fill="#FFF" stroke={c.border} strokeWidth="1.5" />
            <text x="15" y="24" fill={c.ink} fontSize="12" fontWeight="700">Pointer Dereferencing (*ptr)</text>

            {/* Variable Box */}
            <rect x="15" y="40" width="85" height="45" rx="6" fill={c.sageLight} stroke={c.sage} strokeWidth="1.5" />
            <text x="25" y="58" fill={c.sageDeep} fontSize="10" fontWeight="700">int var = 42</text>
            <text x="22" y="75" fill={c.muted} fontSize="9">Addr: 0x7FFE</text>

            {/* Pointer Box */}
            <rect x="135" y="40" width="80" height="45" rx="6" fill={c.slateLight} stroke={c.slate} strokeWidth="1.5" />
            <text x="145" y="58" fill={c.slateDeep} fontSize="10" fontWeight="700">int *ptr</text>
            <text x="140" y="75" fill={c.slateDeep} fontSize="9">Val: 0x7FFE</text>

            <path d="M 135 62 L 105 62" stroke={c.coral} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="15" y="112" fill={c.ink} fontSize="10">*ptr accesses var value (42)</text>
            <text x="15" y="126" fill={c.muted} fontSize="9">&amp;var gives memory address</text>
          </g>
        </svg>
      );
    }

    // 17. OOP (Object-Oriented Programming): 4 Core Pillars
    if (key.includes('oop') || key.includes('object') || key.includes('inheritance') || key.includes('polymorph') || key.includes('encapsulat')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="170" y="26" fill={c.ink} fontSize="13" fontWeight="700">The 4 Pillars of Object-Oriented Programming</text>

          {/* 4 Pillars Grid */}
          <g transform="translate(30, 45)">
            {/* Encapsulation */}
            <rect x="0" y="0" width="112" height="130" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.8" />
            <text x="12" y="24" fill={c.slateDeep} fontSize="11" fontWeight="800">1. Encapsulation</text>
            <text x="12" y="44" fill={c.ink} fontSize="9">Data Hiding &amp;</text>
            <text x="12" y="58" fill={c.ink} fontSize="9">Private Bundling</text>
            <rect x="12" y="72" width="88" height="42" rx="4" fill="#FFF" stroke={c.slate} strokeWidth="1" />
            <text x="16" y="88" fill={c.slateDeep} fontSize="8" fontWeight="700">class Capsule {'{'}</text>
            <text x="20" y="100" fill={c.muted} fontSize="8">private data;</text>
            <text x="16" y="110" fill={c.slateDeep} fontSize="8">{'}'}</text>

            {/* Abstraction */}
            <rect x="122" y="0" width="112" height="130" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="1.8" />
            <text x="134" y="24" fill={c.amberDeep} fontSize="11" fontWeight="800">2. Abstraction</text>
            <text x="134" y="44" fill={c.ink} fontSize="9">Hide Complexity,</text>
            <text x="134" y="58" fill={c.ink} fontSize="9">Show Interface</text>
            <rect x="134" y="72" width="88" height="42" rx="4" fill="#FFF" stroke={c.amber} strokeWidth="1" />
            <text x="138" y="88" fill={c.amberDeep} fontSize="8" fontWeight="700">interface TV {'{'}</text>
            <text x="142" y="100" fill={c.muted} fontSize="8">void turnOn();</text>
            <text x="138" y="110" fill={c.amberDeep} fontSize="8">{'}'}</text>

            {/* Inheritance */}
            <rect x="244" y="0" width="112" height="130" rx="8" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="1.8" />
            <text x="256" y="24" fill={c.purpleDeep} fontSize="11" fontWeight="800">3. Inheritance</text>
            <text x="256" y="44" fill={c.ink} fontSize="9">Code Reusability</text>
            <text x="256" y="58" fill={c.ink} fontSize="9">Parent → Child</text>
            <rect x="256" y="72" width="88" height="42" rx="4" fill="#FFF" stroke={c.purple} strokeWidth="1" />
            <text x="260" y="88" fill={c.purpleDeep} fontSize="8" fontWeight="700">class Dog :</text>
            <text x="264" y="100" fill={c.muted} fontSize="8">public Animal</text>
            <text x="260" y="110" fill={c.purpleDeep} fontSize="8">{'{}'}</text>

            {/* Polymorphism */}
            <rect x="366" y="0" width="112" height="130" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.8" />
            <text x="376" y="24" fill={c.sageDeep} fontSize="11" fontWeight="800">4. Polymorphism</text>
            <text x="376" y="44" fill={c.ink} fontSize="9">Many Forms:</text>
            <text x="376" y="58" fill={c.ink} fontSize="9">Overload / Override</text>
            <rect x="376" y="72" width="92" height="42" rx="4" fill="#FFF" stroke={c.sage} strokeWidth="1" />
            <text x="380" y="88" fill={c.sageDeep} fontSize="8" fontWeight="700">@Override</text>
            <text x="380" y="100" fill={c.muted} fontSize="8">void speak();</text>
            <text x="380" y="110" fill={c.sageDeep} fontSize="8">{'{}'}</text>
          </g>

          <text x="80" y="205" fill={c.muted} fontSize="11">✓ OOP allows scalable, maintainable modular software with high cohesion and loose coupling.</text>
        </svg>
      );
    }

    // 18. Computer Organization & Architecture: Von Neumann
    if (key.includes('coa') || key.includes('von-neumann') || key.includes('cpu-arch') || key.includes('instruction-cycle') || key.includes('computer organization')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="175" y="24" fill={c.ink} fontSize="13" fontWeight="700">Von Neumann Computer Architecture</text>

          {/* Central Processing Unit (CPU) */}
          <rect x="40" y="45" width="220" height="145" rx="8" fill="#FFF" stroke={c.slateDeep} strokeWidth="2" />
          <text x="90" y="65" fill={c.slateDeep} fontSize="12" fontWeight="800">CPU (Central Processor)</text>

          <rect x="55" y="78" width="85" height="42" rx="6" fill={c.slateLight} stroke={c.slate} strokeWidth="1.2" />
          <text x="75" y="98" fill={c.slateDeep} fontSize="10" fontWeight="700">ALU</text>
          <text x="60" y="112" fill={c.muted} fontSize="8">Arithmetic &amp; Logic</text>

          <rect x="155" y="78" width="90" height="42" rx="6" fill={c.amberLight} stroke={c.amber} strokeWidth="1.2" />
          <text x="170" y="98" fill={c.amberDeep} fontSize="10" fontWeight="700">Control Unit</text>
          <text x="162" y="112" fill={c.muted} fontSize="8">Fetch &amp; Decode</text>

          <rect x="55" y="132" width="190" height="42" rx="6" fill={c.purpleLight} stroke={c.purple} strokeWidth="1.2" />
          <text x="75" y="152" fill={c.purpleDeep} fontSize="10" fontWeight="700">Registers: PC, IR, MAR, MDR, AC</text>
          <text x="75" y="165" fill={c.muted} fontSize="8">Ultra-fast internal CPU storage</text>

          {/* System Bus */}
          <rect x="290" y="45" width="30" height="145" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <text x="298" y="125" fill="#475569" fontSize="10" fontWeight="800" transform="rotate(-90 298 125)">SYSTEM BUS (Data, Addr, Ctrl)</text>

          {/* Lines connecting CPU to Bus */}
          <line x1="260" y1="95" x2="290" y2="95" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="290" y1="140" x2="260" y2="140" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Memory & IO */}
          <rect x="350" y="45" width="150" height="65" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.8" />
          <text x="380" y="70" fill={c.sageDeep} fontSize="11" fontWeight="800">Main Memory (RAM)</text>
          <text x="375" y="88" fill={c.muted} fontSize="9">Instructions &amp; Data Stored</text>
          <line x1="320" y1="75" x2="350" y2="75" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          <rect x="350" y="125" width="150" height="65" rx="8" fill={c.coralLight} stroke={c.coralDeep} strokeWidth="1.8" />
          <text x="385" y="150" fill={c.coralDeep} fontSize="11" fontWeight="800">I/O Devices</text>
          <text x="370" y="168" fill={c.muted} fontSize="9">Keyboard, Display, Disk</text>
          <line x1="320" y1="155" x2="350" y2="155" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

          <text x="60" y="215" fill={c.muted} fontSize="10">✓ Instruction Cycle: Fetch (PC→MAR) → Decode (IR) → Execute (ALU) → Store result.</text>
        </svg>
      );
    }

    // 19. Theory of Computation: DFA / Automata & Chomsky Hierarchy
    if (key.includes('toc') || key.includes('automata') || key.includes('dfa') || key.includes('nfa') || key.includes('turing') || key.includes('chomsky')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="175" y="24" fill={c.ink} fontSize="13" fontWeight="700">Deterministic Finite Automaton (DFA) &amp; Language</text>

          {/* DFA States */}
          <g transform="translate(60, 50)">
            {/* Start Arrow */}
            <line x1="0" y1="50" x2="30" y2="50" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="0" y="42" fill={c.muted} fontSize="10">Start</text>

            {/* State q0 */}
            <circle cx="50" cy="50" r="22" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
            <text x="42" y="55" fill={c.slateDeep} fontSize="12" fontWeight="800">q0</text>

            {/* Self loop q0 on '0' */}
            <path d="M 40 30 Q 50 0 60 30" fill="none" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="47" y="12" fill={c.ink} fontSize="10" fontWeight="700">0</text>

            {/* Transition to q1 on '1' */}
            <line x1="72" y1="50" x2="160" y2="50" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="110" y="42" fill={c.ink} fontSize="11" fontWeight="700">1</text>

            {/* State q1 */}
            <circle cx="180" cy="50" r="22" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
            <text x="172" y="55" fill={c.amberDeep} fontSize="12" fontWeight="800">q1</text>

            {/* Transition to q2 on '1' */}
            <line x1="202" y1="50" x2="290" y2="50" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="240" y="42" fill={c.ink} fontSize="11" fontWeight="700">1</text>

            {/* State q2 (Accepting State: Double circle) */}
            <circle cx="310" cy="50" r="24" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
            <circle cx="310" cy="50" r="19" fill="none" stroke={c.sageDeep} strokeWidth="2" />
            <text x="302" y="55" fill={c.sageDeep} fontSize="12" fontWeight="800">q2</text>
            <text x="290" y="90" fill={c.sageDeep} fontSize="9" fontWeight="700">Accept State</text>

            {/* Self loop on q2 on '0,1' */}
            <path d="M 300 28 Q 310 -2 320 28" fill="none" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="302" y="8" fill={c.ink} fontSize="10" fontWeight="700">0, 1</text>

            {/* Return edge from q1 to q0 on '0' */}
            <path d="M 170 70 Q 110 110 60 70" fill="none" stroke={c.coral} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="115" y="105" fill={c.coralDeep} fontSize="10" fontWeight="700">0</text>
          </g>

          <text x="60" y="195" fill={c.muted} fontSize="11">✓ Language Accepted L = Strings containing '11' as substring over {'{0, 1}'}.</text>
          <text x="60" y="215" fill={c.muted} fontSize="10">Chomsky Hierarchy: Regular (DFA) ⊂ Context-Free (PDA) ⊂ Context-Sensitive (LBA) ⊂ Recursive (Turing Machine).</text>
        </svg>
      );
    }

    // 20. Software Engineering: SDLC Lifecycle & Agile Scrum
    if (key.includes('se') || key.includes('software-eng') || key.includes('sdlc') || key.includes('agile') || key.includes('waterfall') || key.includes('software engineering')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="24" fill={c.ink} fontSize="13" fontWeight="700">Software Engineering: Agile Sprint vs SDLC Waterfall</text>

          {/* Agile Sprint Loop */}
          <g transform="translate(60, 45)">
            <rect x="0" y="0" width="180" height="140" rx="10" fill="#FFF" stroke={c.slate} strokeWidth="1.5" />
            <text x="40" y="24" fill={c.slateDeep} fontSize="12" fontWeight="800">Agile Sprint (2-4 Weeks)</text>
            <circle cx="90" cy="78" r="45" fill="none" stroke={c.purple} strokeWidth="3" strokeDasharray="8 4" />
            <text x="60" y="70" fill={c.purpleDeep} fontSize="10" fontWeight="700">Plan → Build</text>
            <text x="55" y="88" fill={c.purpleDeep} fontSize="10" fontWeight="700">Test → Deploy</text>
            <text x="40" y="105" fill={c.muted} fontSize="9">Continuous Feedback</text>
          </g>

          {/* Waterfall Stages */}
          <g transform="translate(270, 40)">
            <text x="40" y="15" fill={c.amberDeep} fontSize="12" fontWeight="800">Sequential Waterfall Flow</text>
            {[
              { label: '1. Requirements (SRS)', color: c.slateLight, border: c.slateDeep },
              { label: '2. System Design (UML)', color: c.amberLight, border: c.amberDeep },
              { label: '3. Implementation (Coding)', color: c.purpleLight, border: c.purpleDeep },
              { label: '4. Testing (Unit/Integration)', color: c.coralLight, border: c.coralDeep },
              { label: '5. Deployment & Maintenance', color: c.sageLight, border: c.sageDeep },
            ].map((st, i) => (
              <g key={`wf-${i}`} transform={`translate(${i * 18}, ${i * 26 + 25})`}>
                <rect x="0" y="0" width="150" height="22" rx="4" fill={st.color} stroke={st.border} strokeWidth="1.2" />
                <text x="8" y="15" fontSize="9" fontWeight="700" fill={c.ink}>{st.label}</text>
              </g>
            ))}
          </g>

          <text x="60" y="215" fill={c.muted} fontSize="10">✓ Agile handles changing customer requirements through short iterative increments (Sprint Backlog &amp; Burndown).</text>
        </svg>
      );
    }

    // 21. Cloud Computing & DevOps: Service Models (IaaS, PaaS, SaaS) & CI/CD
    if (key.includes('cloud') || key.includes('iaas') || key.includes('paas') || key.includes('saas') || key.includes('devops') || key.includes('docker') || key.includes('aws')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="24" fill={c.ink} fontSize="13" fontWeight="700">Cloud Computing Pyramid &amp; CI/CD Pipeline</text>

          {/* Cloud Pyramid */}
          <g transform="translate(40, 45)">
            <polygon points="110,10 10,135 210,135" fill="none" stroke="#94A3B8" strokeWidth="1.5" />
            
            {/* SaaS */}
            <polygon points="110,10 75,50 145,50" fill={c.coralLight} stroke={c.coral} strokeWidth="1.2" />
            <text x="95" y="38" fill={c.coralDeep} fontSize="10" fontWeight="800">SaaS</text>

            {/* PaaS */}
            <polygon points="75,50 45,90 175,90 145,50" fill={c.amberLight} stroke={c.amber} strokeWidth="1.2" />
            <text x="95" y="75" fill={c.amberDeep} fontSize="10" fontWeight="800">PaaS</text>

            {/* IaaS */}
            <polygon points="45,90 10,135 210,135 175,90" fill={c.slateLight} stroke={c.slate} strokeWidth="1.2" />
            <text x="95" y="118" fill={c.slateDeep} fontSize="10" fontWeight="800">IaaS</text>

            <text x="15" y="155" fill={c.muted} fontSize="9">SaaS (Gmail) → PaaS (Heroku) → IaaS (AWS EC2)</text>
          </g>

          {/* DevOps CI/CD Pipeline */}
          <g transform="translate(270, 50)">
            <text x="35" y="15" fill={c.sageDeep} fontSize="12" fontWeight="800">DevOps Automated Pipeline</text>
            <rect x="0" y="30" width="60" height="36" rx="6" fill={c.slateLight} stroke={c.slate} strokeWidth="1.2" />
            <text x="15" y="52" fill={c.slateDeep} fontSize="10" fontWeight="700">Code</text>

            <line x1="60" y1="48" x2="80" y2="48" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="80" y="30" width="60" height="36" rx="6" fill={c.amberLight} stroke={c.amber} strokeWidth="1.2" />
            <text x="95" y="52" fill={c.amberDeep} fontSize="10" fontWeight="700">Build</text>

            <line x1="140" y1="48" x2="160" y2="48" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="160" y="30" width="60" height="36" rx="6" fill={c.purpleLight} stroke={c.purple} strokeWidth="1.2" />
            <text x="175" y="52" fill={c.purpleDeep} fontSize="10" fontWeight="700">Test</text>

            <line x1="190" y1="66" x2="190" y2="90" stroke={c.ink} strokeWidth="1.5" markerEnd="url(#arrow)" />

            <rect x="140" y="90" width="90" height="36" rx="6" fill={c.sageLight} stroke={c.sage} strokeWidth="1.2" />
            <text x="150" y="112" fill={c.sageDeep} fontSize="10" fontWeight="700">Deploy (K8s)</text>

            <text x="20" y="150" fill={c.muted} fontSize="9">Containerization with Docker &amp; Orchestration via Kubernetes</text>
          </g>

          <text x="60" y="220" fill={c.muted} fontSize="10">✓ Cloud enables on-demand self-service, broad network access, resource pooling, and elasticity.</text>
        </svg>
      );
    }

    // 22. Cyber Security & Cryptography: Symmetric vs Asymmetric (RSA/AES)
    if (key.includes('security') || key.includes('crypto') || key.includes('rsa') || key.includes('aes') || key.includes('cipher') || key.includes('hash')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="24" fill={c.ink} fontSize="13" fontWeight="700">Cryptography: Asymmetric Public/Private Key (RSA)</text>

          {/* Sender Alice */}
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="100" height="45" rx="6" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.5" />
            <text x="15" y="26" fill={c.slateDeep} fontSize="11" fontWeight="700">Sender Alice</text>
            <text x="10" y="40" fill={c.muted} fontSize="9">Plaintext: "HELLO"</text>

            {/* Bob's Public Key */}
            <line x1="100" y1="22" x2="160" y2="22" stroke={c.ink} strokeWidth="1.8" markerEnd="url(#arrow)" />
            <rect x="160" y="5" width="110" height="35" rx="6" fill={c.amberLight} stroke={c.amber} strokeWidth="1.5" />
            <text x="170" y="22" fill={c.amberDeep} fontSize="10" fontWeight="700">🔑 Bob's Public Key</text>
            <text x="180" y="34" fill={c.muted} fontSize="8">(Shared freely)</text>
          </g>

          {/* Ciphertext over insecure channel */}
          <g transform="translate(140, 110)">
            <rect x="0" y="0" width="220" height="32" rx="6" fill={c.coralLight} stroke={c.coral} strokeWidth="1.5" />
            <text x="25" y="20" fill={c.coralDeep} fontSize="10" fontWeight="800">🔒 Ciphertext: $9#qK!z8 (Encrypted)</text>
            <text x="230" y="20" fill={c.muted} fontSize="9">Insecure Internet</text>
          </g>

          {/* Receiver Bob */}
          <g transform="translate(320, 50)">
            <rect x="100" y="0" width="100" height="45" rx="6" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="1.5" />
            <text x="115" y="26" fill={c.sageDeep} fontSize="11" fontWeight="700">Receiver Bob</text>
            <text x="110" y="40" fill={c.muted} fontSize="9">Plaintext: "HELLO"</text>

            {/* Bob's Private Key */}
            <line x1="50" y1="22" x2="100" y2="22" stroke={c.ink} strokeWidth="1.8" markerEnd="url(#arrow)" />
            <rect x="-35" y="5" width="110" height="35" rx="6" fill={c.purpleLight} stroke={c.purple} strokeWidth="1.5" />
            <text x="-25" y="22" fill={c.purpleDeep} fontSize="10" fontWeight="700">🗝️ Bob's Private Key</text>
            <text x="-15" y="34" fill={c.muted} fontSize="8">(Secret, never shared)</text>
          </g>

          <text x="60" y="180" fill={c.muted} fontSize="11">✓ CIA Triad: Confidentiality (Encryption), Integrity (Hashing SHA-256), Availability (DDoS Defense).</text>
          <text x="60" y="200" fill={c.muted} fontSize="10">Symmetric (AES) = 1 shared secret key. Asymmetric (RSA/ECC) = Key Pair (Public + Private).</text>
        </svg>
      );
    }

    // 23. Artificial Intelligence: Agent Loop & A* Search
    if (key.includes('artificial-intelligence') || key.includes('heuristic') || key.includes('a*') || key.includes('minimax') || key.includes('knowledge') || key.includes('ai')) {
      return (
        <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
          <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
          <text x="160" y="24" fill={c.ink} fontSize="13" fontWeight="700">AI Intelligent Agent &amp; A* Heuristic Search</text>

          {/* Agent Environment Loop */}
          <g transform="translate(40, 45)">
            <rect x="0" y="0" width="160" height="60" rx="8" fill={c.purpleLight} stroke={c.purpleDeep} strokeWidth="1.8" />
            <text x="35" y="25" fill={c.purpleDeep} fontSize="11" fontWeight="800">AGENT (Reasoning)</text>
            <text x="25" y="45" fill={c.muted} fontSize="9">Knowledge Base + Sensors</text>

            <rect x="0" y="95" width="160" height="50" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="1.8" />
            <text x="40" y="118" fill={c.slateDeep} fontSize="11" fontWeight="800">ENVIRONMENT</text>
            <text x="35" y="134" fill={c.muted} fontSize="9">State, World, Objects</text>

            <path d="M 160 30 Q 195 70 160 110" fill="none" stroke={c.coral} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="190" y="75" fill={c.coralDeep} fontSize="9" fontWeight="700">Actions (Actuators)</text>

            <path d="M 0 110 Q -30 70 0 30" fill="none" stroke={c.sage} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="-40" y="75" fill={c.sageDeep} fontSize="9" fontWeight="700">Percepts (Sensors)</text>
          </g>

          {/* A* Search Box */}
          <g transform="translate(270, 45)">
            <rect x="0" y="0" width="230" height="145" rx="8" fill="#FFF" stroke={c.amber} strokeWidth="1.8" />
            <text x="30" y="24" fill={c.amberDeep} fontSize="12" fontWeight="800">A* Search: f(n) = g(n) + h(n)</text>
            
            <rect x="15" y="38" width="200" height="30" rx="4" fill={c.slateLight} />
            <text x="22" y="57" fill={c.slateDeep} fontSize="10">g(n) = Actual cost from start to node n</text>

            <rect x="15" y="74" width="200" height="30" rx="4" fill={c.amberLight} />
            <text x="22" y="93" fill={c.amberDeep} fontSize="10">h(n) = Estimated heuristic cost to goal</text>

            <text x="15" y="125" fill={c.sageDeep} fontSize="10" fontWeight="700">✓ Admissible Heuristic: Never overestimates!</text>
            <text x="15" y="138" fill={c.muted} fontSize="9">Guarantees optimal path when h(n) &lt;= h*(n)</text>
          </g>

          <text x="60" y="215" fill={c.muted} fontSize="10">✓ AI Paradigms: Search (BFS/DFS/A*), Logic &amp; Knowledge Representation, Game Playing (Minimax &amp; Alpha-Beta Pruning).</text>
        </svg>
      );
    }

    // Default Universal Concept Diagram
    return (
      <svg viewBox="0 0 540 240" className="w-full h-auto" style={{ maxHeight: 250 }}>
        <rect width="540" height="240" rx="10" fill="#F8FAFC" stroke={c.border} />
        <text x="160" y="30" fill={c.ink} fontSize="13" fontWeight="700">Core Academic Framework & Process Flow</text>

        <rect x="40" y="70" width="120" height="60" rx="8" fill={c.slateLight} stroke={c.slateDeep} strokeWidth="2" />
        <text x="55" y="98" fill={c.slateDeep} fontSize="12" fontWeight="800">1. Problem / Input</text>
        <text x="60" y="116" fill={c.slateDeep} fontSize="10">Data &amp; Formulas</text>

        <line x1="160" y1="100" x2="210" y2="100" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

        <rect x="210" y="70" width="120" height="60" rx="8" fill={c.amberLight} stroke={c.amberDeep} strokeWidth="2" />
        <text x="225" y="98" fill={c.amberDeep} fontSize="12" fontWeight="800">2. Core Logic</text>
        <text x="230" y="116" fill={c.amberDeep} fontSize="10">Algorithm &amp; Proof</text>

        <line x1="330" y1="100" x2="380" y2="100" stroke={c.ink} strokeWidth="2" markerEnd="url(#arrow)" />

        <rect x="380" y="70" width="120" height="60" rx="8" fill={c.sageLight} stroke={c.sageDeep} strokeWidth="2" />
        <text x="400" y="98" fill={c.sageDeep} fontSize="12" fontWeight="800">3. Solved Output</text>
        <text x="405" y="116" fill={c.sageDeep} fontSize="10">Verified &amp; Scored</text>

        <text x="80" y="180" fill={c.muted} fontSize="12" fontWeight="600">
          💡 Visual understanding ensures maximum exam retention and easy step-by-step scoring!
        </text>
      </svg>
    );
  };

  return (
    <div
      className="panel panel-pad mb-4 fade-in"
      style={{
        background: 'var(--paper-raised, #FFFFFF)',
        border: '1px solid var(--line, #E5E7EB)',
        borderRadius: 12,
        ...style,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 15 }}>📊</span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--amber-deep, #B45309)' }}>
            {title || 'Visual Architecture / Topic Diagram'}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-icon btn-ghost btn-sm"
          onClick={() => setZoomed(!zoomed)}
          title={zoomed ? 'Collapse' : 'Enlarge Diagram'}
        >
          <LuZoomIn size={14} />
        </button>
      </div>

      <div style={{ transform: zoomed ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.2s ease-in-out' }}>
        {/* SVG Marker Definitions */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#1F2937" />
            </marker>
          </defs>
        </svg>

        {renderSvg()}
      </div>

      {caption && (
        <div className="mt-2 text-xs soft flex items-start gap-1.5" style={{ color: 'var(--ink-faint, #6B7280)', lineHeight: 1.5 }}>
          <LuInfo size={13} style={{ flexShrink: 0, marginTop: 2, color: 'var(--amber-deep)' }} />
          <span>{caption}</span>
        </div>
      )}
    </div>
  );
}
