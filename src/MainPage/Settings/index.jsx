import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Settings from './Settings';



export const Settings_Index = () =>(
    <Routes>
        <Route path="/" element={<Settings/>} /> 
    </Routes>
)





