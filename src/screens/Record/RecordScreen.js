import React, {createContext, useEffect, useReducer} from 'react';
import Geolocation from 'react-native-geolocation-service';
import RecordReducer, {MOVE_MAP, SLIDE_BOTTOM} from '../../reducers/RecordReducer';
import SearchPanel from './SearchPanel';
import Map from './Map';

export const RecordContext = createContext();
const {Provider} = RecordContext;

const initState = {
  region: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  slidePosition: SLIDE_BOTTOM,
  keyword: '',
  places: [],
  selectedIndex: -1,
};

function RecordScreen() {
  const [state, dispatch] = useReducer(RecordReducer, initState);
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => dispatch([MOVE_MAP, {latitude, longitude}]),
      error => console.log(error.code, error.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, [Geolocation]);
  
  return (
    <Provider value={{state, dispatch}}>
      <Map/>
      <SearchPanel/>
    </Provider>
  );
}

export default RecordScreen;
