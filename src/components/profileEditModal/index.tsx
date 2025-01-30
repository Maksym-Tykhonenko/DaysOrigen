import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Text,
  Button,
  Card,
  Divider,
  Provider as PaperProvider,
  DefaultTheme,
  Portal,
  Modal,
  TextInput,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {LineChart} from 'react-native-chart-kit';
import {Calendar} from 'react-native-calendars';

export const ProfileEditModal = ({
  visible,
  onDismiss,
  onSave,
  initialData,
}: any) => {
  const [name, setName] = useState(initialData.name);
  const [bio, setBio] = useState(initialData.bio);
  const [avatar, setAvatar] = useState(initialData.avatar);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.assets && response.assets[0]) {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    const profileData = {name, bio, avatar};
    await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
    onSave(profileData);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Edit Profile</Text>

        <View style={styles.avatarContainer}>
          <Avatar.Image size={100} source={{uri: avatar}} />
          <Button
            mode="outlined"
            onPress={pickImage}
            style={styles.avatarButton}>
            Change Photo
          </Button>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={onDismiss}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSave}>
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'black',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarButton: {
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
