/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import ky from 'ky'
import { useDispatch, useSelector } from 'react-redux';
import { clearStore, getPeople } from '../../slices/peopleSlice';
import { IData, IOneMan } from '../../Types/Types';
import Loader from '../../components/Loader/Loader';
import { RootState } from '../../store/store';
import { setLinks } from '../../slices/pagesSlice';
import { Link } from 'react-router-dom';
import styles from './Main.module.css';


function Main(): JSX.Element {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false);
  const people = useSelector((state: RootState) => state.people.people)
  const links = useSelector((state: RootState) => state.pages)

  useEffect(() => {
    const data = localStorage.getItem('swapi');
    if (data && data.length) dispatch(getPeople(JSON.parse(data)));
    const pages = localStorage.getItem('pages')
    if (pages) dispatch(setLinks(JSON.parse(pages)))
  }, [])

  function getPeopleOnClick(link: string | null = 'https://swapi.dev/api/people/') {
    setLoader(true)
    ky.get(link ? link : 'https://swapi.dev/api/people/')
      .json<IData>()
      .then((data) => {
        const newData: IOneMan[] = data.results.map(({ name, height, mass, hair_color, skin_color }) => ({ name, height: isNaN(+height) ? height : +height, mass: isNaN(+mass) ? mass : +mass, hair_color, skin_color }));
        dispatch(getPeople(newData));
        dispatch(setLinks({ next: data.next, previous: data.previous }));
        localStorage.setItem('swapi', JSON.stringify(newData));
        localStorage.setItem('pages', JSON.stringify({ next: data.next, previous: data.previous }));

      })
      .catch(e => console.log(e))
      .finally(() => setLoader(false))
  }
  function clearTable() {
    dispatch(clearStore());
    localStorage.removeItem('swapi');
    localStorage.removeItem('rowHeights');
    localStorage.removeItem('colWidths');
    localStorage.removeItem('pages');
  }

  return (
    <>
      <Button onClickFunc={() => getPeopleOnClick()} title={'Get data'} />
      <Button onClickFunc={clearTable} title={'Clear table'} />
      <Button onClickFunc={() => getPeopleOnClick(links.previous)} title={'back'} link={links.previous} />
      <Button onClickFunc={() => getPeopleOnClick(links.next)} title={'next'} link={links.next} />
      <Link to='/form' className={styles.link}>Link to form</Link>
      {loader ? <Loader /> : <Table people={people} />}
    </>
  );
}

export default Main;
