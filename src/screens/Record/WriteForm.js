import React, {useRef, useState} from 'react';
import {
  InputAccessoryView,
  Keyboard,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, ButtonGroup, Icon, Input} from 'react-native-elements';
import {format} from 'date-fns';
import {convertMoney} from '../../util/StringUtils';
import {allCategories} from '../../util/Category';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BottomSelect from '../components/BottomSelect';
import CategoryOption from './CategoryOption';
import StarRating from 'react-native-star-rating';
import KakaoMapSearch from './KakaoMapSearch';

const getColor = cond => cond ? '#d23669' : '#E6E6E6';

function WriteForm({setGoUserPosition}) {
  const [focusInput, setFocusInput] = useState('');
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formData, setFormData] = useState({
    isDutch: false,
    money: 0,
    category: '식비',
    placeName: '',
    visitedDate: new Date(),
    score: 0,
  });
  
  const categorySelector = useRef();
  const scoreSelector = useRef();
  
  const setCategory = category => {
    setFormData({...formData, category});
    categorySelector.current.close();
  };
  
  const inputAccessoryView = 'placeNameView';
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>지출 기록하기</Text>
      </View>
      
      <View style={styles.body}>
        <View>
          <ButtonGroup
            containerStyle={styles.dutchContainer}
            buttonStyle={{borderRadius: 15}}
            selectedButtonStyle={{backgroundColor: '#FFF'}}
            selectedTextStyle={{color: '#000'}}
            innerBorderStyle={{width: 0}}
            textStyle={{color: '#585858'}}
            buttons={['개인지출', '데이트']}
            selectedIndex={formData.isDutch ? 1 : 0}
            onPress={index => setFormData({...formData, isDutch: !!index})}
          />
          
          <View style={styles.inputBox}>
            <Input
              inputStyle={styles.inputFont}
              inputContainerStyle={{borderBottomColor: getColor(focusInput === 'money')}}
              onFocus={() => setFocusInput('money')} onBlur={() => setFocusInput('')}
              keyboardType='number-pad' returnKeyType='done'
              value={`${convertMoney(formData.money)} 원`}
              onChangeText={money => setFormData({...formData, money})}
            />
          </View>
          
          <View style={styles.inputBox}>
            <Input
              inputStyle={styles.inputFont}
              inputContainerStyle={{borderBottomColor: getColor(focusInput === 'placeName')}}
              onFocus={() => setFocusInput('placeName')} onBlur={() => setFocusInput('')}
              placeholder={`${formData.isDutch ? '데이트 장소' : '지출처'}를 입력하세요`}
              inputAccessoryViewID={inputAccessoryView}
              value={formData.placeName}
              onChangeText={placeName => setFormData({...formData, placeName})}
            />
            <InputAccessoryView nativeID={inputAccessoryView} backgroundColor='#FFF'>
              <Button
                title='카카오맵 검색' buttonStyle={{backgroundColor: '#d23669'}}
                disabled={!formData.placeName}
                onPress={() => {
                  Keyboard.dismiss();
                  setIsMapOpen(true);
                }}
              />
            </InputAccessoryView>
          </View>
          
          <View style={styles.inputBox}>
            <Input
              inputStyle={styles.inputFont}
              inputContainerStyle={{borderBottomColor: getColor(focusInput === 'menu')}}
              onFocus={() => setFocusInput('menu')} onBlur={() => setFocusInput('')}
              placeholder="상세내역을 입력하세요"
            />
          </View>
          
          <View style={styles.selectBox}>
            <TouchableOpacity style={styles.selectButton} onPress={() => categorySelector.current.open()}>
              <Text style={styles.buttonLabel}>카테고리</Text>
              <View style={styles.selectedOption}>
                <Text style={styles.selectedValue}>{formData.category}</Text>
                <Icon type='ionicon' name='ios-arrow-forward' size={20}/>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.selectBox}>
            <TouchableOpacity style={styles.selectButton} onPress={() => setIsDateOpen(true)}>
              <Text style={styles.buttonLabel}>날짜</Text>
              <View style={styles.selectedOption}>
                <Text style={styles.selectedValue}>{format(formData.visitedDate, 'M월 d일 h:mm')}</Text>
                <Icon type='ionicon' name='ios-arrow-forward' size={20}/>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.selectBox}>
            <TouchableOpacity style={styles.selectButton} onPress={() => scoreSelector.current.open()}>
              <Text style={styles.buttonLabel}>평점</Text>
              <View style={styles.selectedOption}>
                <Text style={styles.selectedValue}>{formData.score ? `${formData.score}점` : '미평가'}</Text>
                <Icon type='ionicon' name='ios-arrow-forward' size={20}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.confirmButtonBox}>
          <Button
            title='기록하기' containerStyle={{width: '100%'}}
            buttonStyle={styles.confirmButton}
            titleStyle={styles.confirmButtonTitle}
          />
        </View>
      </View>
      
      <DateTimePickerModal
        isVisible={isDateOpen} mode='datetime'
        onConfirm={visitedDate => {
          setFormData({...formData, visitedDate});
          setIsDateOpen(false);
        }}
        onCancel={() => setIsDateOpen(false)}
        headerTextIOS='날짜를 선택하세요' cancelTextIOS='취소' confirmTextIOS='완료'
        minimumDate={new Date(2010, 0, 1)} locale='ko_KO'
        date={formData.visitedDate}
      />
      
      <BottomSelect slide={categorySelector} title='카테고리 선택하기'>
        {
          allCategories.map((data, index) => (
            <CategoryOption key={index} category={formData.category} setCategory={setCategory} {...data}/>
          ))
        }
      </BottomSelect>
      
      <BottomSelect slide={scoreSelector} title='평점 선택하기' height={250}>
        <View style={styles.scoreSelector}>
          <StarRating
            emptyStarColor='#FACC2E' fullStarColor='#FACC2E'
            maxStars={5} rating={formData.score}
            selectedStar={nextScore => {
              setFormData({...formData, score: nextScore === formData.score ? 0 : nextScore});
              scoreSelector.current.close();
            }}
          />
        </View>
      </BottomSelect>
      
      <Modal animationType="slide" visible={isMapOpen}>
        <KakaoMapSearch setIsMapOpen={setIsMapOpen} placeName={formData.placeName}/>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#FFFFFF', height: '100%', paddingBottom: 80},
  header: {alignItems: 'center', marginVertical: 20},
  title: {fontSize: 18, fontWeight: 'bold'},
  body: {flex: 1, justifyContent: 'space-between', paddingBottom: 20, paddingHorizontal: 20},
  dutchContainer: {
    backgroundColor: '#F2F2F2', borderWidth: 0, borderRadius: 20, height: 45, padding: 5, marginBottom: 15,
  },
  spendKind: {paddingHorizontal: 20},
  inputBox: {marginVertical: 5},
  inputFont: {fontSize: 20, fontWeight: 'bold'},
  selectBox: {marginVertical: 10, paddingHorizontal: 10, justifyContent: 'center'},
  selectButton: {flexDirection: 'row', justifyContent: 'space-between'},
  buttonLabel: {fontSize: 18},
  selectedOption: {flexDirection: 'row'},
  selectedValue: {fontSize: 18, color: '#d23669', marginRight: 20},
  confirmButtonBox: {alignItems: 'center', paddingHorizontal: 10},
  confirmButton: {height: 50, borderRadius: 10, backgroundColor: '#d23669'},
  confirmButtonTitle: {fontSize: 18, fontWeight: 'bold'},
  scoreSelector: {marginTop: 20, alignItems: 'center'},
  
});

export default WriteForm;
