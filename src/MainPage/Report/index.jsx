import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Report from './Report';
import GenerateTaxInvoice from './GenerateTaxInvoice';
import GenerateBillOfSupply from './GenerateBillOfSupply';

export const Report_Index = () =>(
    <Routes>
        <Route path="/" element={<Report/>} /> 
        <Route path="/generatetaxinvoice" element={<GenerateTaxInvoice/>} />
        <Route path="/generatebillofsupply" element={<GenerateBillOfSupply/>} /> 
    </Routes>
)





