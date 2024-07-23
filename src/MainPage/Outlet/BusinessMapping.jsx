import React, { useState,useEffect,useContext } from "react";
import { useLocation ,useNavigate } from "react-router-dom"
import { Table, Switch  } from 'antd';
import "../../EntryFile/antd.css";
import { FormSubmitEvent ,ConstructorEventGet} from "../../Event/ConstructorEvent";
import { AddNewWorkflow,AssignUserToOutlet } from "../../api/Aws-api";
import Swal from "sweetalert2";
import { ClassicSpinner } from "react-spinners-kit";
import { Modal } from "react-bootstrap";
import { useForm } from 'react-hook-form'
import { CreateClientSpecificResources } from "../../api/Aws-api";
import { ApplicationAttributes } from "../../InitialPage/App";
import { SetWorkFlowForApplication, errorMessage,ApplicationLogout,successMessage,WorkFlowSpecificNameChanger } from "../Functions/CommonFunctions";


const BusinessMapping = (props) => {
  const [data,setData] = useState([])
  const [modalAnimation,setModalAnimation] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [loading,setLoading] = useState(false)
  const [skippedMapping,setSkippedMapping] = useState(false)
  const { register, getValues,setValue  } = useForm();
  const [modalShow, setModalShow] = useState(false)
  const loc = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    const {mappingtempalte} = loc.state ? loc.state : {}
    if (mappingtempalte){
      setData(mappingtempalte)
    }
  },[])
  
  const [emailList, setEmailList] = useState([])
  const {OutletCode,B2BCode,OutletName} = useContext(ApplicationAttributes)

  const handleKeyPress = (e) => {
    setModalAnimation(false)
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (e.key === ' ' && getValues("email").trim() !== '' || e.key === 'Enter') {
      if (!emailList.includes(getValues("email").trim().toLowerCase()) && emailRegex.test(getValues("email").trim().toLowerCase())){
      setEmailList([...emailList, getValues("email").trim().toLowerCase()]);}
      setValue("email", "")
    }
  };

  const removeEmail = (email) => {
    const updatedList = emailList.filter((item) => item !== email);
    setEmailList(updatedList);
  };
  
  
  
  const selectedSkip = () => {
    setSkippedMapping(true)
    Swal.fire({
      title: "Select Default Configuration ?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yeas!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      cancelButtonText: "Nope",
      buttonsStyling: !1,
    }).then(function (t) {t.value && setModalShow(true)});
  };

  const handleSwitchChange = (checked, record) => {
    let temp = selectedTemplate[record["workflow_initiator"]] ? selectedTemplate[record["workflow_initiator"]] : []
    const changedDataSet = record["mapping_template"].split(",")
    if (checked === true){temp = temp.concat(changedDataSet)}
    else if (checked === false){temp = temp.filter((item) => !changedDataSet.includes(item))}

    let fullChangedData = selectedTemplate
    if (temp.length > 0){fullChangedData[record["workflow_initiator"]] = temp}
    else {delete fullChangedData[record["workflow_initiator"]]}

    console.log(fullChangedData)
    setSelectedTemplate(fullChangedData)
  };

  const SelectedBuisenessMapping = async () => {
    const params = {
      "selectedTemplates" : selectedTemplate,
      "business_unit" : data["business_unit"]
    }
    //SelectDefaultSettings()//need to remove
    setModalShow(true)
    //const responseData = await FormSubmitEvent("api",params);
    //props.history.push({pathname: "/dream-pos/dashboard"});
    console.log(params)
  }

  const SubmitWorkFlowDetails = async(modal) => {
    setLoading(true)
    //props.history.push({pathname: "/dream-pos/dashboard"})
    const AddNewWorkflowParams = {
      "business_case": data["business_unit"],
      "outlet_code": OutletCode,
      "b2b_code": B2BCode,
      "default_template": [
        "cart",
        "payment"
      ],
      "skip_business_case": false,
      "skip_mapping": skippedMapping,
      "mapping_template": selectedTemplate
    }
    const AssignUserToOutletParams = {
      "mailList" : emailList,
      "b2b_code" : B2BCode,
      "outlet_name" : OutletName,
      "outlet_code" : OutletCode
    }
    const CreateClientSpecificResourcesParams = {"outlet_unique_id" : OutletCode,"business_unit":data["business_unit"]}
    const responseData = await FormSubmitEvent(CreateClientSpecificResources,CreateClientSpecificResourcesParams);
    //const responseData = "ResourcesCreationInitialised"
    console.log(responseData)
    if (responseData === "ResourcesCreationInitialised"){
      const AddNewWorkflowresponseData = await FormSubmitEvent(AddNewWorkflow,AddNewWorkflowParams);
      if (AddNewWorkflowresponseData["statusCode"] === 200){
        SetWorkFlowForApplication(JSON.parse(AddNewWorkflowresponseData["body"])[0])
        const AssignUserToOutletresponseData = await FormSubmitEvent(AssignUserToOutlet,AssignUserToOutletParams);
        if (AssignUserToOutletresponseData["statusCode"] === 200){successMessage("Outlet Mapped Succesfully");ApplicationLogout();navigate("/signIn");successMessage("Please Login Again!")}
      }
    }
    else(errorMessage("Something Went Wrong"))
    //
    //onSubmit(props.history,Nexturi)
    modal.onHide()
    setLoading(false)
  }

  const columns = [
    {
      dataIndex: "mapping_question",
      key: "business_unit",
      width: '80%',
      render: (text, record) => (
        <div className="productimgname">
          <div style={{ fontSize: "15px", marginLeft: "10px" ,color: "black",whiteSpace: 'pre-wrap'}}>
            {record.mapping_question}
          </div>
        </div>
      )
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (_, record) => (
        <Switch style={{whiteSpace: 'pre-wrap'}} checked={record.status} onChange={(checked) => handleSwitchChange(checked, record)} />
      ),
    }
  ];


  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static" 
        animation={modalAnimation}
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <h5>Add user emails associated to this {WorkFlowSpecificNameChanger("outlet")}</h5>
          <div className="form-group pt-4">
            <div >
                {emailList.map((email, index) => (
                <span key={index} className="email-tag">
                    {email}
                    <span className="remove-tag bg-lightgreen" onClick={() => removeEmail(email)}>
                    &times;
                    </span>
                </span>
                ))}
            </div>
            <div className="col-lg-6 col-sm-6 col-12">
            <input 
                type="text" 
                maxLength="35"
                placeholder='Add New User'
                {...register('email')} 
                onKeyPress={handleKeyPress}
            />
        </div>
    </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={()=>SubmitWorkFlowDetails(props)}>Skip</button>
          <button className="btn btn-submit" onClick={()=>emailList.length > 0 ? SubmitWorkFlowDetails(props) : errorMessage("Please Add an Agent and press 'ENTER'")}>Submit</button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {loading ? 
          <div className="spinner">
            <div className="spinner-wrapper">
              <ClassicSpinner size={50} color ="black" loading={loading} />
            </div>
          </div>
           :
           <div>
          <div className="page-header">
            <div className="page-title">
              <h4>Business Mapping</h4>
              <h6>Map your business for this unit</h6>
            </div>
            <div className="page-btn">
            <span className="btn btn-added" onClick={SelectedBuisenessMapping}>
                Next
              </span>
              <span className="btn" onClick={selectedSkip}>
                Skip
              </span>
            </div>
            
          </div>
          {/* product list */}
          <div className="card">
            <div className="card-body">
              {/* /Filter */}
              
              {/* /Filter */}
              <div className="table-responsive">
              <Table
                  className="table datanew dataTable no-footer"
                  columns={columns}
                  dataSource={data["mapping"]}
                  pagination={false}
                  rowKey={(record) => record.mapping_template}
                />
                  <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
              </div>
            </div>
          </div>
          </div>}
          {/* /product list */}
        </div>
      </div>

    </>
  );
};
export default BusinessMapping;
