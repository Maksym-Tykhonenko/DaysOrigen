import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import React from 'react';
import {View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';

export const Header = ({onPressCalendar, none}: any) => {
  const {theme} = useMaterial3Theme();
  return (
    <Appbar.Header>
      {/* <Appbar.BackAction onPress={() => {}} /> */}
      <View style={{marginRight: 'auto', marginLeft: 20}}>
        <Text
          variant="bodyLarge"
          style={{fontWeight: '600', color: theme.dark.primary}}>
          Days
        </Text>
      </View>
      {!none ? (
        <>
          <Appbar.Action
            color={theme.dark.onPrimaryContainer}
            icon="calendar"
            onPress={onPressCalendar}
          />
        </>
      ) : null}
    </Appbar.Header>
  );
};
