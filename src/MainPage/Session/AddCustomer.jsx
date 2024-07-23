//Template For Adding New Customer,Attributes --> Customer's name,id,phoneNumber,email,address

import React, { useState ,useRef ,useContext,useEffect} from "react";
import { useLocation ,useNavigate} from "react-router-dom"
import { useForm } from 'react-hook-form'
import { CircleSpinner } from "react-spinners-kit";
import { AddNewUser, AddSession_Sessiontable} from '../../api/Aws-api';
import { SalesAttributes} from './index'
import { FormSubmitEvent} from '../../Event/ConstructorEvent'
import { GetDateTime,CheckWorkFlowCreatingSession} from '../Functions/CommonFunctions'
import { ApplicationAttributes } from "../../InitialPage/App";
import { WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions";


const AddCustomer = () => {

  const { register, getValues } = useForm();
  const [loading,setLoading] = useState(false)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const loc = useLocation()
  const date = GetDateTime()
  const navigate = useNavigate()

  
  useEffect(()=>{
    const {order_of_execution,ForwardUri} = (loc.state ? loc.state : {})
    console.log(order_of_execution,"useEffectbefore")
    console.log(loc)
    if (order_of_execution) {console.log(order_of_execution,"useEffect");setOrderOfExecution(order_of_execution)}
    if (ForwardUri) {uri.current= ForwardUri}
  },[])

  const {desk_id,desk_name,appointment_id,appointment_starttime,setSession_id,setCustomer_name,setCustomer_id,commission_agent_name,commission_agent_id,sales_persion_name,sales_persion_id} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const uri = useRef(null);


  const addCustomerDatatoCloud = async (e) =>  {
    e.preventDefault(); 
    setLoading(true)
    const formData = {
    "clientCode" : OutletCode, 
    "payload": {"Item": {
      "name": getValues("name"),
      "Mobile" : getValues("phone"),
      "Email" : getValues("email"),
      "Address": getValues("address"),
      "User_type" : "customer"
    }}}
    const responseData = await FormSubmitEvent(AddNewUser,formData);
    setCustomer_id(responseData[0])
    console.log(responseData,formData)
    if (CheckWorkFlowCreatingSession(parseInt(OrderOfExecution)-2)){addNewSessionDataToCloud(responseData[0])}
    else { 
      setCustomer_name(getValues("name"))
      navigate(uri.current,{state: {order_of_execution: OrderOfExecution}});
      console.log("error happend - no session created")
    }
    
  }

  const addNewSessionDataToCloud = async (Customer_id) =>  {
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "sales_person_id" : String(sales_persion_id),
        "commission_agent_id": String(commission_agent_id),
        "sales_person_name":sales_persion_name,
        "commission_agent_name":commission_agent_name,
        "total_commission_agent_amount" : 300,
        "total_sales_agent_amount" : 300,
        "customer_id" : String(Customer_id),
        "customer_name" : getValues("name"),
        "session_status" : true,
        "session_startDateTimeStamp" : date,
        "appointment_id" : appointment_id,
        "appointment_starttime" : appointment_starttime,
        "desk_id" : desk_id,
        "desk_name" : desk_name,

    }}};
    const responseData = await FormSubmitEvent(AddSession_Sessiontable,formData);
    setSession_id(responseData[0])
    setCustomer_name(getValues("name"))
    setLoading(false)
    navigate( uri.current,{state: {order_of_execution: OrderOfExecution }});    
  }



  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">

              <h3>{sales_persion_name ? "Sales Person : "+sales_persion_name : null }</h3>
              <h3>{commission_agent_name ? "Commission Agent : "+ commission_agent_name : null }</h3>
            </div>
          </div>
          {/* /add */}
          <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Add New {WorkFlowSpecificNameChanger("customer")} </h4>
              </div>
              <div className="card-body">
                <form onSubmit={addCustomerDatatoCloud}>
                <div className="form-group">
                    <label>{WorkFlowSpecificNameChanger("customer")} Name <span style={{color: "red"}}>*</span></label>
                    <input type="text" className="form-control" placeholder="Enter name" required {...register('name')}/>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" className="form-control" placeholder="abc@sample.com" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" {...register('email')} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" className="form-control" placeholder="9898989898" pattern="[0-9]{10}" {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" className="form-control" {...register('address')}/>
                  </div>
                  <div className="text-end">
                  <CircleSpinner size={30} color ="orange" loading={loading} />
                    {loading ? null :
                    <button  className="btn btn-primary" 
                    type="submit"
                    >
                     Submit & Continue
                    </button> }
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
          {/* /add */}
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
