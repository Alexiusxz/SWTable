import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  title: string;
  onClickFunc: () => void;
  link?: string | null | boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClickFunc, link = true }) => {


  return (
    <button onClick={onClickFunc} className={styles.button} disabled = {link ? false: true }>
      {title}
    </button>
  );
}

export default Button;