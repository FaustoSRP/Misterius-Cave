import { useState } from 'react';
import './App.css';

import startScreenImg from './assets/cave_entrance.jpg';
import golemImg from './assets/golem.jpg';
import shadowBeastImg from './assets/shadow_beast.jpg';
import toxicGasImg from './assets/toxic_gas.jpg';
import rootsImg from './assets/roots.jpg';
import abyssImg from './assets/void_path.jpg';
import arcaneGuardianImg from './assets/arcane_guardian.jpg';
import ancientDoorImg from './assets/ancient_door.png';
import batsImg from './assets/bats.jpg';
import collapseImg from './assets/collapse.jpg';
import voidPathImg from './assets/abyss.png';
import echoesImg from './assets/echoes_of_madness.png';
import victoryImg from './assets/victory.png';
import defeatImg from './assets/defeat.png';

// Initial Explorer State
const INITIAL_STATS = {
  fuerza: 1,
  agilidad: 1,
  conocimiento: 1,
  energia: 100,
  rango: 'Novato'
};

const ENERGY_UPGRADE_STEP = 10; // +10 per upgrade
const MAX_ENERGY = 300;

const getStatDescription = (val) => {
  if (val < 5) return "Muy Débil";
  if (val < 10) return "Promedio";
  if (val < 20) return "Fuerte";
  return "Sobrehumano";
};


// Cave Requirements
const CAVE_REQUIREMENTS = {
  fuerza: 10,
  agilidad: 10,
  conocimiento: 5
};

// Obstacle Repository
// Obstacle Repository (Extended for variety/difficulty scaling would be good, but keeping simple for now)
// Obstacle Repository
const OBSTACLES = [
  // --- Profundidad Baja (0m+) ---
  {
    id: 'low_1',
    text: "Un gran derrumbe bloquea el paso.",
    minDepth: 0,
    image: collapseImg,
    options: [
      { text: "Intentar mover las rocas", stat: 'fuerza', difficulty: 2, damage: 15, xp: 50 }, // Optimal (Easy start)
      { text: "Tratar de escalar por encima", stat: 'agilidad', difficulty: 5, damage: 20, xp: 80 }, // Harder
      { text: "Buscar una grieta o ruta alterna", stat: 'conocimiento', difficulty: 8, damage: 10, xp: 120 }
    ]
  },
  {
    id: 'low_2',
    text: "Una fosa profunda interrumpe el camino.",
    minDepth: 0,
    image: abyssImg,
    options: [
      { text: "Tomar impulso y saltar", stat: 'agilidad', difficulty: 3 }, // Optimal (Easy start)
      { text: "Analizar el entorno en busca de ayuda", stat: 'conocimiento', difficulty: 9 },
    ]
  },
  {
    id: 'low_3',
    text: "Una colonia de murciélagos gigantes se despierta.",
    minDepth: 0,
    image: batsImg,
    options: [
      { text: "Ahuyentarlos con una antorcha improvisada", stat: 'conocimiento', difficulty: 4 },
      { text: "Correr y esquivar sus ataques", stat: 'agilidad', difficulty: 6 },
      { text: "Golpear a los que se acerquen", stat: 'fuerza', difficulty: 10 }
    ]
  },
  {
    id: 'low_4',
    text: "Raíces espinosas cubren el suelo.",
    minDepth: 0,
    image: rootsImg, // Using new roots image
    options: [
      { text: "Cortarlas con fuerza bruta", stat: 'fuerza', difficulty: 3 },
      { text: "Caminar con extremo cuidado", stat: 'agilidad', difficulty: 7 }
    ]
  },

  // --- Profundidad Media (100m+) ---
  {
    id: 'mid_1',
    text: "Un Golem de Barro vigila un puente antiguo.",
    minDepth: 100,
    image: golemImg,
    options: [
      { text: "Empujarlo al vacío", stat: 'fuerza', difficulty: 15, damage: 40, xp: 200 },
      { text: "Pasar corriendo por debajo de sus piernas", stat: 'agilidad', difficulty: 15, damage: 30, xp: 180 },
      { text: "Desactivar su núcleo rúnico", stat: 'conocimiento', difficulty: 8, damage: 20, xp: 150 } // Lowered base, will scale up
    ]
  },
  {
    id: 'mid_2',
    text: "Una inscripción antigua bloquea una puerta sellada.",
    minDepth: 100,
    image: ancientDoorImg,
    options: [
      { text: "Descifrar el acertijo", stat: 'conocimiento', difficulty: 10 },
      { text: "Forzar la puerta a golpes", stat: 'fuerza', difficulty: 20 }
    ]
  },
  {
    id: 'mid_3',
    text: "Gas tóxico emana de las grietas.",
    minDepth: 100,
    image: toxicGasImg,
    options: [
      { text: "Aguantar la respiración y correr", stat: 'fuerza', difficulty: 12 },
      { text: "Escalar hacia el techo donde el aire es mejor", stat: 'agilidad', difficulty: 12 },
      { text: "Mezclar hierbas para un filtro", stat: 'conocimiento', difficulty: 10 }
    ]
  },
  {
    id: 'mid_4',
    text: "Ecos de locura susurran en tu mente.",
    minDepth: 120,
    image: echoesImg,
    options: [
      { text: "Concentrarse en la lógica para no ceder", stat: 'conocimiento', difficulty: 12 },
      { text: "Gritar para acallar las voces", stat: 'fuerza', difficulty: 18 }
    ]
  },

  // --- Profundidad Alta (200m+) - Endgame ---
  // Keeping high base diff because scaling will be huge (+20 at 200m)
  {
    id: 'high_1',
    text: "Una bestia de sombras acecha en la oscuridad absoluta.",
    minDepth: 200,
    image: shadowBeastImg,
    options: [
      { text: "Enfrentarla directamente", stat: 'fuerza', difficulty: 20 },
      { text: "Intentar esquivar su ataque letal", stat: 'agilidad', difficulty: 25 },
      { text: "Usar magia de luz antigua", stat: 'conocimiento', difficulty: 18 }
    ]
  },
  {
    id: 'high_2',
    text: "El Guardián Arcano te cierra el paso.",
    minDepth: 220,
    image: arcaneGuardianImg,
    options: [
      { text: "Duelo de voluntad mágica", stat: 'conocimiento', difficulty: 22 },
      { text: "Esquivar sus rayos desintegradores", stat: 'agilidad', difficulty: 22 },
      { text: "Romper su escudo a golpes", stat: 'fuerza', difficulty: 28 }
    ]
  },
  {
    id: 'high_3',
    text: "El camino se derrumba hacia el vacío infinito.",
    minDepth: 240,
    image: voidPathImg, // Using the image user identified as 'Path to the void'
    options: [
      { text: "Dar el salto de fe más grande de tu vida", stat: 'agilidad', difficulty: 24 },
      { text: "Aferrarse a la pared con fuerza sobrehumana", stat: 'fuerza', difficulty: 25 }
    ]
  },
  {
    id: 'high_4',
    text: "Te encuentras a ti mismo, pero corrompido.",
    minDepth: 250,
    options: [
      { text: "Aceptar tu sombra", stat: 'conocimiento', difficulty: 28 },
      { text: "Destruir a tu copia", stat: 'fuerza', difficulty: 28 }
    ]
  }
];

const UPGRADE_COST_BASE = 50;
const MAX_STAT = 30; // UPDATED per Prompt 11 preview (user request)
const CAVE_DEPTH_GOAL = 300; // Reduced to 300m for demo playability (30 steps)

const SUCCESS_MSGS = [
  "¡Increíble! Lo superas con elegancia.",
  "Por poco, pero logras avanzar.",
  "Tu habilidad es superior al obstáculo.",
  "La suerte te sonríe esta vez.",
  "Ejecución perfecta.",
  "Te abres paso sin mirar atrás.",
  "El peligro queda atrás, por ahora."
];

const FAILURE_MSGS = [
  "¡Desastre! Calculaste mal.",
  "Te golpean con fuerza brutal.",
  "Resbalas en el peor momento posible.",
  "La oscuridad se aprovecha de tu error.",
  "Dudaste un segundo y pagaste el precio.",
  "El dolor recorre tu cuerpo.",
  "Un fallo lamentable."
];

function App() {
  // Permanent progression state (could be saved to localStorage in a real app)
  const [baseStats, setBaseStats] = useState(INITIAL_STATS);

  // Current explorer state (starts as baseStats)
  const [explorer, setExplorer] = useState(INITIAL_STATS);

  const [currentEnergy, setCurrentEnergy] = useState(INITIAL_STATS.energia);

  const [gameStatus, setGameStatus] = useState('idle'); // idle, exploring, failed, victory
  const [logs, setLogs] = useState(['Te encuentras ante la entrada de la Cueva Misteriosa.']);
  const [currentObstacle, setCurrentObstacle] = useState(null);
  const [diaries, setDiaries] = useState([]); // Store past diaries
  const [runXP, setRunXP] = useState(0); // XP for current run
  const [knowledgePoints, setKnowledgePoints] = useState(0); // Currency for upgrades
  const [depth, setDepth] = useState(0); // Prompt 7: Depth tracking

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev]);
  };

  const getRandomLog = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const getRankFromStats = () => {
    const energyLevels = Math.floor((explorer.energia - INITIAL_STATS.energia) / ENERGY_UPGRADE_STEP);
    const score = (explorer.fuerza - INITIAL_STATS.fuerza)
      + (explorer.agilidad - INITIAL_STATS.agilidad)
      + (explorer.conocimiento - INITIAL_STATS.conocimiento)
      + energyLevels;

    if (score >= 80) return 'Leyenda';
    if (score > 60) return 'Gran Maestro';
    if (score > 40) return 'Maestro';
    if (score > 20) return 'Aventurero';
    return 'Novato';
  };

  const getXpForSuccess = (difficulty) => {
    return Math.max(5, Math.min(40, Math.floor(difficulty * 4)));
  };

  const getXpForFailure = (successXp) => {
    return Math.max(2, Math.floor(successXp * 0.25));
  };

  // Helper to calculate cost: Base * 1.2 ^ (Current - 1)
  // Level 1 -> 50
  // Level 10 -> ~257
  // Level 20 -> ~1916 (Very expensive, requires saving up)
  const getUpgradeCost = (currentVal) => {
    return Math.floor(UPGRADE_COST_BASE * Math.pow(1.2, currentVal - 1));
  };

  const startExploration = () => {
    setGameStatus('exploring');
    setRunXP(0);
    setDepth(0);
    addLog("--- Entrando a la Cueva ---");
    generateObstacle(0);
  };

  const generateObstacle = (currentDepth) => {
    // Filter obstacles that are valid for this depth
    // We can also limit "too easy" obstacles from appearing too deep if we wanted,
    // but for now let's just ensure we unlock stronger ones.
    // To make it harder deep down, we could say: filter obstacles where minDepth is within a range of currentDepth.
    // Let's do: must match minDepth <= currentDepth.
    // And to prioritize deeper content, let's filter out very low level stuff if we are deep?
    // Simplified: Just match minDepth <= currentDepth.

    let eligible = OBSTACLES.filter(obs => obs.minDepth <= currentDepth);

    // Safety fallback
    if (eligible.length === 0) eligible = OBSTACLES.filter(obs => obs.minDepth === 0);

    // If deep, try to favor deep obstacles slightly?
    // For now random is fine, as high depth obstacles are few and impactful.

    const obs = eligible[Math.floor(Math.random() * eligible.length)];
    setCurrentObstacle(obs);
    addLog(`ENCUENTRO: ${obs.text}`);
  };

  // New RNG Logic: Probability based, not additive
  const attemptAction = (statValue, difficulty) => {
    // Adjusted: Base 60% chance (Easier start)
    // BUFF: +6% per point difference (was 5%) to make upgrades feel more impactful
    let chance = 60 + (statValue - difficulty) * 6;

    // Cap chance to avoid 100% or 0% (always some luck involved)
    if (chance > 95) chance = 95;
    if (chance < 5) chance = 5;

    const roll = Math.random() * 100;
    return roll < chance;
  };

  const handleChoice = (option) => {
    // PROGRESSIVE SCALING: +1 Difficulty per 15m (was 10m)
    // Slower curve allows stats to shine longer before the cave crushes you.
    const depthMalus = Math.floor(depth / 15);
    const effectiveDifficulty = option.difficulty + depthMalus;

    const success = attemptAction(explorer[option.stat], effectiveDifficulty);

    addLog(`> Acción: ${option.text}`);

    if (success) {
      addLog(`¡ÉXITO! ${getRandomLog(SUCCESS_MSGS)}`);
      const xpGained = getXpForSuccess(effectiveDifficulty);
      const newDepth = depth + 10;

      addLog(`+${xpGained} XP`);

      if (newDepth >= CAVE_DEPTH_GOAL) {
        setGameStatus('victory');
        setCurrentObstacle(null);
        setDepth(newDepth);
        addLog(`¡LUZ! Has visto la salida.`);
        addLog(`Has conquistado la Cueva Misteriosa.`);
      } else {
        setRunXP(prev => prev + xpGained);
        setDepth(newDepth);
        generateObstacle(newDepth);
      }
    } else {
      // Damage scales with difficulty or uses specific option.damage
      const baseDamage = option.damage || 20;
      const damage = baseDamage + Math.floor(depthMalus * 0.8);
      const newEnergy = Math.max(0, currentEnergy - damage);
      setCurrentEnergy(newEnergy);
      addLog(`FALLO: ${getRandomLog(FAILURE_MSGS)} -${damage} Energía.`);

      const failXP = getXpForFailure(getXpForSuccess(effectiveDifficulty));
      setRunXP(prev => prev + failXP);
      addLog(`+${failXP} XP (parcial)`);

      if (newEnergy <= 0) {
        handleDeath();
      }
    }
  };

  const handleDeath = () => {
    setGameStatus('failed');
    setCurrentObstacle(null);

    // Create Diary
    const newDiary = {
      id: Date.now(),
      explorerName: `Explorador #${prevDiariesCount() + 1}`,
      xp: runXP,
      date: new Date().toLocaleTimeString(),
      depthReached: depth
    };

    setDiaries(prev => [...prev, newDiary]);
    addLog("!!! AGOTADO !!! El explorador colapsa.");
    addLog(`Mueres a los ${depth}m de profundidad.`);
    addLog(`Has dejado un Diario con ${runXP} pts.`);
  };

  const prevDiariesCount = () => diaries.length;

  const handleCollectDiaries = () => {
    const totalXP = diaries.reduce((acc, d) => acc + d.xp, 0);
    setKnowledgePoints(prev => prev + totalXP);
    setDiaries([]); // Consumed
    addLog(`Recuperas el conocimiento perdido: +${totalXP} Puntos.`);
  };

  // Energy "level" for cost calculation: level 1 at base 100, level 2 at 110, etc.
  const getEnergyLevel = () => Math.floor((explorer.energia - INITIAL_STATS.energia) / ENERGY_UPGRADE_STEP) + 1;

  const handleUpgrade = (stat) => {
    if (stat === 'energia') {
      if (explorer.energia >= MAX_ENERGY) {
        addLog(`¡ENERGÍA ya está al máximo!`);
        return;
      }
      const cost = getUpgradeCost(getEnergyLevel());
      if (knowledgePoints >= cost) {
        setKnowledgePoints(prev => prev - cost);
        setBaseStats(prev => ({ ...prev, energia: prev.energia + ENERGY_UPGRADE_STEP }));
        setExplorer(prev => ({ ...prev, energia: prev.energia + ENERGY_UPGRADE_STEP }));
        setCurrentEnergy(prev => prev + ENERGY_UPGRADE_STEP);
        addLog(`MEJORA: ENERGÍA sube a ${explorer.energia + ENERGY_UPGRADE_STEP}.`);
      } else {
        addLog(`Necesitas ${cost} Puntos de Conocimiento.`);
      }
    } else {
      const currentVal = explorer[stat];
      const cost = getUpgradeCost(currentVal);
      if (currentVal >= MAX_STAT) {
        addLog(`¡${stat.toUpperCase()} ya está al máximo!`);
        return;
      }
      if (knowledgePoints >= cost) {
        setKnowledgePoints(prev => prev - cost);
        setBaseStats(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
        setExplorer(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
        addLog(`MEJORA: ${stat.toUpperCase()} sube a ${explorer[stat] + 1}.`);
      } else {
        addLog(`Necesitas ${cost} Puntos de Conocimiento.`);
      }
    }
  };

  const handleReset = () => {
    // Reset full state but keep progression
    setExplorer({ ...baseStats });
    setCurrentEnergy(baseStats.energia);
    setGameStatus('idle');
    setLogs(['Un nuevo explorador llega a la entrada...', `Encuentra ${diaries.length} diarios.`]);
    setCurrentObstacle(null);
    // Knowledge Points are NOT reset, they persist (conceptually attached to the 'player' or the new explorer having found them)
    setRunXP(0);
    setDepth(0);
  };

  // Full Reset for "Play Again"
  const handleFullRestart = () => {
    setBaseStats(INITIAL_STATS);
    setExplorer(INITIAL_STATS);
    setCurrentEnergy(INITIAL_STATS.energia);
    setKnowledgePoints(0);
    setDiaries([]);
    setRunXP(0);
    setDepth(0);
    setGameStatus('idle');
    setLogs(['--- NUEVA PARTIDA ---', 'La leyenda comienza de nuevo.']);
  };

  return (
    <div className="game-container">
      <header className="header">
        <h1>La Cueva Misteriosa</h1>
        <p className="subtitle">Explora, Muere, Aprende, Repite</p>
      </header>

      <main className="main-layout">
        {/* Left Panel: Explorer Stats */}
        <section className="panel explorer-panel">
          <h2>Explorador</h2>
          <div className="avatar-placeholder">
            👤
          </div>
          <div className="rank-display" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Rango: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{getRankFromStats()}</span>
          </div>

          <div style={{ background: 'rgba(212, 160, 23, 0.1)', border: '1px solid var(--accent)', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Conocimiento</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{knowledgePoints}</div>
          </div>

          <div className="stats-grid">
            {['fuerza', 'agilidad', 'conocimiento'].map(stat => (
              <div key={stat}>
                <div className="stat-row">
                  <span className="stat-label" style={{ textTransform: 'capitalize' }}>{stat}</span>
                  <span className="stat-value">{explorer[stat]} <span style={{ fontSize: '0.6rem', color: '#666' }}>/ {MAX_STAT}</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div className="stat-bar" style={{ flex: 1, marginBottom: 0 }}><div style={{ width: `${(explorer[stat] / MAX_STAT) * 100}%` }}></div></div>
                  {gameStatus === 'idle' && (
                    <button
                      disabled={knowledgePoints < getUpgradeCost(explorer[stat]) || explorer[stat] >= MAX_STAT}
                      onClick={() => handleUpgrade(stat)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        background: (explorer[stat] >= MAX_STAT) ? '#333' : (knowledgePoints >= getUpgradeCost(explorer[stat]) ? 'var(--success)' : '#444'),
                        color: (explorer[stat] >= MAX_STAT) ? '#888' : '#000',
                        fontWeight: 'bold',
                        cursor: (explorer[stat] >= MAX_STAT) ? 'default' : 'pointer'
                      }}
                      title={explorer[stat] >= MAX_STAT ? 'Máximo alcanzado' : `Mejorar (Costo: ${getUpgradeCost(explorer[stat])})`}
                    >
                      {explorer[stat] >= MAX_STAT ? 'MAX' : '+'}
                    </button>
                  )}
                </div>
                <div style={{ height: '10px' }}></div>
              </div>
            ))}

            <div className="stat-row">
              <span className="stat-label" style={{ color: 'var(--energy)' }}>Energía</span>
              <span className="stat-value">{currentEnergy} <span style={{ fontSize: '0.6rem', color: '#666' }}>/ {explorer.energia}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div className="stat-bar energy" style={{ flex: 1, marginBottom: 0 }}><div style={{ width: `${(currentEnergy / explorer.energia) * 100}%` }}></div></div>
              {gameStatus === 'idle' && (
                <button
                  disabled={knowledgePoints < getUpgradeCost(getEnergyLevel()) || explorer.energia >= MAX_ENERGY}
                  onClick={() => handleUpgrade('energia')}
                  style={{
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    background: (explorer.energia >= MAX_ENERGY) ? '#333' : (knowledgePoints >= getUpgradeCost(getEnergyLevel()) ? 'var(--success)' : '#444'),
                    color: (explorer.energia >= MAX_ENERGY) ? '#888' : '#000',
                    fontWeight: 'bold',
                    cursor: (explorer.energia >= MAX_ENERGY) ? 'default' : 'pointer'
                  }}
                  title={explorer.energia >= MAX_ENERGY ? 'Máximo alcanzado' : `Mejorar (+${ENERGY_UPGRADE_STEP}) (Costo: ${getUpgradeCost(getEnergyLevel())})`}
                >
                  {explorer.energia >= MAX_ENERGY ? 'MAX' : '+'}
                </button>
              )}
            </div>
          </div>

          {/* Prompt 4/5: Show Diaries Shelf */}
          {diaries.length > 0 && (
            <div className="diaries-shelf" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Legado ({diaries.length} Diarios)</h3>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
                Último: {diaries[diaries.length - 1].depthReached}m (+{diaries[diaries.length - 1].xp} XP)
              </div>
              {gameStatus === 'idle' && (
                <button
                  onClick={handleCollectDiaries}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'var(--text-secondary)',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                  Leer Todo (+{diaries.reduce((acc, d) => acc + d.xp, 0)} XP)
                </button>
              )}
            </div>
          )}
        </section>

        {/* Center Panel: Action / Cave */}
        <section className="panel center-panel">
          <div className="cave-visual">
            {gameStatus === 'idle' && (
              <img src={startScreenImg} className="cave-image" alt="Entrada a la cueva" />
            )}

            {gameStatus === 'exploring' && currentObstacle && (
              currentObstacle.image ?
                <img src={currentObstacle.image} className="cave-image" alt="Obstáculo" /> :
                <div className="cave-mouth"></div>
            )}

            {/* Fallback / Loading if exploring but no obstacle yet (rare) */}
            {gameStatus === 'exploring' && !currentObstacle && <div className="cave-mouth"></div>}

            {/* Victory/Failed images */}
            {gameStatus === 'victory' && (
              <img src={victoryImg} className="cave-image" alt="Victoria" />
            )}
            {gameStatus === 'failed' && (
              <img src={defeatImg} className="cave-image" alt="Derrota" />
            )}

            {/* Fallback only if some state has no image */}
            {(gameStatus === 'failed' || gameStatus === 'victory') && !victoryImg && !defeatImg && (
              <div className="cave-mouth"></div>
            )}

            {gameStatus === 'exploring' && (
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', textAlign: 'right', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{depth}m</div>
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Profundidad</div>
              </div>
            )}

            {/* Victory Overlay in visual */}
            {gameStatus === 'victory' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212, 160, 23, 0.2)', flexDirection: 'column' }}>
                <div style={{ fontSize: '4rem' }}>🏆</div>
              </div>
            )}
          </div>

          <div className="action-area" style={{ height: 'auto', minHeight: '80px', padding: '10px' }}>
            {gameStatus === 'idle' && (
              <button className="btn-primary" onClick={startExploration}>
                Entrar a la Cueva
              </button>
            )}

            {gameStatus === 'exploring' && currentObstacle && (
              <div className="options-grid" style={{ display: 'grid', gap: '10px', width: '100%' }}>
                {currentObstacle.options.map((opt, i) => (
                  <button key={i} className="btn-option" onClick={() => handleChoice(opt)} style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'var(--text-primary)',
                    padding: '10px',
                    textAlign: 'left',
                    border: '1px solid var(--accent)'
                  }}>
                    {opt.text}
                    {/* Hidden info per Prompt 9 */}
                  </button>
                ))}
              </div>
            )}

            {gameStatus === 'failed' && (
              <div className="failed-state" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '20px' }}>
                <p className="failure-text">El explorador ha caído.</p>
                <div style={{ color: 'var(--accent)', marginBottom: '10px' }}>
                  Se ha guardado un Diario con {runXP} XP.
                </div>
                <button className="btn-primary" onClick={handleReset}>
                  Enviar Siguiente Explorador
                </button>
              </div>
            )}

            {gameStatus === 'victory' && (
              <div className="victory-state" style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--success)', margin: 0 }}>¡CUEVA COMPLETADA!</h3>
                <p style={{ fontSize: '0.9rem' }}>El linaje de exploradores ha cumplido su misión.</p>
                <button className="btn-primary" onClick={handleFullRestart}>
                  Jugar de Nuevo
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Logs/Info */}
        <section className="panel log-panel">
          <h2>Diario de Sucesos</h2>
          <div className="log-list">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">{log}</div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
