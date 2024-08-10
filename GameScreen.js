import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CAR_SIZE = 50;
const INITIAL_LIVES = 3;

export default function GameScreen() {
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const carX = useSharedValue(width / 2 - CAR_SIZE / 2);
  
  const carStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: carX.value }],
    };
  });

  const handleGesture = (event) => {
    carX.value = withTiming(Math.min(Math.max(0, event.translationX + width / 2 - CAR_SIZE / 2), width - CAR_SIZE));
  };

  const checkCollision = () => {
    // Logic to check collision with other cars and reduce lives
    // If lives are exhausted, setGameOver(true)
  };

  useEffect(() => {
    if (gameOver) {
      Alert.alert('Game Over', 'You have lost all your lives!', [
        { text: 'Restart', onPress: resetGame }
      ]);
    }
  }, [gameOver]);

  const resetGame = () => {
    setLives(INITIAL_LIVES);
    setGameOver(false);
  };

  const pauseGame = () => {
    // Logic to pause the game
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <Animated.View style={[styles.car, carStyle]} />
      </PanGestureHandler>
      <View style={styles.hud}>
        <Text style={styles.livesText}>Lives: {lives}</Text>
        <TouchableOpacity style={styles.pauseButton} onPress={pauseGame}>
          <Text style={styles.pauseButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  car: {
    width: CAR_SIZE,
    height: CAR_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 50,
  },
  hud: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livesText: {
    color: 'white',
    fontSize: 20,
  },
  pauseButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  pauseButtonText: {
    fontSize: 16,
    color: 'black',
  },
});
