import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction } from '../../Functions/CommonFunctions';
import Tabletop from "../../../EntryFile/tabletop"

import { Link, Navigate } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { Table } from "antd";
import "../../../EntryFile/antd.css";
import {ConstructorEventGet} from '../../../Event/ConstructorEvent'
import FeatherIcon from "feather-icons-react";
import { search_whites } from "../../../EntryFile/imagePath";
import {FetchInspectionTemplates} from '../../../api/Aws-api'
import {SalesAttributes} from '../index'
import {FetchWorkflow_code,WorkFlowSpecificNameChanger,FetchSessionRedirectTemplateFromFetchedWorkflow} from '../../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../../InitialPage/App";


const Inspection = () => {
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,setInspectionReportHeaderData,setInspectionReportTableData,setInspectionReportCommentsData} = useContext(SalesAttributes)


    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    //fetch the active session from the session table
    useEffect(() => {
        const { order_of_execution } = loc.state ? loc.state : {};
        console.log(order_of_execution)
        if (order_of_execution) {setOrderOfExecution(order_of_execution);
            uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)
        }
        fetchdata()
        setLinkForRedirection()
    },[])

    const fetchdata = async() => {
        const fetchrequest = {"client_code" : OutletCode };
        const responseData = await ConstructorEventGet(FetchInspectionTemplates,fetchrequest);
        console.log(responseData)
        setData(responseData.errorMessage ? [] : responseData)
        setLoading(false)
    }

  const workflow_code = FetchWorkflow_code()
  const [inputfilter, setInputfilter] = useState(false);
  const {OutletCode} = useContext(ApplicationAttributes)
  var Main_workflow = JSON.parse(localStorage.getItem('WorkFlow'))
  const order_of_execution = useRef(null);
  const RedirectionUrl = useRef(null);


  const setLinkForRedirection = () => {
    const redirectionUrlFetched = FetchSessionRedirectTemplateFromFetchedWorkflow()
    RedirectionUrl.current = "/dream-pos/session/" + redirectionUrlFetched
    //for getting the current order of execution of the redirectionUrl in the workflow
    for (let workflow in Main_workflow){
      if (Main_workflow[workflow]["routing_uri"] == redirectionUrlFetched){
        order_of_execution.current = parseInt(workflow)
      }
    }
  }
  const SetTemplateSelected = (checkData) => {
    for (let templates of data){
        if (templates["HeaderData"] === checkData){
            setInspectionReportHeaderData(templates["HeaderData"])
            setInspectionReportTableData(templates["TableData"])
            setInspectionReportCommentsData(templates["CommentData"])
            navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
        }
    }
  }

 const TableColoumns = [
    {
        title: "Template Name",
        dataIndex: "HeaderData",
        sorter: (a, b) => FindTemplateName(a.HeaderData).length - FindTemplateName(b.HeaderData).length,
        render: (text, record) => <div className="divHoverForTables" onClick={()=>SetTemplateSelected(text)} >{FindTemplateName(text)}</div>
    }
    ]
    const FindTemplateName = (data) => {
        for (let ind of data){
            if (ind["name"] === "TemplateName"){
                return ind["data"]
            }
        }
        return "error"
    }

    const togglefilter = (value) => {
        setInputfilter(value);
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="page-title">
                        <h4>Choose An Inspection Template</h4>
                    </div>
                </div>
                {workflow_code == "QS" ?
                    <Navigate  to="/dream-pos/session"/> : 
                    <div className="card">
                        <div className="card-body">
                        
                        <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
                        {/* /Filter */}
                        <div
                            className={`card mb-0 ${ inputfilter ? "toggleCls" : ""}`}
                            id="filter_inputs"
                            style={{ display: inputfilter ? "block" :"none"}}
                        >
                            <div className="card-body pb-0">
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                <div className="form-group">
                                    <input type="text" placeholder="Enter name" />
                                </div>
                                </div>

                                <div className="col-lg-2 col-sm-6 col-12">
                                <div className="form-group">
                                    
                                
                                </div>
                                </div>
                                <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                                <div className="form-group">
                                    <a className="btn btn-filters ms-auto">
                                    <img src={search_whites} alt="img" />
                                    </a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        {/* /Filter */}
                        <div className="table-responsive">

                            <Table    
                                className="table datanew dataTable no-footer"      
                                columns={TableColoumns}
                                dataSource={data}      
                                pagination={false}
                                rowKey={(record) => record.User_id}
                                loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 
                            />
                        
                        </div>
                        </div>
                    </div>
                    }
            </div>
        </div>
    );
}

export default Inspection;
