/* eslint-disable @typescript-eslint/no-inferrable-types */
import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Form from './pages/MyForm/Form';

function App(): JSX.Element {

  return (

    <Routes>
      <Route index element={<Main/>}/>
      <Route path='/form' element={<Form/>}/>
    </Routes>


  );
}

export default App;
