import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Text,
  Button,
  Card,
  Divider,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {Calendar} from 'react-native-calendars';
import {Header} from '../components/header';
import {ProfileEditModal} from '../components/profileEditModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingsModal} from '../components/settingsModal';
import {useIsFocused} from '@react-navigation/native';

export const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'none',
    bio: 'none',
    avatar: 'none',
  });
  const [stats, setStats] = useState({
    tasks: 0,
    hours: 0,
    productivity: 0,
  });
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [dailyActivities] = useState([
    {time: '08:00', activity: 'Morning Meditation', duration: '30 mins'},
    {time: '09:30', activity: 'Working on Project', duration: '2 hours'},
    {time: '14:00', activity: 'Physical Exercises', duration: '45 mins'},
    {time: '19:00', activity: 'Language Learning', duration: '1 hour'},
  ]);

  const productivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [5, 6, 4, 7, 5, 3, 6],
        color: () => '#4A90E2',
        strokeWidth: 2,
      },
    ],
  };
  const focused = useIsFocused();

  const loadCompletedTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('completedTasks');

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        const taskCount = parsedTasks.length;

        console.log(parsedTasks);

        const estimatedHours = (taskCount * 30) / 60;

        const productivity = Math.min(taskCount * 10, 100);

        setStats({
          tasks: taskCount,
          hours: Number(estimatedHours.toFixed(1)),
          productivity: Math.round(productivity),
        });
      }
    } catch (e) {
      console.error('Failed to load completed tasks:', e);
    }
  };

  React.useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        if (storedProfile) {
          setProfileData(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error loading profile', error);
      }
    };

    loadProfileData();
    loadCompletedTasks();
  }, [focused]);

  const handleProfileSave = (newProfileData: any) => {
    setProfileData(newProfileData);
  };
  
  const handleLogout = () => {
    setProfileData({
      name: 'none',
      bio: 'none',
      avatar: 'none',
    });
    setStats({tasks: 0, hours: 0, productivity: 0});
  };

  return (
    <View style={{flex: 1, marginTop: 40}}>
      {/* <Header none /> */}
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={100}
            source={{uri: profileData.avatar}}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>{profileData.name}</Text>
          <Text style={styles.bioText}>{profileData.bio}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Card>
            <Card.Content style={styles.statCard}>
              <View style={styles.statItem}>
                <Text variant="titleLarge">{stats.tasks}</Text>
                <Text variant="bodySmall">Tasks</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text variant="titleLarge">{stats.hours}</Text>
                <Text variant="bodySmall">Hours</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text variant="titleLarge">{stats.productivity}%</Text>
                <Text variant="bodySmall">Productivity</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={() => setEditModalVisible(true)}
            style={styles.actionButton}>
            Edit Profile
          </Button>
          <Button
            mode="outlined"
            onPress={() => setSettingsModalVisible(true)}
            style={styles.actionButton}>
            Settings
          </Button>
        </View>

        <Card style={styles.sectionCard}>
          <Card.Title title="Weekly Productivity" />
          <Card.Content>
            <LineChart
              data={productivityData}
              width={320}
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                color: () => '#4A90E2',
                labelColor: () => '#000',
              }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Activity Calendar" />
          <Card.Content>
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: {selected: true, disableTouchEvent: true},
              }}
            />
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title title="Daily Activity" />
          <Card.Content>
            {dailyActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Text variant="titleSmall">{activity.time}</Text>
                <View style={styles.activityDetails}>
                  <Text variant="bodyLarge">{activity.activity}</Text>
                  <Text variant="bodySmall">{activity.duration}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        <ProfileEditModal
          visible={isEditModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          onSave={handleProfileSave}
          initialData={profileData}
        />
        <SettingsModal
          visible={isSettingsModalVisible}
          onDismiss={() => setSettingsModalVisible(false)}
          onLogout={handleLogout}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bioText: {
    color: '#666',
  },
  statsContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    width: '33%',
    alignItems: 'center',
  },
  verticalDivider: {
    height: 30,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  actionButton: {
    width: '40%',
  },
  sectionCard: {
    margin: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  activityDetails: {
    marginLeft: 15,
    flex: 1,
  },
});
