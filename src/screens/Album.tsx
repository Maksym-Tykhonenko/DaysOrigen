import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  Title,
  IconButton,
  Modal,
  Portal,
  Text,
  Surface,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

export const AlbumScreen = () => {
  const [albums, setAlbums] = useState<string[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);
  const [newAlbumName, setNewAlbumName] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [images, setImages] = useState<{[key: string]: string[]}>({});
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isHelpModalVisible, setHelpModalVisible] = useState(false);

  const createAlbum = () => {
    if (newAlbumName.trim()) {
      // Prevent duplicate album names
      if (albums.includes(newAlbumName.trim())) {
        Alert.alert('Error', 'An album with this name already exists');
        return;
      }

      setAlbums([...albums, newAlbumName.trim()]);
      setImages({...images, [newAlbumName.trim()]: []});
      setNewAlbumName('');
      setModalVisible(false);
    }
  };

  const addImageToAlbum = (albumName: string, imageUrl: string) => {
    const albumImages = images[albumName] || [];
    setImages({
      ...images,
      [albumName]: [...albumImages, imageUrl],
    });
  };

  const pickImage = () => {
    const options: any = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0, // Allow multiple image selection
    };

    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorCode) {
        if (response?.assets) {
          response.assets.forEach(asset => {
            if (asset.uri) {
              addImageToAlbum(currentAlbum!, asset.uri);
            }
          });
        }
      }
    });
  };

  const removeImageFromAlbum = (imageToRemove: string) => {
    if (currentAlbum) {
      const updatedImages = images[currentAlbum].filter(
        image => image !== imageToRemove,
      );
      setImages({
        ...images,
        [currentAlbum]: updatedImages,
      });
    }
  };

  const shareAlbum = async () => {
    if (currentAlbum && images[currentAlbum]?.length) {
      try {
        await Share.share({
          title: `Album: ${currentAlbum}`,
          message: `The album "${currentAlbum}" contains ${images[currentAlbum].length} images`,
          url: images[currentAlbum][0],
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share the album');
      }
    }
  };

  const toggleImageSelection = (image: string) => {
    setSelectedImages(prev =>
      prev.includes(image) ? prev.filter(i => i !== image) : [...prev, image],
    );
  };

  const renderAlbums = () => (
    <FlatList
      data={albums}
      keyExtractor={item => item}
      numColumns={2}
      renderItem={({item}) => (
        <Surface style={styles.albumCard} elevation={2}>
          <TouchableOpacity onPress={() => setCurrentAlbum(item)}>
            <View style={styles.albumCardContent}>
              <Text style={styles.albumName}>{item}</Text>
              <Text style={styles.imageCount}>
                {images[item]?.length || 0} images
              </Text>
            </View>
          </TouchableOpacity>
        </Surface>
      )}
    />
  );

  const renderAlbumContent = () => (
    <FlatList
      data={images[currentAlbum!] || []}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      renderItem={({item}) => (
        <TouchableOpacity
          onLongPress={() => toggleImageSelection(item)}
          style={[
            styles.imageContainer,
            selectedImages.includes(item) && styles.selectedImage,
          ]}>
          <Image source={{uri: item}} style={styles.image} />
          <IconButton
            icon="close"
            size={20}
            style={styles.deleteIcon}
            onPress={() => removeImageFromAlbum(item)}
          />
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={styles.container}>
      {currentAlbum ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.albumDetailContainer}>
          <View style={styles.albumHeaderContainer}>
            <Button
              icon="arrow-left"
              onPress={() => {
                setCurrentAlbum(null);
                setSelectedImages([]);
              }}
              mode="contained-tonal"
              style={styles.backButton}>
              Back
            </Button>
            <Title style={styles.albumTitle}>{currentAlbum}</Title>
            <IconButton icon="share" size={24} onPress={shareAlbum} />
          </View>

          {renderAlbumContent()}

          <View style={styles.bottomButtonContainer}>
            <Button
              mode="contained"
              icon="plus"
              onPress={pickImage}
              style={styles.addImageButton}>
              Add Image
            </Button>
            {selectedImages.length > 0 && (
              <Button
                mode="outlined"
                icon="delete"
                onPress={() => {
                  selectedImages.forEach(removeImageFromAlbum);
                  setSelectedImages([]);
                }}>
                Delete Selected
              </Button>
            )}
          </View>
        </Animated.View>
      ) : (
        <>
          <Text
            variant="titleMedium"
            style={{textAlign: 'center', marginBottom: 20}}>
            Album
          </Text>
          <Button
            mode="contained"
            onPress={() => setHelpModalVisible(true)}
            style={[styles.createAlbumButton, {paddingVertical: 20}]}>
            Help Info
          </Button>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setModalVisible(true)}
            style={styles.createAlbumButton}>
            Create Album
          </Button>
          {renderAlbums()}
        </>
      )}

      <Modal
        visible={isHelpModalVisible}
        onDismiss={() => setHelpModalVisible(false)}>
        <View style={{backgroundColor: 'black', padding: 20}}>
          <Text style={styles.modalTitle}>Albums Guide</Text>
          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionHeader}>What are Albums?</Text>
            <Text style={styles.description}>
              Organize your images into custom collections for different moments
              and memories.
            </Text>
          </View>
          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionHeader}>How to Use</Text>
            <Text style={styles.instructionText}>
              • Tap "+" to create a new album • Name your album uniquely •
              Select an album to add images from your gallery • Easily manage
              and organize your photos
            </Text>
          </View>
          <View style={styles.descriptionBlock}>
            <Text style={styles.sectionHeader}>Pro Tips</Text>
            <Text style={styles.description}>
              Use descriptive names like "Vacation 2024" or "Family Pics" Add
              and remove images with just a few taps
            </Text>
          </View>
          <Button mode="contained" onPress={() => setHelpModalVisible(false)}>
            Got It
          </Button>
        </View>
      </Modal>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>New Album</Text>
          <TextInput
            label="Album Name"
            value={newAlbumName}
            onChangeText={setNewAlbumName}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            onPress={createAlbum}
            style={styles.modalButton}>
            Create
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionBlock: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
  instructionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  albumCard: {
    width: '45%',
    marginRight: 20,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
  },
  instructionItem: {
    marginBottom: 10,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  albumName: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  imageContainer: {
    margin: 8,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 150,
  },
  deleteIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  albumDetailContainer: {
    flex: 1,
  },
  albumHeaderContainer: {
    // marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  albumCardContent: {
    padding: 16,
    alignItems: 'center',
  },

  imageCount: {
    fontSize: 12,
    color: 'grey',
    marginTop: 4,
  },
  selectedImage: {
    opacity: 0.5,
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  textInput: {
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
  backButton: {
    // marginBottom: 16,
  },
  albumTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 12,
  },
  addImageButton: {
    marginTop: 16,
  },
  createAlbumButton: {
    marginBottom: 16,
  },
});
