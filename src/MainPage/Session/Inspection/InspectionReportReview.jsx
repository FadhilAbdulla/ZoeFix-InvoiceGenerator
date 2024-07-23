import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction} from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';
import { Table } from 'antd';
import {FormSubmitEvent} from '../../../Event/ConstructorEvent'
import { ApplicationAttributes } from "../../../InitialPage/App";
import { CreateNewTemplate } from '../../../api/Aws-api';
import { CircleSpinner } from 'react-spinners-kit';


const InspectionReportReview = () => {
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,InspectionReportHeaderData,InspectionReportTableData,InspectionReportCommentsData} = useContext(SalesAttributes)
    const {OutletCode} = useContext(ApplicationAttributes)
    const [loading,setLoading] = useState(false)

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
    })

    const HeaderData = InspectionReportHeaderData
    const columns = [
        {dataIndex: "name"},
        {dataIndex: "data"}];
    const TableData = InspectionReportTableData
    const CommentData = InspectionReportCommentsData
    const DivideSentenceintoPieces = (data) => {return data.split(".").filter((item) => item !== "")}
    
    const addsalespersonsDatatoCloud = async (e) =>  {
        e.preventDefault();
        setLoading(true)
        const formData = {
        "clientCode" : OutletCode,
        "params":{
          "HeaderData": InspectionReportHeaderData,
          "TableData" : InspectionReportTableData,
          "CommentData" : InspectionReportCommentsData
        }};
        const responseData = await FormSubmitEvent(CreateNewTemplate,formData);
        setLoading(false)
        navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
    }

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                    <h4>Report Review</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row ml-4">
                            <div className="col-12 mt-4 InspectionReviewHeaderDisplay">
                                {HeaderData.map((item,index) => (
                                    <div className='row' key={index}>
                                    <div className='col-lg-3 col-sm-3 col-12'>{item.name}</div>
                                    <div className='col-lg-9 col-sm-9 col-12'>: {item.data}</div>
                                    </div>
                                ))
                                }
                            </div>
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-12 mt-4">
                                {TableData.length > 0 && <Table
                                className="table datanew dataTable no-footer"      
                                columns={columns}
                                dataSource={TableData}      
                                pagination={false}
            
                                />
                                }
                            </div>
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-12 mt-4">
                                {CommentData.map((item,index) => (
                                    <div  key={index}>
                                        <div className='InspectionReviewCommentHeader'>{item.name} :</div>
                                            {DivideSentenceintoPieces(item.data).map((data)=>(
                                                <div className='InspectionReviewCommentBody'>
                                                    {"✤   "} &nbsp; {data}
                                                </div>
                                            ))}
                                    </div>
                                ))
                                }
                            </div>
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-lg-12 mt-4">
                            <button className="btn btn-cancel me-2" onClick={()=>navigate("/dream-pos/dashboard")}>
                                Dashboard
                            </button>
                            <button className="btn btn-submit" disabled={loading} onClick={addsalespersonsDatatoCloud}>
                                {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Save Template"}
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InspectionReportReview;
