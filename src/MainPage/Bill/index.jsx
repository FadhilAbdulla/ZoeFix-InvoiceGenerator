import React,{useEffect} from 'react'
import {Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AddNewBill from './AddNewBill';
import ListBill from './ListBill';




export const Bill_Index = ()=> {


    return (
    <Routes>
        <Route path="/" element={<ListBill/>} /> 
        <Route path="/addnewbill" element={<AddNewBill/>} /> 
    </Routes>)
}
