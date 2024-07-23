import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AddNewItem from './AddNewItem';
import Item from './Item';


export const Item_Index = () =>(
    <Routes>
        <Route path="/" element={<Item/>} />
        <Route path="/addnewitem" element={<AddNewItem/>} />
    </Routes>
)





