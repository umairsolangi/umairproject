import { View, Modal, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';

const MessageModal = ({ errorModalVisibleVal, errorMessage }) => {
  const [visible, setVisible] = useState(errorModalVisibleVal);

  useEffect(() => {
    if (errorModalVisibleVal) {
      setVisible(true);
    }
  }, [errorModalVisibleVal]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          paddingHorizontal: 20,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 20,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              marginTop: 10,
              textAlign: 'center',
              color: 'black',
            }}>
            {errorMessage}
          </Text>

          <Button
            mode="contained"
            onPress={() => setVisible(false)}
            style={{ marginTop: 20, backgroundColor: '#F8544B' }}
          >
            OK
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;
