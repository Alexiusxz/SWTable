import React from 'react'
import styles from './Loader.module.css'

function Loader() {
  return (
    <img
   className={styles.spinner}
   src='./img/dv.png'
   alt='loader'
   />
  )
}

export default Loader