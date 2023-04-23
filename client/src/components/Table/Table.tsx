import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from './Table.module.css';
import { useDispatch } from "react-redux";
import { createPortal } from 'react-dom';
import { delRow, sortTable } from "../../slices/peopleSlice";
import Modal from "../Modal/Modal";
import { IOneMan, IPeople } from "../../Types/Types";


const Table: React.FC<IPeople> = ({ people }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);  //стейт для модального окна
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null); // стейт для выбранной строки для удаления
  const [sortBy, setSortBy] = useState<string | null>(null);//стейт для сортировки по столбцу по алфавиту
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null); //стейт для направления сортировки



  useEffect(() => {
    const data = JSON.stringify(people)
    if (people && people.length) localStorage.setItem('swapi', data) 
  }, [people])

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

  function compareValues(a: IOneMan, b: IOneMan) {
    if (a[sortBy as keyof IOneMan] < b[sortBy as keyof IOneMan]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy as keyof IOneMan] > b[sortBy as keyof IOneMan]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  }

  function sortByField(field: keyof IOneMan) {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setSortBy(field);
    const sort = [...people].sort(compareValues)
    dispatch(sortTable(sort));
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => sortByField('name')}>Name</th>
            <th onClick={() => sortByField('height')}>Height</th>
            <th onClick={() => sortByField('mass')}>Mass</th>
            <th onClick={() => sortByField('hair_color')}>Hair Color</th>
            <th onClick={() => sortByField('skin_color')}>Skin Color</th>
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
