import React, { useState } from "react";
import { IPeople } from '../../Types/Types';
import { v4 as uuidv4 } from 'uuid';
import styles from './Table.module.css';
import { useDispatch } from "react-redux";
import { createPortal } from 'react-dom';
import { delRow } from "../../slices/peopleSlice";
import Modal from "../Modal/Modal";


const Table: React.FC<IPeople> = ({ people }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null);

  function deleteRow(index: number) {
    setIndexToDelete(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function confirmDel() {
    indexToDelete !== null && 
    await dispatch(delRow(indexToDelete))
    setIsModalOpen(false);
    setIndexToDelete(null);
    const data = JSON.stringify(people)
    localStorage.setItem('swapi', data)
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
