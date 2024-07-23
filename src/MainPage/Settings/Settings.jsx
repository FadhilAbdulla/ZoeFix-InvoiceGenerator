import React,{useState,useEffect,useContext} from 'react'
import { ConstructorEventGet } from '../../Event/ConstructorEvent';
import {FetchWorkFlowCode} from '../../api/Aws-api'
import { CircleSpinner } from "react-spinners-kit";
import { successMessage,SetWorkFlowForApplication } from '../Functions/CommonFunctions';

function Settings() {
  const [workFlow_options,setWorkFlow_options] = useState([])
  const [selectdata,setSelectdata] = useState()
  const [loading,setLoading] = useState(false)
  const [Refreshloading,setRefreshLoading] = useState(false)
  
  // useEffect(()=>{
  //   async function fetchdata(){
  //     const responseData = await ConstructorEventGet(FetchWorkFlowCode);
  //     console.log(responseData)
  //     setWorkFlow_options(responseData ? responseData : [])
  //     setRefreshLoading(false)
  //   }
  //   setRefreshLoading(true)
  //   fetchdata()
  //   const workflowCode = localStorage.getItem('Workflow_code')
  //   setSelectdata(workflowCode)
  // },[])

  const handle = () => {
    for (var data in workFlow_options){
      if (workFlow_options[data]["workflow_code"] === selectdata){
        SetWorkFlowForApplication(workFlow_options[data])
      }}
  };
  //Sconst LocalStorageUser = JSON.parse(localStorage.getItem('OutletData'))
  //const outletName = LocalStorageUser && LocalStorageUser["outlet"]["outlet_name"]
  const Country = [
    {
    name : "India",
    code : "IN",
    currency : "₹"
    },
    {
      name : "America",
      code : "US",
      currency : "$"
    },
    {
      name : "Germany",
      code : "GM",
      currency : "€"
    }
  ]
  
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Settings</h4>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
            <CircleSpinner size={20} color ="orange" loading={Refreshloading} /> 
              <div className='row'>
                {/*<div className="col-lg-4 col-sm-6 col-12" >
                  <div className="form-group pt-4">
                    <label>Select WorkFlow</label>
                    <select value={selectdata} className="checkInput" onChange={(e) => setSelectdata(e.target.value) }>
                      {workFlow_options.map((data, index) => (<option value={data["workflow_code"]}>{data["workflow_name"]}</option>))}
                    </select>
                  </div>
  </div>*/}
                <div className="col-lg-4 col-sm-6 col-12" >
                  <div className="form-group pt-4">
                    <label>Select Country</label>
                    <select name="cars" id="cars" className="checkInput" >
                      {Country.map((data, index) => (<option value={data["code"]}>{data["name"]}</option>))}
                    </select>
                  </div>
                </div>
                {/*<div className="col-lg-12 col-sm-12 col-12" >
                  <div className="form-group pt-4">
                    <label>Selected Outlet :</label>
                    {outletName}
                  </div>
</div>*/}
              </div>
              <button className="btn btn-primary"  disabled={loading}>{/*onClick={handle}*/}
                {loading ? <CircleSpinner size={20} color ="black" loading={loading} /> : "Save Changes" } 
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings