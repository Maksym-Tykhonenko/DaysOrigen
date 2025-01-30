import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, ScrollView, View} from 'react-native';
import {Header} from '../components/header';
import {Icon, Text} from 'react-native-paper';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {DayPlanningModal} from '../components/dayPlanningModal';
import CardsWithModal from '../components/сardsWithModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

const cardsData = {
  Monday: [
    {
      id: '1',
      title: 'Morning Meditation',
      subtitle: 'Mindfulness Practice',
      date: 'Monday, 7:00',
      color: '#FFDDC1',
      description:
        'Start the week with a 30-minute guided meditation focusing on breath awareness and setting positive intentions for the day.',
      duration: '30 mins',
      category: 'Wellness',
    },
    {
      id: '2',
      title: 'Project Planning',
      subtitle: 'Weekly Strategy',
      date: 'Monday, 10:00',
      color: '#D0F4DE',
      description:
        'Detailed review and breakdown of project milestones, resource allocation, and team coordination for the upcoming week.',
      duration: '1.5 hours',
      category: 'Work',
    },
    {
      id: '3',
      title: 'Language Learning',
      subtitle: 'Spanish Lesson',
      date: 'Monday, 18:00',
      color: '#C5DFF8',
      description:
        'Online interactive Spanish lesson focusing on conversational skills, grammar, and vocabulary expansion.',
      duration: '45 mins',
      category: 'Education',
    },
    {
      id: '4',
      title: 'Fitness Workout',
      subtitle: 'Strength Training',
      date: 'Monday, 20:00',
      color: '#FFE3E3',
      description:
        'Comprehensive strength training session targeting major muscle groups with progressive resistance exercises.',
      duration: '1 hour',
      category: 'Fitness',
    },
  ],
  Tuesday: [
    {
      id: '5',
      title: 'Code Review',
      subtitle: 'Development Sprint',
      date: 'Tuesday, 9:00',
      color: '#FFDDC1',
      description:
        'Comprehensive code review session for current development sprint, addressing technical debt and optimization strategies.',
      duration: '2 hours',
      category: 'Work',
    },
    {
      id: '6',
      title: 'Reading Time',
      subtitle: 'Professional Development',
      date: 'Tuesday, 12:00',
      color: '#D0F4DE',
      description:
        'Dedicated reading time for industry research papers, technical blogs, and professional development materials.',
      duration: '1 hour',
      category: 'Learning',
    },
    {
      id: '7',
      title: 'Nutrition Planning',
      subtitle: 'Meal Prep',
      date: 'Tuesday, 16:00',
      color: '#C5DFF8',
      description:
        'Detailed meal planning and preparation for the week, focusing on balanced nutrition and dietary goals.',
      duration: '1.5 hours',
      category: 'Health',
    },
    {
      id: '8',
      title: 'Photography Workshop',
      subtitle: 'Online Course',
      date: 'Tuesday, 19:00',
      color: '#FFE3E3',
      description:
        'Advanced digital photography techniques workshop with live instructor and practical editing session.',
      duration: '1 hour',
      category: 'Hobby',
    },
  ],
  Wednesday: [
    {
      id: '9',
      title: 'Team Meeting',
      subtitle: 'Weekly Sync',
      date: 'Wednesday, 10:00',
      color: '#FFDDC1',
      description:
        'Collaborative team meeting to discuss progress, challenges, and align on collective goals and strategies.',
      duration: '1.5 hours',
      category: 'Work',
    },
    {
      id: '12',
      title: 'Yoga Practice',
      subtitle: 'Mind-Body Connection',
      date: 'Wednesday, 17:00',
      color: '#D0F4DE',
      description:
        'Intermediate yoga session focusing on flexibility, balance, and mental clarity through structured asana practice.',
      duration: '1 hour',
      category: 'Wellness',
    },
    {
      id: '13',
      title: 'Guitar Lesson',
      subtitle: 'Music Training',
      date: 'Wednesday, 19:30',
      color: '#C5DFF8',
      description:
        'Advanced guitar techniques workshop with focus on complex chord progressions and improvisation skills.',
      duration: '45 mins',
      category: 'Hobby',
    },
    {
      id: '14',
      title: 'Personal Finance Review',
      subtitle: 'Monthly Budget',
      date: 'Wednesday, 21:00',
      color: '#FFE3E3',
      description:
        'Comprehensive financial review, budget tracking, investment portfolio analysis, and future planning.',
      duration: '1 hour',
      category: 'Finance',
    },
  ],
  Thursday: [
    {
      id: '41',
      title: 'Writing Workshop',
      subtitle: 'Creative Writing',
      date: 'Thursday, 8:00',
      color: '#FFDDC1',
      description:
        'Structured creative writing session with prompts, peer feedback, and narrative development techniques.',
      duration: '1 hour',
      category: 'Creative',
    },
    {
      id: '52',
      title: 'Design Sprint',
      subtitle: 'UX Strategy',
      date: 'Thursday, 11:00',
      color: '#D0F4DE',
      description:
        'Collaborative design thinking workshop focusing on user experience research and interface prototype development.',
      duration: '2 hours',
      category: 'Work',
    },
    {
      id: '23',
      title: 'Cooking Class',
      subtitle: 'International Cuisine',
      date: 'Thursday, 18:00',
      color: '#C5DFF8',
      description:
        'Online international cooking workshop exploring culinary techniques from a specific global cuisine.',
      duration: '1.5 hours',
      category: 'Hobby',
    },
    {
      id: '34',
      title: 'Meditation Retreat',
      subtitle: 'Mindfulness Session',
      date: 'Thursday, 20:30',
      color: '#FFE3E3',
      description:
        'Guided meditation and mindfulness retreat focusing on stress reduction and emotional regulation techniques.',
      duration: '45 mins',
      category: 'Wellness',
    },
  ],
  Friday: [
    {
      id: '71',
      title: 'Machine Learning Lecture',
      subtitle: 'Tech Learning',
      date: 'Friday, 9:00',
      color: '#FFDDC1',
      description:
        'Advanced machine learning lecture covering neural network architectures and practical implementation strategies.',
      duration: '1.5 hours',
      category: 'Education',
    },
    {
      id: '232',
      title: 'Networking Event',
      subtitle: 'Professional Connection',
      date: 'Friday, 12:00',
      color: '#D0F4DE',
      description:
        'Virtual professional networking session with industry experts and potential collaboration opportunities.',
      duration: '1 hour',
      category: 'Professional Development',
    },
    {
      id: '93',
      title: 'Art Therapy',
      subtitle: 'Creative Expression',
      date: 'Friday, 17:00',
      color: '#C5DFF8',
      description:
        'Guided art therapy session exploring emotional expression through various artistic mediums and techniques.',
      duration: '1 hour',
      category: 'Wellness',
    },
    {
      id: '74',
      title: 'Weekend Planning',
      subtitle: 'Personal Strategy',
      date: 'Friday, 21:00',
      color: '#FFE3E3',
      description:
        'Comprehensive weekend planning session including personal goals, leisure activities, and relaxation strategies.',
      duration: '45 mins',
      category: 'Personal Management',
    },
  ],
  Saturday: [
    {
      id: '201',
      title: 'Hiking Adventure',
      subtitle: 'Nature Exploration',
      date: 'Saturday, 7:00',
      color: '#FFDDC1',
      description:
        'Guided hiking expedition exploring local trails, focusing on physical fitness and nature connection.',
      duration: '3 hours',
      category: 'Fitness',
    },
    {
      id: '322',
      title: 'Photography Expedition',
      subtitle: 'Urban Landscape',
      date: 'Saturday, 14:00',
      color: '#D0F4DE',
      description:
        'Urban photography workshop capturing architectural and street photography techniques in city environment.',
      duration: '2 hours',
      category: 'Hobby',
    },
    {
      id: '312',
      title: 'Language Exchange',
      subtitle: 'Cultural Immersion',
      date: 'Saturday, 18:00',
      color: '#C5DFF8',
      description:
        'International language exchange meetup practicing conversational skills with native speakers from different cultures.',
      duration: '1.5 hours',
      category: 'Education',
    },
    {
      id: '443',
      title: 'Home Organization',
      subtitle: 'Space Management',
      date: 'Saturday, 20:00',
      color: '#FFE3E3',
      description:
        'Systematic home organization and decluttering session with minimalist design principles and efficiency strategies.',
      duration: '1 hour',
      category: 'Personal Management',
    },
  ],
  Sunday: [
    {
      id: '176',
      title: 'Meditation Retreat',
      subtitle: 'Weekly Reflection',
      date: 'Sunday, 8:00',
      color: '#FFDDC1',
      description:
        'Extended meditation and reflection session reviewing personal growth, setting intentions, and practicing gratitude.',
      duration: '2 hours',
      category: 'Wellness',
    },
    {
      id: '285',
      title: 'Online Learning',
      subtitle: 'Skill Development',
      date: 'Sunday, 12:00',
      color: '#D0F4DE',
      description:
        'Comprehensive online learning session exploring new skills through interactive courses and practical workshops.',
      duration: '1.5 hours',
      category: 'Education',
    },
    {
      id: '3987',
      title: 'Creative Writing',
      subtitle: 'Personal Project',
      date: 'Sunday, 16:00',
      color: '#C5DFF8',
      description:
        'Dedicated creative writing time for personal storytelling, journaling, and narrative development.',
      duration: '1 hour',
      category: 'Creative',
    },
    {
      id: '444',
      title: 'Meal Prep',
      subtitle: 'Healthy Nutrition',
      date: 'Sunday, 19:00',
      color: '#FFE3E3',
      description:
        'Strategic meal preparation for the upcoming week, focusing on nutritional balance and dietary goals.',
      duration: '1.5 hours',
      category: 'Health',
    },
  ],
};

export const Home = () => {
  const focused = useIsFocused();
  const {theme} = useMaterial3Theme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleWith, setModalVisibleWith] = useState(false);
  const [cardId, setCardId] = useState('0');
  const [card, setCard] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<any>('Friday');
  const [pinnedCards, setPinnedCards] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const saveCompletedTasks = async (tasks: string[]) => {
    try {
      await AsyncStorage.setItem('completedTasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save completed tasks:', e);
    }
  };

  const loadCompletedTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('completedTasks');
      if (savedTasks) {
        setCompletedTasks(JSON.parse(savedTasks));
      } else {
        setCompletedTasks([]);
      }
    } catch (e) {
      console.error('Failed to load completed tasks:', e);
    }
  };

  const completeTask = (day: Day, taskId: string) => {
    setCompletedTasks(prev => {
      const key = `${day}-${taskId}`;
      const updatedTasks = prev.includes(key)
        ? prev.filter(id => id !== key)
        : [...prev, key];

      saveCompletedTasks(updatedTasks);
      return updatedTasks;
    });
  };

  const savePinnedCards = async (cards: any[]) => {
    try {
      await AsyncStorage.setItem('pinnedCards', JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save pinned cards:', e);
    }
  };

  const loadPinnedCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('pinnedCards');
      if (savedCards) {
        setPinnedCards(JSON.parse(savedCards));
      }
    } catch (e) {
      console.error('Failed to load pinned cards:', e);
    }
  };

  const saveCardsData = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('cardsData');

      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        setCard(parsedCards);
        return parsedCards;
      } else {
        await AsyncStorage.setItem('cardsData', JSON.stringify(cardsData));
        setCard(cardsData);
        return cardsData;
      }
    } catch (e) {
      console.error('Failed to save or load cards data:', e);
      return null;
    }
  };

  const loadCardsData = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('cardsData');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        setCard(parsedCards);
        return parsedCards;
      }
      return null;
    } catch (e) {
      console.error('Failed to load cards data:', e);
      return null;
    }
  };

  useEffect(() => {
    loadPinnedCards();
    loadCardsData();
    loadCompletedTasks();
    saveCardsData();
  }, [focused]);

  const togglePinCard = (day: Day, cardId: string) => {
    console.log(cardId);

    const cardToPin = cardsData[day]?.find(card => card.id === cardId);
    if (!cardToPin) return;

    setPinnedCards(prev => {
      const isPinned = prev.some(
        pinnedCard => pinnedCard.id === cardId && pinnedCard.day === day,
      );

      let updatedCards = [];
      if (isPinned) {
        updatedCards = prev.filter(
          pinnedCard => !(pinnedCard.id === cardId && pinnedCard.day === day),
        );
      } else {
        updatedCards = [...prev, {...cardToPin, day}];
      }
      savePinnedCards(updatedCards);
      return updatedCards;
    });
  };

  return (
    <View>
      <Header onPressCalendar={() => setModalVisible(true)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 20, marginVertical: 20, marginBottom: 100}}>
        {pinnedCards.length ? (
          <>
            <Text
              variant="titleMedium"
              style={{marginBottom: 10, color: theme.dark.onPrimaryContainer}}>
              Pinned
            </Text>
            <FlatList
              data={pinnedCards}
              style={{marginBottom: 40}}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setModalVisibleWith(true);
                    setCardId(item.id);
                  }}
                  style={{
                    backgroundColor: item.color,
                    width: 150,
                    marginRight: 20,
                    padding: 20,
                    borderRadius: 20,
                    opacity: completedTasks.includes(
                      `${selectedDay}-${item.id}`,
                    )
                      ? 0.5
                      : 1,
                  }}>
                  <Text style={{marginBottom: 10, color: 'black'}}>
                    {item.title}
                  </Text>
                  <Text style={{marginBottom: 20, color: 'black'}}>
                    {item.subtitle}
                  </Text>
                  <View
                    style={{
                      borderWidth: 1,
                      padding: 5,
                      alignItems: 'center',
                      borderRadius: 10,
                    }}>
                    <Text style={{color: 'black'}}>{item.date}</Text>
                  </View>
                </Pressable>
              )}
            />
          </>
        ) : null}
        <Text
          variant="titleMedium"
          style={{marginBottom: 10, color: theme.dark.onPrimaryContainer}}>
          Upcoming
        </Text>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {card[selectedDay]?.map((item: any) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setModalVisibleWith(true);
                setCardId(item.id);
              }}
              style={{
                backgroundColor: item.color,
                width: '47%',
                padding: 20,
                borderRadius: 20,
                marginBottom: 20,
                opacity: completedTasks.includes(`${selectedDay}-${item.id}`)
                  ? 0.5
                  : 1,
              }}>
              <Pressable
                onPress={() => togglePinCard(selectedDay, item.id)}
                style={{position: 'absolute', right: 10, top: 10}}>
                <Icon
                  color={
                    pinnedCards.some(
                      pinnedCard =>
                        pinnedCard.id === item.id &&
                        pinnedCard.day === selectedDay,
                    )
                      ? theme.dark.backdrop
                      : theme.dark.onPrimary
                  }
                  size={20}
                  source={'pin'}
                />
              </Pressable>

              <Text style={{marginBottom: 10, color: 'black'}}>
                {item.title}
              </Text>
              <Text style={{marginBottom: 20, color: 'black'}}>
                {item.subtitle}
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  padding: 5,
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'black'}}>{item.date}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <DayPlanningModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          cardsData={card}
          onDaySelect={(day: Day) => {
            setSelectedDay(day);
            setModalVisible(false);
          }}
        />
        <CardsWithModal
          completeTask={completeTask}
          visible={modalVisibleWith}
          onClose={() => setModalVisibleWith(false)}
          cardsData={card}
          id={cardId}
          selectedDay={selectedDay}
        />
      </ScrollView>
    </View>
  );
};
