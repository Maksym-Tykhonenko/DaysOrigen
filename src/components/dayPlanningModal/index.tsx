import React, {useState} from 'react';
import {View, Modal, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from 'react-native-paper';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';

export const DayPlanningModal = ({
  visible,
  onClose,
  cardsData,
  onDaySelect,
}: any) => {
  const {theme} = useMaterial3Theme();
  const [selectedDay, setSelectedDay] = useState('Friday');

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleDaySelect = (day: any) => {
    setSelectedDay(day);
    onDaySelect(day);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: theme.dark.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '90%',
          }}>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
              {days
                ? days.map(day => (
                    <TouchableOpacity
                      key={day}
                      onPress={() => handleDaySelect(day)}
                      style={{
                        backgroundColor:
                          selectedDay === day
                            ? theme.dark.primary
                            : theme.dark.surfaceVariant,
                        padding: 10,
                        margin: 5,
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          color:
                            selectedDay === day
                              ? theme.dark.onPrimary
                              : theme.dark.onSurfaceVariant,
                        }}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))
                : null}
            </View>

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {cardsData[selectedDay]?.map((item: any) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: item.color,
                    width: '47%',
                    padding: 20,
                    borderRadius: 20,
                    marginBottom: 20,
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
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: theme.dark.error,
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={{color: theme.dark.onError}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
