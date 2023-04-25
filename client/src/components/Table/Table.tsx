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
  const [isModalOpen, setIsModalOpen] = useState(false);//состояние для модального окна
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null); // состояние для выбранной строки для удаления
  const [sortBy, setSortBy] = useState<string | null>(null);//состояние для сортировки по столбцу по алфавиту
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>('asc'); //состояние для направления сортировки

  const [draggingItem, setDraggingItem] = useState<number | null>(null); // Состояние для элемента, который перемещают
  const [hoveringItem, setHoveringItem] = useState<number | null>(null); // Состояние для элемента, над которым перемещают

  const [colWidths, setColWidths] = useState<number[]>([]); // состояние для ширины столбцов
  const [rowHeights, setRowHeights] = useState<number[]>([]); // состояние для высот строк

  const headerRefs = useRef<(HTMLTableCellElement | null)[]>([]);// ссылки на заголовки столбцов

  useEffect(() => {
    const data = JSON.stringify(people)
    if (people && people.length) localStorage.setItem('swapi', data)
  }, [people])


  // функция для удаления строки(открытия модального окна)
  function deleteRow(index: number) {
    setIndexToDelete(index);
    setIsModalOpen(true);
  }

  // функция для подтверждения удаления строки(закрытие модального окна модального окна)
  function confirmDel() {
    indexToDelete !== null && dispatch(delRow(indexToDelete))
    setIsModalOpen(false);
    setIndexToDelete(null);
  }

  // сортировка
  useEffect(() => {
    if (sortBy) {
      const sort = [...people].sort(compareValues);
      dispatch(sortTable(sort));
    }
  }, [sortBy, sortOrder]);

  function compareValues(a: IOneMan, b: IOneMan) {
    if (a[sortBy as keyof IOneMan] < b[sortBy as keyof IOneMan]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy as keyof IOneMan] > b[sortBy as keyof IOneMan]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  }

  function sortByField(field: string) {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setSortBy(field);
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
    const startX = e.clientX ;
    const startWidth = colWidths[index] || headerRefs.current[index]?.offsetWidth || 0;

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
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const { isColBorderClicked, isRowBorderClicked } = isBorderClicked(e);
      if (isColBorderClicked) {
        target.style.cursor = "col-resize";
      } else if (isRowBorderClicked) {
        target.style.cursor = "row-resize";
      } else {
        target.style.cursor = "";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  
  function isBorderClicked(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offset = 5;
    const isColBorderClicked =
      Math.abs(event.clientX - (rect.left + rect.width)) < offset;
    const isRowBorderClicked =
      Math.abs(event.clientY - (rect.top + rect.height)) < offset;
  
    return { isColBorderClicked, isRowBorderClicked };
  }
  

  const handleRowMouseDown = (e: React.MouseEvent, index: number) => {
    if (!isBorderClicked(e.nativeEvent).isRowBorderClicked) return;
    e.preventDefault();
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

  // встроенные стили для изменения размеров столбцов 
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
            {people.length ? Object.keys(people[0]).map((el, i) =>
              
                <th
                  ref={(ref) => (headerRefs.current[i] = ref)}
                  style={colStyle(i)}
                  key={uuidv4()}
                >
                  <span onClick={() => sortByField(el)}>{el}</span>
                  <div
                    className={styles.resizer}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                  />
                </th>
              
            ) : <></>}
            {people.length ? <th>Delete Line</th> : <></>}
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
                <td>{item.name}<div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
                <td>{item.height}<div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
                <td>{item.mass}<div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
                <td>{item.hair_color}<div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
                <td>{item.skin_color}<div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
                <td><button onClick={() => deleteRow(index)}>x</button><div className={styles.rowResizerInvisible} onMouseDown={(e) => handleRowMouseDown(e, index)}></div></td>
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.plug} colSpan={6}>Nothing to show</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && createPortal(
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onDelete={confirmDel} />,
        document.getElementById('modal-root') || document.createElement('div')
      )}
    </>
  );
};

export default Table;
