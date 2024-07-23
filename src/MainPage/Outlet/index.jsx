import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AddOutlet from './AddOutlet';
import SelectBusinessCase from './SelectBusinessCase';
import BusinessMapping from './BusinessMapping';
import ListOutlet from './ListOutlet';
import EditOutlet from './EditOutlet';

export const Outlet_Index = () =>(
    <Routes>
        <Route path="/addoutlet" element={<AddOutlet/>} />
        <Route path="/selectbusinesscase" element={<SelectBusinessCase/>} /> 
        <Route path="/businessmapping" element={<BusinessMapping/>} /> 
        <Route path="/listoutlet" element={<ListOutlet/>} /> 
        <Route path="/editoutlet" element={<EditOutlet/>} /> 
    </Routes>
)





