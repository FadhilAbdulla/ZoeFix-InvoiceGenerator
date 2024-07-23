//Template For Adding New CommissionAgent,Attributes --> CommissionAgents's name,id,phoneNumber,email,address


import React, { useState ,useContext,useEffect} from "react";
import {useLocation,useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { CircleSpinner } from "react-spinners-kit";
import {AddNewUser} from '../../api/Aws-api'
import {SalesAttributes} from './index'
import {FormSubmitEvent} from '../../Event/ConstructorEvent'
import { ApplicationAttributes } from "../../InitialPage/App";
import { WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions";


const AddCommission_agent = (props) => {

  const loc = useLocation()
  const [Nexturi,setNextUri] = useState();
  const { register, getValues } = useForm();
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [loading,setLoading] = useState(false)
  const {setCommission_agent_name,setCommission_agent_id,sales_persion_name} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const navigate = useNavigate()

  useEffect(()=>{
    const {uri,order_of_execution} = (loc.state ? loc.state : {})
    if (uri) {setNextUri(uri)}
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
  },[])

  const addcommissionagentDatatoCloud =  async (e) =>  {
    e.preventDefault();
    setLoading(true)
    setCommission_agent_name(getValues("name"))
    const formData = {
    "clientCode" : OutletCode,
    "payload": {"Item": {
      "name": getValues("name"),
      "Mobile" : getValues("phone"),
      "Email" : getValues("email"),
      "Address": getValues("address"),
      "User_type" : "commission_agent"
    }}};
    const responseData = await FormSubmitEvent(AddNewUser,formData);
    setCommission_agent_id(responseData[0])
    setLoading(false)
    navigate( Nexturi,{state: {order_of_execution:OrderOfExecution}});

  }
  
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
            <h6>{sales_persion_name ? "Sales Person : "+sales_persion_name : null}</h6>
            </div>
          </div>
          {/* /add */}
          <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title mb-0">Add New {WorkFlowSpecificNameChanger("commission_agent")} </h4>
              </div>
              <div className="card-body">
                <form onSubmit = {addcommissionagentDatatoCloud}>
                  <div className="form-group">
                    <label>{WorkFlowSpecificNameChanger("commission_agent")} Name <span style={{color: "red"}}>*</span></label>
                    <input type="text" className="form-control" placeholder="Enter name" required {...register('name')}/>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" placeholder="abc@sample.com" pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" {...register('email')}/>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" className="form-control" placeholder="9898989898" pattern="[0-9]{10}"  {...register('phone')} />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" className="form-control" {...register('address')} />
                  </div>


                  <div className="text-end">
                    <CircleSpinner size={30} color ="orange" loading={loading} />
                    {loading ? null :
                    <button  className="btn btn-primary" 
                    type="submit"
                    >
                     Submit
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

export default AddCommission_agent;