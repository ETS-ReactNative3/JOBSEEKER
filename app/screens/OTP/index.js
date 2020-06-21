import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from '../../components/CustomText';
import * as otpActions from 'app/actions/otpActions';
import styles from './style';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Images from '../../config/images';
import * as loginActions from 'app/actions/loginActions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import { setI18nConfig } from '../../lib/languageSwitching';
import { TouchableOpacity } from 'react-native-gesture-handler';

// function verify(navigation) {
//   navigation.navigate('Boarding');
// }

export default function OtpScreen(props) {
  const lan = useSelector(state => state.languageReducer.language);
  const phone = useSelector(state => state.loginReducer.mobileNumber);
  const fcmToken = useSelector(state => state.loginReducer.deviceRegId);
  const dispatch = useDispatch();

  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  setI18nConfig(lan);

  function verify() {
    let data = {
      countryCode: '+65',
      mobileNumber: phone,
      deviceRegId: fcmToken,
      otp: otp,
      lattitude: position.latitude,
      longitude: position.longitude,
      user: 'js',
    };
    dispatch(otpActions.requestOtp(data));

    // props.navigation.navigate('Boarding');
  }

  function resendOtp() {
    let data = {
      countryCode: '+65',
      mobileNumber: phone,
      deviceRegId: fcmToken,
    };
    dispatch(loginActions.requestLogin(data, true));
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setError('');
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      e => setError(e.message),
    );
  }, []);

  leftPress = () => {
    props.navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationHeader isBack={true} leftPress={this.leftPress} />
      <ScrollView style={styles.container}>
        <View
          style={{
            height: Dimensions.get('screen').height / 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={Images.otp.otp_banner} />
        </View>
        <View style={{ marginVertical: 15 }}>
          <CustomText
            style={{
              fontFamily: 'Lato-Regular',
              fontWeight: 'bold',
              fontSize: 25,
              color: 'rgb(15,10,64)',
            }}
            text={'verify_your_otp'}
          />
          <View style={{ flexDirection: 'row' }}>
            <CustomText
              style={{
                fontSize: 12,
                color: 'rgb(160,160,160)',
                marginTop: 5,
              }}
              text={'enter_otp'}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: 'rgb(15,10,64)',
                marginTop: 4,
                marginLeft: 3,
              }}>{`+65 ${phone}`}</Text>
          </View>

          <OTPInputView
            style={{
              width: '100%',
              height: 100,
              color: 'rgb(38,38,38)',
              fontWeight: 'bold',
            }}
            pinCount={4}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            // onCodeChanged = {code => { this.setState({code})}}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              setOtp(code);
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <CustomText
              style={{
                fontSize: 12,
                color: 'rgb(160,160,160)',
                marginTop: 2,
              }}
              text={'recieve_otp'}
            />
            <TouchableOpacity onPress={resendOtp}>
              <CustomText
                style={{
                  fontFamily: 'Lato-Regular',
                  fontWeight: 'bold',
                  color: 'rgb(217,125,84)',
                  marginLeft: 4,
                }}
                text={'resend_text'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}>
          <CustomButton onPressed={() => verify()} buttonText={'verify_otp'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
