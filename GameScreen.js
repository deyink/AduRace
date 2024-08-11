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
  const [opponentCars, setOpponentCars] = useState([]);

const spawnOpponentCars = () => {
  const interval = setInterval(() => {
    setOpponentCars((prevCars) => [
      ...prevCars,
      { id: Date.now(), x: Math.random() * (width - CAR_SIZE), y: 0 }
    ]);
  }, 1000);


//   {opponentCars.map(car => (
//     <View key={car.id} style={[styles.opponentCar, { top: car.y, left: car.x }]} />
//   ))}

//   opponentCar: {
//     width: CAR_SIZE,
//     height: CAR_SIZE,
//     backgroundColor: 'blue',
//     position: 'absolute',
//   },

const checkCollision = () => {
    opponentCars.forEach(car => {
      if (
        car.y + CAR_SIZE >= height - 100 &&
        car.y <= height - 50 &&
        car.x >= carX.value &&
        car.x <= carX.value + CAR_SIZE
      ) {
        setLives((prevLives) => prevLives - 1);
        setOpponentCars((prevCars) => prevCars.filter(c => c.id !== car.id));
        
        if (lives - 1 === 0) {
          setGameOver(true);
        }
      }
    });
  };
  
  
  

  return () => clearInterval(interval);
};

useEffect(() => {
  const clearOpponentCars = spawnOpponentCars();
  
  const gameLoop = setInterval(() => {
    setOpponentCars((prevCars) => prevCars.map(car => ({ ...car, y: car.y + 5 })));
    checkCollision();
  }, 50);
  
  return () => {
    clearOpponentCars();
    clearInterval(gameLoop);
  };
}, []);


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
