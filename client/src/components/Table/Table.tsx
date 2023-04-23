import React, { useEffect, useRef, useState } from "react";
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('asc'); //стейт для направления сортировки

  const [draggingItem, setDraggingItem] = useState<number | null>(null); // Состояние для элемента, который перемещают
  const [hoveringItem, setHoveringItem] = useState<number | null>(null); // Состояние для элемента, над которым перемещают

  const [colWidths, setColWidths] = useState<number[]>([]); // состояние для ширины столбцов
  const [rowHeights, setRowHeights] = useState<number[]>([]); // новое состояние для высот строк

  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);// ссылки на заголовки столбцов



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
  // drag & drop
  function handleDragStart(e: React.DragEvent<HTMLTableRowElement>, index: number) {
    e.dataTransfer.effectAllowed = "move";
    setDraggingItem(index);
  }

  function handleDragEnter(e: React.DragEvent<HTMLTableRowElement>, index: number) {
    e.preventDefault();
    setHoveringItem(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault();
    if (draggingItem !== null && hoveringItem !== null && draggingItem !== hoveringItem) {
      const newPeople = [...people];
      const itemToMove = newPeople[draggingItem];
      newPeople.splice(draggingItem, 1);
      newPeople.splice(hoveringItem, 0, itemToMove);
      dispatch(sortTable(newPeople));
    }
    setDraggingItem(null);
    setHoveringItem(null);
  }

  function handleDragEnd() {
    setDraggingItem(null);
    setHoveringItem(null);
  }

  // ресайз

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX+20;
    const startWidth = headerRefs.current[index]?.offsetWidth || 0;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      setColWidths((prevWidths) => {
        const newColWidths = [...prevWidths];
        newColWidths[index] = newWidth;
        return newColWidths;
      });
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  // функция для изменения высоты строки

  function isBorderClicked(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = 5;
    return (
      Math.abs(event.clientX - rect.left) < offset ||
      Math.abs(event.clientY - rect.bottom) < offset
    );
  }

  const handleRowMouseDown = (e: React.MouseEvent, index: number) => {
    if (!isBorderClicked(e.nativeEvent)) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const startHeight = e.currentTarget.getBoundingClientRect().height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = startHeight + moveEvent.clientY - startY;
      setRowHeights((prevHeights) => {
        const newRowHeights = [...prevHeights];
        newRowHeights[index] = newHeight;
        return newRowHeights;
      });
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };


  // сохранение высот строк и ширины столбцов в localStorage и установка их при монтировании компонента
  useEffect(() => {
    const storedRowHeights = localStorage.getItem("rowHeights");
    if (storedRowHeights) {
      setRowHeights(JSON.parse(storedRowHeights));
    }
    const storedColWidths = localStorage.getItem("colWidths");
    if (storedColWidths) {
      setColWidths(JSON.parse(storedColWidths));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rowHeights", JSON.stringify(rowHeights));
  }, [rowHeights]);

  useEffect(() => {
    localStorage.setItem("colWidths", JSON.stringify(colWidths));
  }, [colWidths]);

  // встроенные стили для изменения размеров столбцов и строк
  const colStyle = (index: number) => ({
    width: colWidths[index] ? `${colWidths[index]}px` : undefined,
    minWidth: "50px",
  });
  // встроенные стили для изменения высоты строки
  const rowStyle = (index: number) => ({
    height: rowHeights[index] ? `${rowHeights[index]}px` : undefined,
    minHeight: "30px",
  });

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              ref={(ref) => (headerRefs.current[0] = ref)}
              style={colStyle(0)}
            >
              <span onClick={() => sortByField("name")}>Name</span>
              <div
                className={styles.resizer}
                onMouseDown={(e) => handleMouseDown(e, 0)}
              />
            </th>
            <th
              ref={(ref) => (headerRefs.current[1] = ref)}
              style={colStyle(1)}
            >
              <span onClick={() => sortByField("height")}>Height</span>
              <div
                className={styles.resizer}
                onMouseDown={(e) => handleMouseDown(e, 1)}
              />
            </th>
            <th
              ref={(ref) => (headerRefs.current[2] = ref)}
              style={colStyle(2)}
            >
              <span onClick={() => sortByField("mass")}>Mass</span>
              <div className={styles.resizer} onMouseDown={(e) => handleMouseDown(e, 2)}/>
            </th>
            <th ref={(ref) => (headerRefs.current[3] = ref)} style={colStyle(3)}
            >
              <span onClick={() => sortByField("hair_color")} >Hair Color</span>
              <div className={styles.resizer} onMouseDown={(e) => handleMouseDown(e, 3)}
              />
            </th>
            <th ref={(ref) => (headerRefs.current[4] = ref)} style={colStyle(4)}>
              <span onClick={() => sortByField("skin_color")}>Skin Color</span>
              <div className={styles.resizer} onMouseDown={(e) => handleMouseDown(e, 4)} />
            </th>
            <th>Удалить строку</th>
          </tr>
        </thead>
        <tbody>
          {people.length ? (
            people.map((item, index) => (
              <tr
                key={uuidv4()}
                draggable
                style={rowStyle(index)}
                onMouseDown={(e) => handleRowMouseDown(e, index)}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e)}
                onDragEnd={handleDragEnd}
              >
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
              <td className={styles.plug} colSpan={6}>Нет данных для отображения</td>
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
