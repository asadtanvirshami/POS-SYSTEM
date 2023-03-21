import axios from 'axios';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Modal,
  Image
} from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BuildIcon from 'react-native-vector-icons/FontAwesome';
import PrivacyIcon from 'react-native-vector-icons/Ionicons';

import API from '../../../apis/index.json';
import EditEmail from './EditEmail';
import EditImage from './EditImage';
import EditStoreMap from './EditStore';

const ProfileCom = ({ navigation }) => {

  const [Username, setUserName] = useState('');
  const [Email, setEmail] = useState('');

  const [editEmailModal, setEditEmailModal] = useState(false);
  const [edtImageModal, setEditImageModal] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editStore, setEditStore] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const [storeDetails, setStoreDetails] = useState([]);

  useEffect(() => {
    GetShopUserDetail();
  }, []);

  async function GetShopUserDetail() {
    const id = await AsyncStorage.getItem('@vendor_id');
    let vendor_name = await AsyncStorage.getItem('@username');
    let vendor_email = await AsyncStorage.getItem('@email');

    setEmail(vendor_email);
    setUserName(vendor_name);

    axios.get(API.GetVendorShopDetails, { headers: { id: id } }).then(r => {
      setStoreDetails(r.data.payload);
    });
  }

  const toggleSwitch = async () => {
    const id = await AsyncStorage.getItem('@vendor_id');
    if (isEnabled == true) {
      setIsEnabled(previousState => !previousState);
      await axios.post(API.VendorShopSwitch,{type:'enable',id:id})
      .then((r)=>{
       Alert.alert('Status', ' Shop Enabled successfully!');
      })
    } else if (isEnabled != true) {
      setIsEnabled(previousState => !previousState);
      console.log('h2');
       await axios.post(API.VendorShopSwitch,{type:'disable',id:id})
       .then((r)=>{
        Alert.alert('Status', ' Shop Disabled successfully!');
       })
    }
  };

  return (
    <>
      {(editEmail || editImage) && (
        <View style={{
          position: 'absolute',
          opacity: 0.6,
          zIndex: 1,
          backgroundColor: 'grey',
          height: '200%',
          width: '100%',
        }}></View>
      )}
      {!editStore && <View style={styles.row}>
        <View style={styles.col}>
          <View style={styles.box_sm}>
            <View style={styles.grid_view}>
              <View style={{ padding: 20, flex: 6 }}>
                <Text style={styles.textHeading}>Settings</Text>
                <Text style={{ fontSize: 25, color: 'black' }}>{Username}</Text>
                <Text style={{ fontSize: 15 }}>{Email}</Text>
              </View>
              <View style={styles.image_view}>
                <Image source={require('../../../assets/images/iconpngs/adminpic.png')} style={{ height: 100, width: 100 }} />
              </View>
            </View>
          </View>
          <View style={styles.box_setting}>
            <View style={{ padding: 15 }}>
              <Text style={styles.textHeading}>General</Text>
              <TouchableOpacity onPress={() => setEditStore(true)}>
                <View style={{ flexDirection: 'row' }}>
                  <SimpleLineIcons name="organization" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>Edit Store</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.divider_line}></Text>
              <TouchableOpacity onPress={() => (setEditEmailModal(true), setEditEmail(true))}>
                <View style={{ flexDirection: 'row' }}>
                  <SimpleLineIcons name="envelope" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>Edit Email</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.divider_line}></Text>
              <TouchableOpacity onPress={() => (setEditImageModal(true), setEditImage(true))}>
                <View style={{ flexDirection: 'row' }}>
                  <SimpleLineIcons name="picture" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>Edit Store Image</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.divider_line}></Text>
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <SimpleLineIcons name="minus" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>Disable Store</Text>
                  <Switch
                  style={{left:100  }}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.box_general}>
            <View style={{ padding: 15 }}>
              <Text style={styles.textHeading}>Terms and Licencing</Text>
              <TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <BuildIcon name="building-o" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>About Company</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.divider_line} ></Text>
              <TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                  <PrivacyIcon name="newspaper-outline" style={styles.fontIcon} />
                  <Text style={styles.textIcons}>Privacy Policy</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>}
      {editImage && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={edtImageModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <EditImage
                setEditImage={setEditImage}
                setEditImageModal={setEditImageModal}
              />
            </View>
          </View>
        </Modal>
      )}
      {editEmail && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={editEmailModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <EditEmail
                setEditEmailModal={setEditEmailModal}
                setEditEmail={setEditEmail}
                Username={Username}
                Email={Email}
              />
            </View>
          </View>
        </Modal>
      )}
      {editStore && <EditStoreMap storeDetails={storeDetails} setEditStore={setEditStore} />}
    </>
  );
};
export default ProfileCom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
  },
  grid_view: {
    flexDirection: 'row',
  },
  row: {
    flex: 4,
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  image_view: {
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 3
  },
  input_field: {
    borderWidth: 1,
    borderColor: "silver",
    padding: 6,
    width: 300,
    borderRadius: 12,
  },
  textHeading: {
    fontSize: 23,
    marginBottom: 5,
    marginLeft: 6,
    color: '#1A6DBB',
    fontWeight: '600',
  },
  textIcons: {
    fontSize: 20,
    padding: 15
  },
  divider_line: {
    height: 1,
    backgroundColor: 'silver'
  },
  fontIcon: {
    fontSize: 22,
    padding: 15,
    color: '#1A6DBB'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    padding: 10
  },
  modalView: {
    backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  box_sm: {
    flex: 4,
    backgroundColor: 'white',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  box_setting: {
    flex: 8.5, marginBottom: 5, marginTop: 5, backgroundColor: 'white', borderRadius: 20, shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  box_general: {
    flex: 5, marginBottom: 5, backgroundColor: 'white', borderRadius: 20, shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
