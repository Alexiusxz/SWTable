import React, {  useLayoutEffect, useState } from "react";

import { v4 as uuidv4 } from 'uuid';
import styles from './Table.module.css';
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from 'react-dom';
import { delRow } from "../../slices/peopleSlice";
import Modal from "../Modal/Modal";
import { RootState } from "../../store/store";



const Table: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null);
  const people = useSelector((state: RootState) => state.people.people)

  useLayoutEffect(()=> {
    const data = JSON.stringify(people)
    if (people && people.length) {localStorage.setItem('swapi', data)}
  },[people])

  function deleteRow(index: number) {
    setIndexToDelete(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function confirmDel() {
    indexToDelete !== null &&
    dispatch(delRow(indexToDelete))
    setIsModalOpen(false);
    setIndexToDelete(null);
  }
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Mass</th>
            <th>Hair Color</th>
            <th>Skin Color</th>
            <th className={styles.del}></th>
          </tr>
        </thead>
        <tbody>
          {people.length ? (
            people.map((item, index) => (
              <tr key={uuidv4()}>
                <td>{item.name}</td>
                <td>{item.height}</td>
                <td>{item.mass}</td>
                <td>{item.hair_color}</td>
                <td>{item.skin_color}</td>
                <td><button onClick={() => deleteRow(index)}>x</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.plug} colSpan={5}>Нет данных для отображения</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && createPortal(
        <Modal isOpen={isModalOpen} onClose={closeModal} onDelete={confirmDel} />,
        document.getElementById('modal-root') || document.createElement('div')
      )}
    </>
  );
};

export default Table;
