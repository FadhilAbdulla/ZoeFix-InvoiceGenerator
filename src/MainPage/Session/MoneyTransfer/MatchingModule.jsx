import React, { useState,useEffect,useContext,useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { ConstructorEventGet,FormSubmitEvent } from "../../../Event/ConstructorEvent";
import { FetchMappingDetails} from "../../../api/Aws-api";
import { Table } from 'antd';
import "../../../EntryFile/antd.css";
import { ClassicSpinner } from "react-spinners-kit";
import {errorMessage,SetWorkFlowForApplication,ForwardUriFetchFunction,successMessage} from "../../../MainPage/Functions/CommonFunctions";
import { ApplicationAttributes } from "../../../InitialPage/App";
import { WorkFlowSpecificNameChanger } from "../../../MainPage/Functions/CommonFunctions";
import { SalesAttributes } from '../index';

const MatchingModule = (props) => {
  const [data,setData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [loading,setLoading] = useState(false)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const loc = useLocation()
  const {OutletCode,B2BCode,OutletName} = useContext(ApplicationAttributes)
  const {InitiatorCode} = useContext(SalesAttributes)
  const navigate = useNavigate()
  const uri = useRef(null);

  useEffect(()=>{
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
    uri.current = "/dream-pos/dashboard"
    async function fetchdata(){
      const responseData = await ConstructorEventGet(FetchMappingDetails ,{client_code: OutletCode});
      if (responseData){
        setData(responseData)
        setFilteredData(responseData)
      }
      setLoading(false)
    }
    setLoading(true)
    fetchdata()
  },[])

  const handleRowSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectChange,
  };


  const SelectedBuisenessCase = () => {
    //const selectedData = data.find((item) => item.business_unit === selectedRowKeys[0])
    successMessage("Matched Succefully")
    navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }});
  }

  const columns = [
    Table.SELECTION_COLUMN,
    Table.EXPAND_COLUMN,
    {
      title: WorkFlowSpecificNameChanger("customer"),
      dataIndex: "Customer",
      key: "Customer",
      width: '50%',
      render: (text, record) => (
        <div className="productimgname">
          <div style={{ fontSize: "15px", marginLeft: "5px" ,color: "black",whiteSpace: 'pre-wrap'}}>
            {record.Customer}
          </div>
        </div>
      ),
      sorter: (a, b) => a.Customer.length - b.Customer.length,
    },
    
    {
      title: WorkFlowSpecificNameChanger("amount"),
      dataIndex: "FcAmount",
      key: 'FcAmount',
      width: '100%',
      render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
    },
    
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Money Transfer Shop</h4>
              {/*<h6>Select the business you run on this unit</h6>*/}
            </div>
            <div className="page-btn">
            
              <span className="btn btn-added" onClick={SelectedBuisenessCase}>
                Match
              </span>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
              <Table
                  className="table datanew dataTable no-footer"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={filteredData}
                  expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263" }}>
                                Reference Number : 
                                <div style={{fontFamily: "Arial, sans-serif" ,marginLeft: "10px" ,fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.ReferenceNumber}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263"}}>
                                Forigen Currency :
                                <div style={{marginLeft: "10px" ,fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.ForigenCurrency}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263" }}>
                                FC Amount :
                                <div style={{marginLeft: "10px" ,fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.FcAmount}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263" }}>
                                BC Paid :
                                <div style={{marginLeft: "10px" ,fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.BcPaid}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263" }}>
                                Unmatched :
                                <div style={{marginLeft: "10px" ,fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.Unmatched}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263"}}>
                                Matching : 
                                <div style={{marginLeft: "10px" , fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.Matching}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263"}}>
                                Profit : 
                                <div style={{marginLeft: "10px" , fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.Profit}</div>
                            </div>
                            <div style={{ fontWeight: "bold",fontSize: "13px", marginLeft: "20px" ,color: "#110263"}}>
                                Service Charge : 
                                <div style={{marginLeft: "10px" , fontSize: "13px",fontWeight: "lighter",color: "black",display: "inline-block" }}>{record.ServiceCharge}</div>
                            </div>
                        </div>
                    ),
                  }}
                  rowKey={(record) => record.payment_id}
                  pagination={false}
                  loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 

                />

              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default MatchingModule;
