//for listing active session in the selected workflow

import React, { useEffect, useState ,useContext , useRef} from "react";
import Tabletop from "../../../EntryFile/tabletop"
import { Link, useNavigate } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { Table } from "antd";
import "../../../EntryFile/antd.css";
import {ConstructorEventGet} from '../../../Event/ConstructorEvent'
import FeatherIcon from "feather-icons-react";
import { search_whites } from "../../../EntryFile/imagePath";
import {FetchInspectionReport} from '../../../api/Aws-api'
import {SalesAttributes} from '../index'
import {FetchWorkflow_code} from '../../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../../InitialPage/App";

const Activesession = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  //fetch the active session from the session table
  useEffect(() => {
      async function fetchdata(){
        const fetchrequest = {"client_code" : OutletCode };
        const responseData = await ConstructorEventGet(FetchInspectionReport,fetchrequest);
        console.log(responseData)
        setData(responseData.errorMessage ? [] : responseData)
        setLoading(false)}
      fetchdata()
  },[])

  const [inputfilter, setInputfilter] = useState(false);
  const {setInspectionReportHeaderData,setInspectionReportTableData,setInspectionReportCommentsData,setInspectionReportId,setInspectionReportImage} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const navigate = useNavigate()
  const TableColoumns = [
    {
      title: "Project Name",
      dataIndex: "HeaderData",
      sorter: (a, b) => FindProjectName(a.HeaderData).length - FindProjectName(b.HeaderData).length,
      render: (text, record) => <div className="divHoverForTables" onClick={()=>ClickedAnInspectionReport(record)} >{FindProjectName(text)}</div>
    },
    {
      title: "Inspection Date",
      dataIndex: "InspectionReportDate",
      sorter: (a, b) => a.InspectionReportDate.length - b.InspectionReportDate.length,
    },
    {
      render: (text, record) => <iconify-icon icon="fa-solid:file-upload" style={{fontSize : "20px"}}/>
    }
  ]
  
  const ClickedAnInspectionReport = (fulldata) => {
    console.log(fulldata)
    setInspectionReportHeaderData(fulldata["HeaderData"])
    setInspectionReportTableData(fulldata["TableData"])
    setInspectionReportCommentsData(fulldata["CommentData"])
    setInspectionReportId(fulldata["inspection_report_id"])
    setInspectionReportImage(fulldata["pdf_url"])
    navigate("/dream-pos/session/edit_inspection_report_review")
  }

  const FindProjectName = (data) => {
    for (let ind of data){
        if (ind["name"] === "Project Name"){
            return ind["data"]
        }
    }
    return "error"
  }



  const togglefilter = (value) => {
    setInputfilter(value)
  };


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>List Inspection</h4>
              
            </div>
          </div>
          {/* /product list */}
          
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
          
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default Activesession;
