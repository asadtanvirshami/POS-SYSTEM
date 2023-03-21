import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import API from '../../../apis/index.json';

const EditEmail = ({Username, Email, setEditEmailModal, setEditEmail}) => {
  const [newEmail, setNewEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handelClick = async () => {
    const id = await AsyncStorage.getItem('@vendor_id');

    if (newEmail.includes('@gmail.com')) {
      setIsLoading(true);
      axios
        .post(API.UpdateVendorEmail, {id: id, email: newEmail, type: 'shopuser'})
        .then(r => {
          if (r.data.message == 'success') {
            async function saveEmail(){await AsyncStorage.setItem('@email',newEmail)}
            Alert.alert('Status', 'Email successfully updated!');
            saveEmail()
            setIsLoading(false);
          } else {
            Alert.alert('Error', 'Email not updatee!');
            setIsLoading(false);
          }
        });
    } else {
      Alert.alert('Error', 'Please enter a valid email.');
    }
  };

  return (
    <View>
      <Text style={{color: '#1A6DBB', fontSize: 18, textAlign: 'left'}}>
        Edit Email
      </Text>
      <View style={{marginTop: 10}}>
        <View style={{marginBottom: 10}}>
          <Text style={{color: 'black', fontSize: 16, textAlign: 'left'}}>
            {Username}
          </Text>
          <Text style={{color: 'gray', fontSize: 14, textAlign: 'left'}}>
            {Email}
          </Text>
        </View>
        <TextInput
          style={styles.input_field}
          placeholder="Enter new email"
          onChangeText={x => setNewEmail(x)}></TextInput>
      </View>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSave]}
          onPress={() => {
            handelClick();
          }}>
          {isLoading ? (
            <Text style={{alignSelf: 'center'}}>
              <ActivityIndicator size={'small'} color={'white'} />
            </Text>
          ) : (
            <Text style={{textAlign: 'center', color: 'white'}}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSave]}
          onPress={() => {
            setEditEmail(false), setEditEmailModal(false);
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditEmail;

const styles = StyleSheet.create({
  buttonSave: {
    color: 'white',
    backgroundColor: '#1A6DBB',
    borderRadius: 12,
    padding: 10,
    margin: 3,
    width: 110,
    alignSelf: 'center',
    marginTop: 15,
  },
  input_field: {
    borderWidth: 1,
    borderColor: 'silver',
    padding: 6,
    width: 300,
    borderRadius: 12,
  },
});
