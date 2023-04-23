import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  title: string;
  onClickFunc: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onClickFunc }) => {


  return (
    <button onClick={onClickFunc} className={styles.button}>
      {title}
    </button>
  );
}

export default Button;