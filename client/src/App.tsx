import React, { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button/Button';
import Table from './components/Table/Table';
import ky from 'ky'
import { useDispatch, useSelector } from 'react-redux';
import { clearStore, getPeople } from './slices/peopleSlice';
import { IData, IOneMan } from './Types/Types';
import Loader from './components/Loader/Loader';
import { RootState } from './store/store';


function App(): JSX.Element {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const people = useSelector((state: RootState) => state.people.people)

  useEffect(() => {
    const data = localStorage.getItem('swapi');
    if (data && data.length) dispatch(getPeople(JSON.parse(data)));
  }, [])

  function getPeopleOnClick() {
    setLoader(true)
    ky.get('https://swapi.dev/api/people/')
      .json<IData>()
      .then((data) => {
        const newData: IOneMan[] = data.results.map(({ name, height, mass, hair_color, skin_color }) => ({ name, height: +height, mass: +mass, hair_color, skin_color }));
        dispatch(getPeople(newData));
        localStorage.setItem('swapi', JSON.stringify(newData));
      })
      .catch(e => console.log(e))
      .finally(() => setLoader(false))
  }
  function clearTable() {
    dispatch(clearStore());
    localStorage.removeItem('swapi');
    localStorage.removeItem('rowHeights');
    localStorage.removeItem('colWidths');
  }

  return (
    <>
      <Button onClickFunc={getPeopleOnClick} title={'Получить данные'} />
      <Button onClickFunc={clearTable} title={'Очистить таблицу'} />
      {loader ? <Loader /> : <Table people={people} />}
    </>
  );
}

export default App;
