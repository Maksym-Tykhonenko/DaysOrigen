import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useRef, useState} from 'react';
import {Animated, View, Dimensions, StyleSheet} from 'react-native';
import {Text, Button, Surface, useTheme} from 'react-native-paper';
import {Header} from '../components/header';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');
const WHEEL_SIZE = 300;
const RADIUS = WHEEL_SIZE / 2;

export const BonusTaskWheel = () => {
  const theme = useTheme();
  const tasks = [
    'Meditation',
    'Physical Activity',
    'Reading',
    'Learning a Language',
    'Drawing',
    'Cleaning',
  ];

  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addTask = async () => {
    const newCard = {
      id: Date.now(),
      title: selectedTask,
      type: 'bonus',
      subtitle: 'New Task Description',
      date: `${'Monday'}, 7:00`,
      color: getRandomColor(),
      description: 'Custom task added by the user.',
      duration: '30 mins',
      category: 'Custom',
    };

    try {
      const storedCards = await AsyncStorage.getItem('cardsData');
      const parsedCards = storedCards ? JSON.parse(storedCards) : {};

      const existingCards = parsedCards['Monday'] || [];
      const updatedCards = [...existingCards, newCard];

      const updatedData = {
        ...parsedCards,
        ['Monday']: updatedCards,
      };

      Toast.show({
        type: 'success',
        text1: 'Task Added',
        text2: `"${selectedTask}" successfully added to Monday`,
      });

      await AsyncStorage.setItem('cardsData', JSON.stringify(updatedData));
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add task. Please try again.',
      });

      return null;
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinWheel = () => {
    if (tasks.length === 0) {
      return;
    }

    const randomSpins = Math.floor(Math.random() * 3) + 4;
    const randomIndex = Math.floor(Math.random() * tasks.length);
    const spinEnd = randomSpins + randomIndex / tasks.length;

    Animated.timing(spinValue, {
      toValue: spinEnd,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTask(tasks[randomIndex]);
      spinValue.setValue(spinEnd % 1);
    });
  };

  const getSlices = () => {
    const angleStep = 360 / tasks.length;
    return tasks.map((task, index) => {
      const rotateAngle = angleStep * index;
      return (
        <Animated.View
          key={index}
          style={[
            styles.sliceContainer,
            {
              transform: [
                {rotate: `${rotateAngle}deg`},
                {translateY: -RADIUS + 40},
              ],
            },
          ]}>
          <Text
            style={[
              styles.taskText,
              {
                transform: [{rotate: `${-rotateAngle}deg`}],
              },
            ]}>
            {task}
          </Text>
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text
        variant="titleMedium"
        style={{textAlign: 'center', marginBottom: 20}}>
        Bonus
      </Text>
      <Surface style={styles.wheelContainer}>
        <Animated.View
          style={[
            styles.wheel,
            {
              transform: [{rotate: spin}],
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            },
          ]}>
          {getSlices()}
        </Animated.View>
      </Surface>

      <View style={styles.arrowContainer}>
        <View style={styles.arrow} />
      </View>

      <Button
        mode="contained"
        onPress={spinWheel}
        style={styles.spinButton}
        buttonColor="#ffffff"
        textColor="#6a11cb">
        Spin the Wheel
      </Button>

      {selectedTask && (
        <Surface style={styles.taskContainer}>
          <Text style={styles.selectedTaskText}>
            Selected Task: {selectedTask}
          </Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={addTask}
              style={styles.actionButton}>
              Add
            </Button>
            <Button
              mode="outlined"
              onPress={() => setSelectedTask(null)}
              textColor="#ffffff"
              style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: RADIUS,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: RADIUS,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  sliceContainer: {
    position: 'absolute',
    // width: 40,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    fontSize: 12,
    color: '#6a11cb',
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
  spinButton: {
    marginTop: 20,
    width: '80%',
  },
  taskContainer: {
    marginTop: 20,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  selectedTaskText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  cancelButton: {
    flex: 1,
  },
});
