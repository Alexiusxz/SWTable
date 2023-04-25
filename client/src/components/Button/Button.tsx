import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  title: string;
  onClickFunc: () => void;
  disable: string | null | boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClickFunc, disable }) => {


  return (
    <button onClick={onClickFunc} className={styles.button} disabled = {disable ? false: true }>
      {title}
    </button>
  );
}

export default Button;