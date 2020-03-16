import React from 'react';
import {Button, Icon, ListItem} from 'react-native-elements';
import {Text, TouchableOpacity, View} from 'react-native';
import {convertDate, convertMoney} from '../../util/StringUtils';
import {SwipeListView} from 'react-native-swipe-list-view';

const styles = {
  listItem: {
    backgroundColor: '#FFF',
    borderBottomColor: '#D8D8D8',
    borderBottomWidth: 0.4,
    height: 100,
    paddingLeft: 15,
    paddingRight: 15,
  },
  hiddenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    width: 80,
    height: 100,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#FFBF00',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#FFFFFF',
  },
};

function SortedByVisitedDate({hasMore, records, onPressMoreView, onPressModify, onPressDelete}) {
  return (
    <SwipeListView
      useFlatList
      data={hasMore ? records.concat([{moreBtn: true, key: 'moreBtn'}]) : records}
      renderItem={({item}) => {
        const {moreBtn, placeName, visitedDate, menus = [], money, score} = item;
      
        return moreBtn ?
          <Button
            title='더보기'
            type='clear'
            containerStyle={{backgroundColor: '#FFFFFF', height: 60, padding: 10}}
            titleStyle={{color: '#585858'}}
            onPress={onPressMoreView}
          />
          :
          <View style={styles.listItem}>
            <ListItem
              title={placeName}
              titleStyle={{fontWeight: 'bold'}}
              rightElement={
                <View>
                  <Icon name='star' type='antdesign' color='#FACC2E'/>
                  <Text><Text style={{fontWeight: 'bold', color: '#FACC2E', fontSize: 20}}>{score}</Text> / 5</Text>
                </View>
              }
              subtitle={
                <View>
                  <Text style={{fontWeight: 'bold'}}>{convertDate(visitedDate)}</Text>
                  <Text>{menus.join(',')}</Text>
                  <Text>{convertMoney(money)} 원</Text>
                </View>
              }
            />
          </View>;
      }}
      renderHiddenItem={({item: {key, moreBtn, ...rest}}) => !moreBtn && (
        <View style={styles.hiddenItem}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => onPressModify({key, ...rest})}
          >
            <Icon name='edit' type='material' color='#FFFFFF' style={{margin: 0, padding: 0}}/>
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.optionButton, backgroundColor: '#DF3A01'}}
            onPress={() => onPressDelete(key)}
          >
            <Icon name='delete' type='antdesign' color='#FFFFFF'/>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      )}
      leftOpenValue={80}
      rightOpenValue={-80}
    />
  );
}

export default SortedByVisitedDate;