/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useEffect } from 'react';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';
import { useSelector } from 'react-redux';
import {  getPeople } from '../../slices/peopleSlice';
import Loader from '../../components/Loader/Loader';
import { RootState,useAppDispatch } from '../../store/store';
import { setLinks } from '../../slices/pagesSlice';
import { Link } from 'react-router-dom';
import styles from './Main.module.css';
import { getPeopleOnClick, clearTable } from '../../slices/peopleThunk';

function Main(): JSX.Element {
  const dispatch = useAppDispatch()
  const people = useSelector((state: RootState) => state.people.people)
  const links = useSelector((state: RootState) => state.pages)
  const loader = useSelector((state: RootState) => state.people.loading) 

  useEffect(() => {
    const data = localStorage.getItem('swapi');
    if (data && data.length) dispatch(getPeople(JSON.parse(data)));
    const pages = localStorage.getItem('pages')
    if (pages) dispatch(setLinks(JSON.parse(pages)))
  }, [])


  return (
    <>
      <Button onClickFunc={() => dispatch(getPeopleOnClick())} title={'Get data'}  disable = {people.length ? false : true}/>
      <Button onClickFunc={() => dispatch(clearTable())} title={'Clear table'} disable = {!people.length ? false : true}/>
      <Button onClickFunc={() => dispatch(getPeopleOnClick(links.previous))} title={'back'} disable={links.previous} />
      <Button onClickFunc={() => dispatch(getPeopleOnClick(links.next))} title={'next'} disable={links.next} />
      <Link to='/form' className={styles.link}>Link to form</Link>
      {loader ? <Loader /> : <Table people={people} />}
    </>
  );
}

export default Main;
