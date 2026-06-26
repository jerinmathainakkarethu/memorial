import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getMediaUrl } from '../../utils/api';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import '../../styles/FamilyTree.css';

function FamilyTree({ members, relationships, highlightSlug, onSelectMember }) {
  const { t, getField } = useLanguage();
  const containerRef = useRef(null);

  // Pan and Zoom State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Touch State for mobile pinching
  const lastTouchDist = useRef(0);

  // Compute Layout coordinates dynamically
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (!members.length) return;

    // 1. Group spouses
    const memberMap = {};
    members.forEach((m) => {
      memberMap[m.id] = { ...m, spouseId: null, childIds: [], parentIds: [] };
    });

    relationships.forEach((r) => {
      const m = memberMap[r.member_id];
      const rm = memberMap[r.related_member_id];
      if (!m || !rm) return;

      if (r.relationship_type === 'spouse') {
        m.spouseId = rm.id;
        rm.spouseId = m.id;
      } else if (r.relationship_type === 'child') {
        m.childIds.push(rm.id);
        rm.parentIds.push(m.id);
      } else if (r.relationship_type === 'father' || r.relationship_type === 'mother') {
        m.parentIds.push(rm.id);
        rm.childIds.push(m.id);
      }
    });

    // 2. Identify Generations
    // Gen 0: Roots (Appachan & Ammachi)
    const gen0 = Object.values(memberMap).filter(m => m.parentIds.length === 0);
    // Gen 1: Children of Roots (the 6 brothers and spouses)
    const gen1 = Object.values(memberMap).filter(m => {
      return m.parentIds.some(pId => gen0.some(r => r.id === pId));
    });
    // Gen 2: Grandchildren
    const gen2 = Object.values(memberMap).filter(m => {
      return m.parentIds.some(pId => gen1.some(c => c.id === pId));
    });

    const calculatedNodes = [];
    const calculatedConnections = [];

    // Layout configuration constants
    const cardWidth = 180;
    const cardHeight = 110;
    const spouseGap = 20;
    const siblingGap = 40;
    const levelHeight = 220;
    const startY = 50;

    // Layout Gen 0: Centered
    const gen0Couple = gen0.filter(m => m.gender === 'male')[0];
    const gen0Spouse = gen0.filter(m => m.gender === 'female')[0];

    const gen0X = 900;
    const gen0Y = startY;

    if (gen0Couple) {
      calculatedNodes.push({
        ...gen0Couple,
        x: gen0X - (cardWidth + spouseGap / 2),
        y: gen0Y
      });
      if (gen0Spouse) {
        calculatedNodes.push({
          ...gen0Spouse,
          x: gen0X + (spouseGap / 2),
          y: gen0Y
        });
        // Connect spouses in Gen 0
        calculatedConnections.push({
          type: 'spouse',
          x1: gen0X - spouseGap / 2,
          y1: gen0Y + cardHeight / 2,
          x2: gen0X + spouseGap / 2,
          y2: gen0Y + cardHeight / 2
        });
      }
    } else {
      // Fallback
      gen0.forEach((m, idx) => {
        calculatedNodes.push({
          ...m,
          x: gen0X + (idx - gen0.length / 2) * (cardWidth + siblingGap),
          y: gen0Y
        });
      });
    }

    // Layout Gen 1: Brothers side-by-side
    // Group them: each group is [brother, spouse (if any)]
    const gen1Groups = [];
    const gen1MembersVisited = new Set();

    gen1.forEach(m => {
      if (gen1MembersVisited.has(m.id)) return;

      if (m.spouseId && memberMap[m.spouseId]) {
        const spouse = memberMap[m.spouseId];
        // Ensure male is first for consistency
        if (m.gender === 'male') {
          gen1Groups.push([m, spouse]);
        } else {
          gen1Groups.push([spouse, m]);
        }
        gen1MembersVisited.add(m.id);
        gen1MembersVisited.add(spouse.id);
      } else {
        gen1Groups.push([m]);
        gen1MembersVisited.add(m.id);
      }
    });

    // Space Gen 1 horizontally
    const groupWidth = cardWidth * 2 + spouseGap;
    const totalGen1Width = gen1Groups.length * groupWidth + (gen1Groups.length - 1) * siblingGap;
    const gen1StartX = 900 - totalGen1Width / 2;
    const gen1Y = startY + levelHeight;

    const parentCenterY = gen0Y + cardHeight;
    const parentCenterX = gen0X;

    // Draw main vertical line down from Gen 0 parent center
    const busLineY = gen1Y - 60;
    calculatedConnections.push({
      type: 'parent-bus',
      x1: parentCenterX,
      y1: parentCenterY,
      x2: parentCenterX,
      y2: busLineY
    });

    gen1Groups.forEach((group, index) => {
      const groupX = gen1StartX + index * (groupWidth + siblingGap);
      const m1 = group[0];
      const m2 = group[1];

      // Position brother
      calculatedNodes.push({
        ...m1,
        x: groupX,
        y: gen1Y
      });

      let connectPointX = groupX + cardWidth / 2;

      // Position wife if present
      if (m2) {
        calculatedNodes.push({
          ...m2,
          x: groupX + cardWidth + spouseGap,
          y: gen1Y
        });

        // Draw spouse connection
        calculatedConnections.push({
          type: 'spouse',
          x1: groupX + cardWidth,
          y1: gen1Y + cardHeight / 2,
          x2: groupX + cardWidth + spouseGap,
          y2: gen1Y + cardHeight / 2
        });

        connectPointX = groupX + cardWidth + spouseGap / 2;
      }

      // Draw connection from Gen 0 bus line down to this Gen 1 group
      calculatedConnections.push({
        type: 'parent-child',
        x1: connectPointX,
        y1: busLineY,
        x2: connectPointX,
        y2: gen1Y
      });

      // Layout Gen 2 (Children of this couple)
      const children = gen2.filter(c => c.parentIds.includes(m1.id) || (m2 && c.parentIds.includes(m2.id)));
      if (children.length > 0) {
        const gen2Y = gen1Y + levelHeight;
        const totalChildrenWidth = children.length * cardWidth + (children.length - 1) * siblingGap;
        const childrenStartX = connectPointX - totalChildrenWidth / 2;

        // Draw vertical line from couple's spouse connection down to Gen 2 bus line
        const childBusY = gen2Y - 60;
        calculatedConnections.push({
          type: 'child-bus',
          x1: connectPointX,
          y1: gen1Y + cardHeight,
          x2: connectPointX,
          y2: childBusY
        });

        children.forEach((child, childIdx) => {
          const childX = childrenStartX + childIdx * (cardWidth + siblingGap);
          calculatedNodes.push({
            ...child,
            x: childX,
            y: gen2Y
          });

          // Draw bus connection to this child
          calculatedConnections.push({
            type: 'child-link',
            x1: childX + cardWidth / 2,
            y1: childBusY,
            x2: childX + cardWidth / 2,
            y2: gen2Y
          });
        });

        // Draw horizontal line connecting children at bus line
        if (children.length > 1) {
          calculatedConnections.push({
            type: 'child-horizontal-bus',
            x1: childrenStartX + cardWidth / 2,
            y1: childBusY,
            x2: childrenStartX + (children.length - 1) * (cardWidth + siblingGap) + cardWidth / 2,
            y2: childBusY
          });
        }
      }
    });

    // Draw main horizontal bus line for Gen 1
    if (gen1Groups.length > 1) {
      const firstGroupX = gen1StartX + cardWidth / 2;
      const lastGroupIndex = gen1Groups.length - 1;
      const lastGroupX = gen1StartX + lastGroupIndex * (groupWidth + siblingGap) + cardWidth / 2;

      calculatedConnections.push({
        type: 'parent-horizontal-bus',
        x1: firstGroupX,
        y1: busLineY,
        x2: lastGroupX,
        y2: busLineY
      });
    }

    setNodes(calculatedNodes);
    setConnections(calculatedConnections);

    // Auto-scroll and highlight if active
    if (highlightSlug) {
      const target = calculatedNodes.find((n) => n.slug === highlightSlug);
      if (target) {
        // Center view on targeted member
        const container = containerRef.current;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          setPan({
            x: containerWidth / 2 - (target.x + cardWidth / 2) * scale,
            y: containerHeight / 2 - (target.y + cardHeight / 2) * scale
          });
        }
      }
    } else {
      // Default center Gen 0 couple
      const container = containerRef.current;
      if (container) {
        setPan({
          x: container.clientWidth / 2 - gen0X * scale,
          y: 60
        });
      }
    }
  }, [members, relationships, highlightSlug]);

  // Drag and Pan events
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoom = (factor) => {
    setScale((prev) => Math.max(0.3, Math.min(2.0, prev * factor)));
  };

  const handleReset = () => {
    setScale(1);
    const container = containerRef.current;
    if (container) {
      setPan({
        x: container.clientWidth / 2 - 900,
        y: 60
      });
    }
  };

  // Mobile gestures handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDist.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lastTouchDist.current;
      lastTouchDist.current = dist;
      setScale((prev) => Math.max(0.3, Math.min(2.0, prev * (factor > 1 ? 1.05 : 0.95))));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="family-tree-viewport" ref={containerRef}>
      {/* Zoom controls panel */}
      <div className="tree-controls">
        <Button onClick={() => handleZoom(1.2)} size="sm" variant="secondary">+</Button>
        <Button onClick={() => handleZoom(0.8)} size="sm" variant="secondary">-</Button>
        <Button onClick={handleReset} size="sm" variant="outline">{t('reset')}</Button>
      </div>

      {/* Pannable tree canvas */}
      <div
        className="tree-canvas"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* SVG connection lines */}
        <svg width="2000" height="800" className="tree-svg">
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#AA7C11" />
            </linearGradient>
          </defs>
          {connections.map((c, idx) => {
            if (c.type === 'spouse') {
              return (
                <line
                  key={idx}
                  x1={c.x1}
                  y1={c.y1}
                  x2={c.x2}
                  y2={c.y2}
                  stroke="url(#gold-gradient)"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
              );
            }
            // Draw perpendicular linear tree branches
            return (
              <path
                key={idx}
                d={`M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`}
                stroke="#1E293B"
                strokeWidth="2.5"
                fill="none"
              />
            );
          })}
        </svg>

        {/* Member cards */}
        {nodes.map((m) => {
          const isHighlighted = m.slug === highlightSlug;
          const lifespan = m.is_deceased
            ? `${m.date_of_birth ? new Date(m.date_of_birth).getFullYear() : ''} – ${m.date_of_death ? new Date(m.date_of_death).getFullYear() : ''}`
            : `${t('born')}: ${m.date_of_birth ? new Date(m.date_of_birth).getFullYear() : ''}`;

          return (
            <div
              key={m.id}
              className={`tree-node-wrapper ${isHighlighted ? 'glowing-gold' : ''}`}
              style={{
                position: 'absolute',
                left: `${m.x}px`,
                top: `${m.y}px`,
                width: '180px',
                zIndex: isHighlighted ? 10 : 2
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMember(m);
              }}
            >
              <Card className={`tree-card ${m.is_deceased ? 'tree-card--deceased' : 'tree-card--living'}`}>
                <div className="tree-card__body">
                  <div className="tree-card__avatar">
                    <Avatar 
                      name={m.full_name} 
                      src={m.profile_photo ? getMediaUrl(m.profile_photo) : null} 
                      size="sm" 
                    />
                  </div>
                  <div className="tree-card__info">
                    <h4 className="tree-card__name">{getField(m, 'full_name')}</h4>
                    <p className="tree-card__dates">{lifespan}</p>
                    <div style={{ marginTop: '4px' }}>
                      {m.is_deceased ? (
                        <Badge variant="danger" size="sm">{t('deceased')}</Badge>
                      ) : (
                        <Badge variant="success" size="sm">{t('living')}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FamilyTree;
