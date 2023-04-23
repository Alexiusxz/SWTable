import React, { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button/Button';
import Table from './components/Table/Table';
import ky from 'ky'
import { useDispatch } from 'react-redux';
import { clearStore, getPeople } from './slices/peopleSlice';
import { IData, IOneMan } from './Types/Types';
import Loader from './components/Loader/Loader';


function App(): JSX.Element {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);


  useEffect(()=> {
    const data = localStorage.getItem('swapi');
    if (data && data.length) dispatch(getPeople(JSON.parse(data)));
  },[])

  function getPeopleOnClick() {
    setLoader(true)
    ky.get('https://swapi.dev/api/people/')
      .json<IData>()
      .then((data) => {
        const newData: IOneMan[] = data.results.map(({ name, height, mass, hair_color, skin_color }) => ({ name, height, mass, hair_color, skin_color }));
        dispatch(getPeople(newData));
        localStorage.setItem('swapi', JSON.stringify(newData));
      })
      .catch(e => console.log(e))
      .finally(()=> setLoader(false))
  }
  function clearTable() {
    dispatch(clearStore());
    localStorage.removeItem('swapi');
  }

  return (
    <>
      <Button onClickFunc={getPeopleOnClick} title={'Получить данные'} />
      <Button onClickFunc={clearTable} title={'Очистить таблицу'} />
      {loader ? <Loader /> : <Table/>}
    </>
  );
}

export default App;
