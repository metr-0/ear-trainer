import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Dimensions,
  PanResponder,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Svg, { Circle, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MEASURE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);

// Типы
type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  life: number;
};

type Obstacle = {
  x: number;
  y: number;
};

type Entities = {
  mainCircle: {
    x: number;
    animY: Animated.Value;
    currentY: number;
  };
  particles: Particle[];
  obstacles: Obstacle[];
  state: {
    position: number;
    targetTrack: number;
    showTarget: boolean;
    phaseStartTime: number;
    phase: GamePhase;
    paused: boolean;
    pauseTime: number;
  };
};

enum GamePhase {
  ShowNumber,
  ShowObstacles,
  ReturnToCenter,
  WaitNext,
}

// Компоненты
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MainCircle = ({ x, animY }: { x: number; animY: Animated.Value }) => (
  <AnimatedCircle cx={x} cy={animY} r={MEASURE * 0.1} fill="blue" />
);

const ParticleComponent = ({ x, y, size, color }: Particle) => (
  <Circle cx={x} cy={y} r={size} fill={color} />
);

const TargetNumber = ({ target, visible }: { target: number; visible: boolean }) =>
  visible ? (
    <View style={styles.targetNumber}>
      <Text style={styles.targetText}>{target}</Text>
    </View>
  ) : null;

const PauseButton = ({ paused, onPress }: { paused: boolean; onPress: () => void }) => (
  <TouchableOpacity style={styles.pauseButton} onPress={onPress}>
    <Text style={styles.pauseButtonText}>{paused ? '▶' : '⏸'}</Text>
  </TouchableOpacity>
);

// Система частиц
const particleSystem = (entities: Entities) => {
  if (entities.state.paused) return entities;

  const { mainCircle, particles } = entities;
  const currentY = mainCircle.animY.__getValue();
  mainCircle.currentY = currentY;

  if (Math.random() < 0.3) {
    particles.push({
      x: mainCircle.x,
      y: currentY + (Math.random() * MEASURE * 0.15 - MEASURE * 0.075),
      size: Math.random() * MEASURE * 0.01 + MEASURE * 0.005,
      color: `rgba(100, 100, 255, ${Math.random() * 0.5 + 0.5})`,
      speed: Math.random() * MEASURE * 0.01 + MEASURE * 0.005,
      life: 100,
    });
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x -= p.speed;
    p.life -= 1;
    p.size *= 0.97;

    if (p.life <= 0 || p.x < 0) {
      particles.splice(i, 1);
    }
  }

  return entities;
};

// Препятствия
const obstacleSystem = (entities: Entities) => {
  if (entities.state.paused) return entities;

  const { obstacles } = entities;

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= 50; // движение справа налево

    if (obstacles[i].x < -50) {
      obstacles.splice(i, 1);
    }
  }

  return entities;
};

const spawnObstacles = (entities: Entities, safeTrack: number) => {
  const { obstacles } = entities;
  const tracks = [-1, 0, 1].filter(t => t !== safeTrack);

  tracks.forEach(track => {
    const y = SCREEN_HEIGHT / 2 - track * MEASURE * 0.2;
    obstacles.push({ x: SCREEN_WIDTH + 50, y });
  });
};

// Главный компонент
export default function HigherLowerGame() {
  const animY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const gameEngineRef = useRef<GameEngine>(null);

  const [entities] = useState<Entities>({
    mainCircle: {
      x: SCREEN_WIDTH / 2,
      animY,
      currentY: SCREEN_HEIGHT / 2,
    },
    particles: [],
    obstacles: [],
    state: {
      position: 0,
      targetTrack: 0,
      showTarget: true,
      phase: GamePhase.ShowNumber,
      phaseStartTime: 0,
      paused: false,
      pauseTime: 0,
    }
  });

  const [paused, setPaused] = useState(false);

  const togglePause = () => {
    const newPausedState = !entities.state.paused;
    entities.state.paused = newPausedState;
    setPaused(newPausedState);

    if (newPausedState) {
      // При паузе сохраняем время паузы
      entities.state.pauseTime = Date.now();
    } else {
      // При возобновлении корректируем phaseStartTime
      if (entities.state.pauseTime) {
        const pauseDuration = Date.now() - entities.state.pauseTime;
        entities.state.phaseStartTime += pauseDuration;
        entities.state.pauseTime = 0;
      }
    }
  };

  // Основной игровой цикл
  const gameLoopSystem = (entities: Entities, { time }) => {
    if (entities.state.paused) return entities;

    const { state } = entities;

    if (!state.phaseStartTime) state.phaseStartTime = time.current;

    const elapsed = time.current - state.phaseStartTime;

    switch (state.phase) {
      case GamePhase.ShowNumber:
        if (elapsed > 1000) {
          state.phase = GamePhase.ShowObstacles;
          state.phaseStartTime = time.current;
          state.showTarget = false;
          spawnObstacles(entities, state.targetTrack);
        }
        break;

      case GamePhase.ShowObstacles:
        if (elapsed > 500) {
          state.phase = GamePhase.ReturnToCenter;
          state.phaseStartTime = time.current;
          moveCircle(0, entities); // возвращаем в центр
        }
        break;

      case GamePhase.ReturnToCenter:
        if (elapsed > 500) {
          state.phase = GamePhase.WaitNext;
          state.phaseStartTime = time.current;
        }
        break;

      case GamePhase.WaitNext:
        if (elapsed > 1000) {
          state.targetTrack = [-1, 0, 1][Math.floor(Math.random() * 3)];
          state.phase = GamePhase.ShowNumber;
          state.phaseStartTime = time.current;
          state.showTarget = true;
        }
        break;
    }

    return entities;
  };

  const swipeLocked = useRef(false);

  const moveCircle = (newPosition: number, entitiesRef = entities) => {
    if (entitiesRef.state.paused) return;

    const clamped = Math.max(-1, Math.min(1, newPosition));
    entitiesRef.state.position = clamped;
    const newY = SCREEN_HEIGHT / 2 - clamped * MEASURE * 0.2;

    Animated.timing(entitiesRef.mainCircle.animY, {
      toValue: newY,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !entities.state.paused,
      onMoveShouldSetPanResponder: () => !entities.state.paused,
      onPanResponderMove: (evt, gestureState) => {
        if (swipeLocked.current || entities.state.phase != GamePhase.ShowNumber || entities.state.paused) return;

        const { dy } = gestureState;
        let delta = 0;

        if (dy > 10) delta = -1;
        else if (dy < -10) delta = 1;

        if (delta !== 0) {
          const newPosition = Math.max(-1, Math.min(1, entities.state.position + delta));
          if (newPosition !== entities.state.position) {
            moveCircle(newPosition);
            swipeLocked.current = true;
          }
        }
      },
      onPanResponderRelease: () => {
        swipeLocked.current = false;
      },
      onPanResponderTerminate: () => {
        swipeLocked.current = false;
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <GameEngine
        ref={gameEngineRef}
        systems={[particleSystem, obstacleSystem, gameLoopSystem]}
        entities={entities}
        running={!paused}
        renderer={(entities) => {
          if (!entities || !entities.mainCircle || !entities.particles) {
            return <View style={styles.gameContainer} />;
          }

          return (
            <View style={styles.gameContainer}>
              <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH} style={styles.svg}>
                {/* Горизонтальные пунктирные линии */}
                <Line x1="0" x2={SCREEN_WIDTH} y1={SCREEN_HEIGHT / 2 + MEASURE * 0.1} y2={SCREEN_HEIGHT / 2 + MEASURE * 0.1} stroke="gray" strokeWidth="2" strokeDasharray="5,5" />
                <Line x1="0" x2={SCREEN_WIDTH} y1={SCREEN_HEIGHT / 2 - MEASURE * 0.1} y2={SCREEN_HEIGHT / 2 - MEASURE * 0.1} stroke="gray" strokeWidth="2" strokeDasharray="5,5" />
                <Line x1="0" x2={SCREEN_WIDTH} y1={SCREEN_HEIGHT / 2 + MEASURE * 0.3} y2={SCREEN_HEIGHT / 2 + MEASURE * 0.3} stroke="gray" strokeWidth="2" strokeDasharray="5,5" />
                <Line x1="0" x2={SCREEN_WIDTH} y1={SCREEN_HEIGHT / 2 - MEASURE * 0.3} y2={SCREEN_HEIGHT / 2 - MEASURE * 0.3} stroke="gray" strokeWidth="2" strokeDasharray="5,5" />

                {/* Частицы */}
                {entities.particles.map((p, i) => (
                  <ParticleComponent key={`particle-${i}`} {...p} />
                ))}

                {/* Препятствия */}
                {entities.obstacles.map((o, i) => (
                  <Circle key={`obstacle-${i}`} cx={o.x} cy={o.y} r={20} fill="red" />
                ))}

                {/* Главный круг */}
                <MainCircle x={entities.mainCircle.x} animY={entities.mainCircle.animY} />
              </Svg>

              {/* Целевая цифра */}
              <TargetNumber target={entities.state.targetTrack} visible={entities.state.showTarget} />

              {/* Затемнение при паузе */}
              {paused && <View style={styles.pauseOverlay} />}
            </View>
          );
        }}
      />

      <PauseButton paused={paused} onPress={togglePause} />

      {paused && (
        <View style={styles.pauseTextContainer}>
          <Text style={styles.pauseText}>PAUSED</Text>
        </View>
      )}
    </View>
  );
}

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  targetNumber: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  targetText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  pauseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  pauseButtonText: {
    fontSize: 24,
    color: 'white',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  pauseTextContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    zIndex: 20,
  },
  pauseText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});