import React from "react";
import styles from './Modal.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const Modal: React.FC<Props> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}></div>
      <div className={styles.modal}>
        <p>Вы уверены, что хотите удалить эту строку?</p>
        <div className={styles.buttons}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={onDelete}>OK</button>
        </div>
      </div>
    </>
  );
};

export default Modal;
