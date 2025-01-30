import React, {useState} from 'react';
import {Modal, Portal, Button, Card, Text, Divider} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SingleCardModal({
  cardsData,
  selectedDay,
  visible,
  id,
  onClose,
  completeTask,
}: any) {
  const [isCompleted, setIsCompleted] = useState(id);

  const selectedItem = cardsData[selectedDay]?.find(
    (item: any) => item.id === id,
  );

  const handleCompleteTask = () => {
    setIsCompleted(id);
    completeTask(id);
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalContainer}>
        {selectedItem && (
          <Card>
            <Card.Content>
              <Text style={styles.titleText}>{selectedItem.title}</Text>
              <Text style={styles.subtitleText}>{selectedItem.subtitle}</Text>
              <Divider style={styles.divider} />
              <Text style={styles.dateText}>{selectedItem.date}</Text>
              <Text style={styles.descriptionText}>
                {selectedItem.description ||
                  'Description of what needs to be done'}
              </Text>
            </Card.Content>
            <Card.Actions style={styles.actionContainer}>
              <Button
                mode="outlined"
                onPress={onClose}
                style={styles.closeButton}>
                Close
              </Button>
              <Button
                mode="contained"
                onPress={handleCompleteTask}
                disabled={isCompleted === id}
                style={styles.completeButton}>
                {isCompleted === id ? 'Completed' : 'Complete Task'}
              </Button>
            </Card.Actions>
          </Card>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  titleText: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  subtitleText: {
    marginBottom: 10,
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
  },
  dateText: {
    marginBottom: 10,
    fontSize: 14,
  },
  descriptionText: {
    marginBottom: 20,
    fontSize: 16,
  },
  actionContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  closeButton: {
    flex: 1,
    marginRight: 10,
  },
  completeButton: {
    flex: 1,
  },
});
