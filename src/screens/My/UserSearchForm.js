import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {Button, Icon, ListItem, SearchBar, Text} from 'react-native-elements';
import {Dimensions, SafeAreaView, ScrollView, View} from 'react-native';

const GET_USERS = gql`
  query ($keyword: String, $userId: String!, $alarm: Boolean, $type: String!, $completed: Boolean) {
    unMatchedUsers(userId: $userId, keyword: $keyword, type: $type) {
      userId
      nickname
      coupleId
      friends
    }

    requestedAlarms(applicantId: $userId, alarm: $alarm, completed: $completed) {
      _id
      targetId
      targetName
      type
      result
      completed
    }
  }
`;

export const getTypeKorName = type => type === 'couple' ? '커플' : '친구';

function UserSearchForm({userId, setTargetInfo, searchType, setIsVisibleModal}) {
  const typeKorName = getTypeKorName(searchType);
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const {loading, error, data} = useQuery(GET_USERS, {
    variables: {
      keyword, userId, alarm: false, type: searchType, completed: false
    }
  });
  
  const {height} = Dimensions.get('window');
  
  return (
    <SafeAreaView>
      <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
        <View style={{alignItems: 'flex-end', marginHorizontal: 10}}>
          <Icon
            type='antdesign'
            name='close'
            size={25}
            onPress={() => setIsVisibleModal(false)}
          />
        </View>
        <View style={{flexDirection: 'row', marginHorizontal: 10, alignItems: 'center'}}>
          <Icon type='feather' name='user-plus' size={25}/>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginLeft: 5}}>
            {searchType === 'couple' ? '커플' : '친구들'} 찾기
          </Text>
        </View>
        <SearchBar
          platform='ios'
          containerStyle={{backgroundColor: '#FFF'}}
          inputContainerStyle={{backgroundColor: '#E6E6E6'}}
          placeholder='검색'
          value={text}
          onChangeText={text => setText(text)}
          onSubmitEditing={() => setKeyword(text)}
          onClear={() => {
            setText('');
            setKeyword('');
          }}
          cancelButtonTitle='취소'
          cancelButtonProps={{buttonStyle: {marginLeft: 10, height: 35}}}
        />
        <ScrollView style={{marginHorizontal: 10, height: height - 230}}>
          {
            loading ?
              <Text> 유저 검색 중 ...</Text>
              :
              error ?
                <Text> 유저 찾다가 에러 발생!! {error.toString()}</Text>
                :
                data.unMatchedUsers.map(({userId, nickname}) => {
                  const requestedInfo = data.requestedAlarms.find(matching => matching.targetId === userId);
                  if (requestedInfo && requestedInfo.type !== searchType) {
                    return null;
                  }
                  
                  return (
                    <ListItem
                      key={userId}
                      title={nickname}
                      containerStyle={{paddingVertical: 10, paddingHorizontal: 5}}
                      rightElement={
                        requestedInfo ?
                          <Text style={{height: 25, lineHeight: 25}}>요청 수락 대기중</Text>
                          :
                          <Button
                            title={`${typeKorName} 요청`}
                            titleStyle={{fontSize: 14, fontWeight: 'bold'}}
                            buttonStyle={{
                              height: 25,
                              paddingVertical: 0,
                              backgroundColor: typeKorName === '커플' ? '#F5A9D0' : '#58ACFA',
                            }}
                            onPress={() => setTargetInfo(userId, nickname)}
                          />
                      }
                    />
                  );
                })
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default UserSearchForm;
