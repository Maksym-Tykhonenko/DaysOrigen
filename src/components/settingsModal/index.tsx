import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Modal, Portal, Text, Button, Switch, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const SettingsModal = ({visible, onDismiss, onLogout}: any) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    onLogout();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <Text>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingItem}>
          <Text>Delete All Data</Text>
          <Button mode="contained" onPress={handleLogout} color="red">
            Delete
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={onDismiss}>
            Close
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
