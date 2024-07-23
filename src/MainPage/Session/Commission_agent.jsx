//Template For Listing CommissionAgent,Attributes --> CommissionAgents's name,id,phoneNumber,email,address

import React, { useState , useRef,useContext,useEffect} from "react";
import { Table } from "antd";
import Tabletop from "../../EntryFile/tabletop";
import { Link ,useLocation } from "react-router-dom";
import {PlusIcon,search_whites} from "../../EntryFile/imagePath";
import {SalesAttributes} from './index'
import { ForwardUriFetchFunction } from "../Functions/CommonFunctions"; 
import {ConstructorEventPost} from '../../Event/ConstructorEvent'
import {guidedata_fetch_api} from '../../api/Aws-api'
import { ApplicationAttributes } from "../../InitialPage/App";
import { ClassicSpinner } from "react-spinners-kit";
import { WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions";

const Commission_agent = (props) => {

  const [inputfilter, setInputfilter] = useState(false);
  const [commissionagentdata, setCommissionagentdata] = useState(false);
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [loading,setLoading] = useState(true)
  const loc = useLocation()
  const {OutletCode} = useContext(ApplicationAttributes)

  useEffect(()=>{
    const {commissionagentdatas,order_of_execution} = (loc.state ? loc.state : {})
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    if (commissionagentdatas) {setCommissionagentdata(commissionagentdatas)}
  },[])
  useEffect(() => {
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    async function fetchdata(){
      const fetchrequest = {"tablename" : OutletCode +"_user"};
      const responseData = await ConstructorEventPost(guidedata_fetch_api,fetchrequest);
      let commissionagentArray = responseData.filter(data => data.User_type == "commission_agent");
      setCommissionagentdata(commissionagentArray)
      setLoading(false)
      }
    fetchdata()
    
  },[])
  const uri = useRef(null);
  const togglefilter = (value) => {
    setInputfilter(value);
  };
  const {setCommission_agent_name,setCommission_agent_id,sales_persion_name,InitiatorCode} = useContext(SalesAttributes)
  uri.current = ForwardUriFetchFunction(OrderOfExecution,InitiatorCode);

  //function for setting data to global state when a option s selected from the list
  const set_data = (record) =>  {
    setCommission_agent_name(record.name)
    setCommission_agent_id(record.user_id)
  }

  const erase_data = () => {
    setCommission_agent_name("")
    setCommission_agent_id("")
  }
  
  const columns = [

    {
      title: WorkFlowSpecificNameChanger("commission_agent") + " Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (text, record) => <Link to={uri.current} state={{order_of_execution:OrderOfExecution+1 }} onClick={()=> set_data(record)}>{text}</Link>
    },

    {
      title: "Phone",
      dataIndex: "Mobile",
    },
    {
      title: "Email",
      dataIndex: "Email",

    },
    {
      title: "Address",
      dataIndex: "Address",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Choose your {WorkFlowSpecificNameChanger("commission_agent")}</h4>
              <h6>{sales_persion_name ? "Salesperson : "+sales_persion_name : null}</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/session/addcommission_agent" state={{ order_of_execution:OrderOfExecution+1 , uri: uri.current }}
                className="btn btn-added"
                >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New {WorkFlowSpecificNameChanger("commission_agent")}
              </Link>
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
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Name" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Phone" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Email" />
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
              key = {commissionagentdata} 
              columns={columns} 
              dataSource={commissionagentdata} 
              pagination={false}
              loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 
              />
              </div>
              {loading ?"" : <Link to={uri.current} state={{order_of_execution:OrderOfExecution+1 }} onClick={erase_data} className="btn btn-secondary mt-4 ml-4" >Skip</Link>  }
            </div>
            
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default Commission_agent;
