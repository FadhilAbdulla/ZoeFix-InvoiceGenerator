//session close template for clossing an open session

import React, { useEffect, useState ,useContext,useRef} from "react";
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { CircleSpinner} from "react-spinners-kit";
import { Link,useLocation,useNavigate } from "react-router-dom";
import {SalesAttributes} from './index'
import {UpdateSession_Sessiontable,BillingData_fetch_api} from '../../api/Aws-api'
import {ConstructorEventPost} from '../../Event/ConstructorEvent'
import {FetchWorkflow_code,ForwardUriFetchFunction,GetDateTime,WorkFlowSpecificNameChanger} from '../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../InitialPage/App";


const DeleteSession = (props) => {
  const [mainpageloading,setMainpageloading] = useState(true)
  const {RoundOff,OutletCode} = useContext(ApplicationAttributes)
  const [data,setData] = useState([{}])
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const {sales_persion_name,commission_agent_name,customer_name,session_id,sales_persion_id,desk_id,desk_name,appointment_id,appointment_starttime,InitiatorCode} = useContext(SalesAttributes)
  const date = GetDateTime()
  const loc = useLocation()
  const navigate = useNavigate()

  //function for fetching the all cart data which is have same session id
  useEffect(() => {
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    async function fetchdata(){
      const fetchrequest = {"tablename": OutletCode + "_cart","payload": {"session_id" : session_id}};
      const responseData = await ConstructorEventPost(BillingData_fetch_api,fetchrequest);
      console.log(responseData,"response")
      setData(responseData === "error" ? [] :responseData.errorMessage ? []: responseData)
      setMainpageloading(false)
    }
    fetchdata()
  },[])

  const workflow_code = FetchWorkflow_code()
  const [loading,setLoading] = useState(false)
  const uri = useRef(null);
  uri.current = ForwardUriFetchFunction(OrderOfExecution,InitiatorCode);
  console.log(uri.current)

//function for updating the session status
  const DeleteElementFromCloud = async (e) => {
    e.preventDefault();
    setLoading(true)
    const fetchrequest = {
        "client_code": OutletCode ,
        "payload": {
        "session_id" : session_id,
        "sales_person_id" : sales_persion_id,
        "Status" : false,
        "session_endDateTimeStamp": date,
        "desk_id" : desk_id,
        "desk_name" : desk_name,
        "appointment_id" : appointment_id,
        "appointment_starttime": appointment_starttime
      }
    }
    console.log(desk_id)
    const responseData = await ConstructorEventPost(UpdateSession_Sessiontable,fetchrequest);
    console.log(responseData)
    navigate('/dream-pos/session/activesession')
    setLoading(false)
  }

  const Total_commission_agent_Commission = data.reduce(function (total, data) {
    return total + parseFloat(data["commission_agent_amount"])
    }, 0
  );

  const Total_sales_person_Commission = data.reduce(function (total, data) {
    return total + parseFloat(data["sales_person_amount"])
    }, 0
  );

  const Total_Sale = data.reduce(function (total, data) {
    return total + parseFloat(data["total_amount"])
    }, 0
  );

    return(
        <>
        <div className="page-wrapper pagehead">
  <div className="content">
    <div className="page-header">
      <div className="row">
        <div className="col-sm-12">
          <h4 className="page-title">Session Details</h4>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              
                Active Session
            </li>
            <li className="breadcrumb-item active">Session Details</li>
          </ul>
          <ul className="breadcrumb">{session_id ? "Session id : " + session_id : null} </ul>
        </div>
      </div>
    </div>
    <div className="card" >
    <div className="card-body " >
    <div className="row">

      <MDBContainer>
      {commission_agent_name ?<MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
          {WorkFlowSpecificNameChanger("commission_agent")} Name
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {commission_agent_name}
        </MDBCol>
      </MDBRow>: "" }
      {customer_name ? <MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
        {WorkFlowSpecificNameChanger("customer")} Name
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {customer_name}
        </MDBCol>
      </MDBRow>: ""}
      {sales_persion_name ? <MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'  >
        {WorkFlowSpecificNameChanger("sales_person")} Name
        </MDBCol>
        <MDBCol className='p-2 border 'sm='6' md = '4'>
           {sales_persion_name}
        </MDBCol>
      </MDBRow>: "" }
      {desk_name ? <MDBRow className='mb-3 p-2'>
       <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
       {WorkFlowSpecificNameChanger("desk_name")} Name
       </MDBCol>
       <MDBCol className='p-2 border' sm='6' md = '4'>
         {desk_name}
       </MDBCol>
     </MDBRow> : "" }
      {mainpageloading ?<CircleSpinner size={20} color ="orange" loading={mainpageloading} /> :Total_Sale ? <MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
          Total Sale
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {mainpageloading ?<CircleSpinner size={20} color ="black" loading={mainpageloading} /> : Total_Sale ? Total_Sale.toFixed(parseInt(RoundOff)) : 0}
        </MDBCol>
      </MDBRow> : ""}
      {sales_persion_name ? Total_sales_person_Commission ? <MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
          Total {WorkFlowSpecificNameChanger("sales_person")} Commission
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {mainpageloading ?<CircleSpinner size={20} color ="black" loading={mainpageloading} /> : Total_sales_person_Commission ? Total_sales_person_Commission.toFixed(parseInt(RoundOff)) : 0}
        </MDBCol>
      </MDBRow> : "" : ""}
      {commission_agent_name ? Total_commission_agent_Commission ? <MDBRow className='mb-3 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
          Total {WorkFlowSpecificNameChanger("commission_agent")} Commission
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {mainpageloading ?<CircleSpinner size={20} color ="black" loading={mainpageloading} /> : Total_commission_agent_Commission ? Total_commission_agent_Commission.toFixed(parseInt(RoundOff)) : 0}
        </MDBCol>
      </MDBRow> : "" : ""}
      {commission_agent_name ? sales_persion_name ? Total_sales_person_Commission ? <MDBRow className='mb-4 p-2'>
        <MDBCol className='p-2 bg-light border' sm='6' md = '4'>
          Total Commission
        </MDBCol>
        <MDBCol className='p-2 border' sm='6' md = '4'>
          {mainpageloading ?<CircleSpinner size={20} color ="black" loading={mainpageloading} /> : Total_sales_person_Commission ? (Total_sales_person_Commission + Total_commission_agent_Commission).toFixed(parseInt(RoundOff)) : 0}
        </MDBCol>
      </MDBRow>: "": "" : ""}
      </MDBContainer>
      <form onSubmit={DeleteElementFromCloud}>
      <div style={{width: "200px" ,}}>
 </div> <br></br>
        <button disabled={loading}  className="btn btn-rounded btn-danger me-1" onClick={DeleteElementFromCloud}>
          {loading ? 
            <CircleSpinner size={20} color ="White" loading={loading} />
          :
            "End Session"}
        </button>
        <Link to={'/dream-pos/dashboard'} className="btn btn-primary me-1">
                    Dashboard
                  </Link>
      </form>
    </div>
  </div>
  </div>
  </div>
</div>

        </>
    )
}

export default DeleteSession;

