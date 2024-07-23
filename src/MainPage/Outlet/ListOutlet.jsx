//for listing active session in the selected workflow

import React, { useEffect, useState ,useContext , useRef} from "react";
import Tabletop from "../../EntryFile/tabletop"
import { Link, Redirect } from "react-router-dom";
import { ClassicSpinner,CircleSpinner } from "react-spinners-kit";
import { Table,Switch } from "antd";
import "../../EntryFile/antd.css";
import {EditIcon,DeleteIcon,settings} from "../../EntryFile/imagePath";
import {ConstructorEventGet,FormSubmitEvent} from '../../Event/ConstructorEvent'
import {FetchOutletDetails,UpdateOutletDetails} from '../../api/Aws-api'
import { successMessage,errorMessage,WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions"
import { ApplicationAttributes } from "../../InitialPage/App";
import { Modal, Button } from "react-bootstrap";
import { useForm } from 'react-hook-form'


const ListOutlet = () => {
  const [data,setData] = useState()
  const [loading,setLoading] = useState(true)
  const [settingsloading,setSettingsLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [showAnimation, setShowAnimation] = useState(true)
  const [SelectedSettings, setSelectedSettings] = useState()
  const { register, getValues,setValue  } = useForm();
  const {B2BCode} = useContext(ApplicationAttributes)

  useEffect(() => {
      async function fetchdata(){
        //const fetchrequest = {"tablename" : ClientCode +"_session"};
        const responseData = await ConstructorEventGet(FetchOutletDetails,{"b2b_code" : B2BCode});
        console.log(responseData)
        setData(responseData.errorMessage ? [] : responseData)
        setLoading(false)}
      fetchdata()
  },[])

  const columns =  [
    {
      title: WorkFlowSpecificNameChanger("outlet") + " Name",
      dataIndex: "outlet_name",
      sorter: (a, b) => a.outlet_name.length - b.outlet_name.length,
      //render: (text, record) => <Link to={{pathname:"/dream-pos/outlet/editoutlet", state:{data:record },}} >{text}</Link>
    },
    {
      title: WorkFlowSpecificNameChanger("outlet")+" Address",
      dataIndex: "outlet_address",
      sorter: (a, b) => a.Agent_name.length - b.Agent_name.length,
      render: (record) => record.StreetAddress !== "" ? record.StreetAddress +" " + record.Outlet_State+ " "+ record.Country +" " +record.PinCode : ""
    },
    {
      title: WorkFlowSpecificNameChanger("outlet") + " Website",
      dataIndex: "outlet_website",
    },
    {
      title: "Agents",
      dataIndex: "outlet_agent",
      render: (text, record) => (<div>{record["outlet_agent"] ? record["outlet_agent"].length : 0}</div>)
    },
    {
      render: (text, record) => (
        <>
          <Link className="me-3" to="/dream-pos/outlet/editoutlet" state ={{data:record }} >
          <iconify-icon icon="fluent:edit-20-regular" style={{ fontSize: '1.5em' }} ></iconify-icon>
          </Link>
          <Link className="me-3" onClick={()=>ClickedSettingsmenu(record)} >
          <iconify-icon icon="solar:settings-outline" style={{ fontSize: '1.5em' }} ></iconify-icon>
          </Link>
        </>
      ),
    }
  ];
  function SettingsModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static" 
        animation={showAnimation}
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
          {WorkFlowSpecificNameChanger("outlet")} Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <div className="row">
            {SelectedSettings&& SelectedSettings["settings"].map((data, index) => {
              //console.log(data["settings_type"])
              if (data["settings_type"] === "string")
              return (<div className="col-lg-6 col-sm-3 col-12" key={index}>
                <div className="form-group pt-4">
                <label>{data["settings_name"]}</label>
                  <input 
                      type="text" 
                      maxLength="35"
                      {...register(data["settings_name"])} 
                  />
                  </div>
                </div>)
              else if (data["settings_type"] === "boolean")
              return (<div className="col-lg-6 col-sm-3 col-12" key={index}>
                <div className="form-group pt-4">
                  <label>{data["settings_name"]}</label>
                  <div class="checkbox-wrapper-19">
                      <input type="checkbox" id="cbtest-19"  {...register(data["settings_name"])} />
                      <label for="cbtest-19" class="check-box"/>
                    </div>
                  </div>
                </div>)
              else if (data["settings_type"] === "choice")
              return (
                <div className="col-lg-6 col-sm-3 col-12" key={index}>
                  <div className="form-group pt-4">
                    <label>{data["settings_name"]}</label>
                    <select name="cars" id="cars" className="checkInput" {...register(data["settings_name"])}>
                      {data["settings_choice"].map((data, index) => (<option value={data}>{data}</option>))}
                    </select>
                  </div>
                </div>)
            })}
        </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={props.onHide} disabled={settingsloading}>Close</button>
          <button className="btn btn-submit" onClick={()=>SaveSettingsChange(props)} >
          {settingsloading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="white" loading={settingsloading}/> </div> : "Save Changes"}
            </button>
        </Modal.Footer>
      </Modal>
    );
  }

  const SaveSettingsChange = async(modal) => {
    setShowAnimation(false)
    setSettingsLoading(true)
    let tempSettings = SelectedSettings["settings"]
    let FullOutletData = SelectedSettings;
    for (let each in tempSettings){
      if (tempSettings[each]["settings_type"] === "boolean"){
        tempSettings[each]["boolean_value"] = getValues(tempSettings[each]["settings_name"])
      }else{
        tempSettings[each]["settings_value"] = getValues(tempSettings[each]["settings_name"])
      }
    }console.log(tempSettings)
    FullOutletData["settings"] = tempSettings
    const responsedata = await FormSubmitEvent(UpdateOutletDetails,FullOutletData)
    if (responsedata === "updated"){successMessage("Updated OuletSettings")}
    else {errorMessage("Something Gone Wrong")}
    setSettingsLoading(false)
    modal.onHide()
  }

  const ClickedSettingsmenu=(data)=> {
    setModalShow(true)
    for (let each in data["settings"])
    {
      if (data["settings"][each]["settings_type"] === "string")
      {setValue(data["settings"][each]["settings_name"], data["settings"][each]["settings_value"])}
      else if (data["settings"][each]["settings_type"] === "boolean")
      {setValue(data["settings"][each]["settings_name"], data["settings"][each]["boolean_value"])}
      else if (data["settings"][each]["settings_type"] === "choice")
      {setValue(data["settings"][each]["settings_name"], data["settings"][each]["settings_value"])}
      
    }
    setSelectedSettings(data)
    console.log(data)
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>{WorkFlowSpecificNameChanger("outlet")}s</h4>
              
            </div>
          </div>
          {/* /product list */}
          
          <div className="card">
            <div className="card-body">
              <SettingsModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
              />
              
              <div className="table-responsive">

                <Table    
                    className="table datanew dataTable no-footer"      
                    columns={columns}
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
export default ListOutlet;
