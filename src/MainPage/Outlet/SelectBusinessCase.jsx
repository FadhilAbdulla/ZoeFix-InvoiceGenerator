import React, { useState,useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {Search } from "../../EntryFile/imagePath";
import { ConstructorEventGet,FormSubmitEvent } from "../../Event/ConstructorEvent";
import { FetchBusinessCase,AddNewWorkflow,CreateClientSpecificResources,AssignUserToOutlet } from "../../api/Aws-api";
import { Table, Radio } from 'antd';
import "../../EntryFile/antd.css";
import { ClassicSpinner } from "react-spinners-kit";
import {errorMessage,SetWorkFlowForApplication,ApplicationLogout,successMessage,WorkFlowSpecificNameChanger} from "../../MainPage/Functions/CommonFunctions";
import Swal from "sweetalert2";
import { ApplicationAttributes } from "../../InitialPage/App";
import { Modal } from "react-bootstrap";
import { useForm } from 'react-hook-form'


const SelectBusinessCase = (props) => {
  const [data,setData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [loading,setLoading] = useState(false)
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const { register, getValues,setValue  } = useForm();
  const {OutletCode,B2BCode,OutletName} = useContext(ApplicationAttributes)
  const [modalAnimation,setModalAnimation] = useState(true)
  const [emailList, setEmailList] = useState([]);
  const [modalShow, setModalShow] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    async function fetchdata(){
      setLoading(true)
      const responseData = await ConstructorEventGet(FetchBusinessCase);
      setData(responseData ? responseData : [])
      setFilteredData(responseData ? responseData : [])
      console.log(responseData);setLoading(false)}
    fetchdata()
  },[])

  console.log(emailList)

  const handleRowSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

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

  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: handleRowSelectChange,
  };

  const handleSearch = (e) => {
    const searchInput = e.target.value.toLowerCase();
    setSearchValue(searchInput);
    // Filter the data source based on search input value
    const filtered = data.filter(record =>(record.business_unit.toLowerCase().includes(searchInput)||record.description.toLowerCase().includes(searchInput)));
    setFilteredData(filtered);
  };

  const SelectedBuisenessCase = () => {
    const selectedData = data.find((item) => item.business_unit === selectedRowKeys[0])
    navigate("/dream-pos/outlet/businessmapping",{state: {mappingtempalte : selectedData }});
    console.log(selectedData)
  }
  const selectedSkip = () => {
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
  const SubmitWorkFlowDetails = async() => {
    setLoading(true)
    setModalShow(false)
    const AddNewWorkflowParams = {
      //"business_case": data["business_unit"],
      "outlet_code": OutletCode,
      "b2b_code": B2BCode,
      "default_template": [
        "cart",
        "payment"
      ],
      "skip_business_case": true,
      "skip_mapping": false,
    }
    const AssignUserToOutletParams = {
      "mailList" : emailList,
      "b2b_code" : B2BCode,
      "outlet_name" : OutletName,
      "outlet_code" : OutletCode
    }
    const CreateClientSpecificResourcesParams = {"outlet_unique_id" : OutletCode,"business_unit":data["business_unit"]}
    const responseData = await FormSubmitEvent(CreateClientSpecificResources,CreateClientSpecificResourcesParams);
    console.log(responseData)
    if (responseData === "ResourcesCreationInitialised"){
      const AddNewWorkflowresponseData = await FormSubmitEvent(AddNewWorkflow,AddNewWorkflowParams);
      if (AddNewWorkflowresponseData["statusCode"] === 200){
        SetWorkFlowForApplication(JSON.parse(AddNewWorkflowresponseData["body"])[0])
        const AssignUserToOutletresponseData = await FormSubmitEvent(AssignUserToOutlet,AssignUserToOutletParams);
        if (AssignUserToOutletresponseData["statusCode"] === 200){
          successMessage("Outlet Mapped Succesfully");ApplicationLogout();
          navigate("/signIn");successMessage("Please Login Again!")}
      }
    }
    setLoading(false)
  }

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
          <button className="btn btn-secondary" onClick={SubmitWorkFlowDetails}>Skip</button>
          <button className="btn btn-submit" onClick={()=>emailList.length > 0 ? SubmitWorkFlowDetails() : errorMessage("Please Add an Agent and press 'ENTER'")}>Submit</button>
        </Modal.Footer>
      </Modal>
    );
  }

  const columns = [
    {
      title: "Business Case ",
      render: (record) => (
        <React.Fragment>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <div style={{ fontSize: "15px" ,color: "black"}}>
              {record.business_unit}
            </div>
            <br />
              {record.description}
          </div>
        </React.Fragment>
      ),
      responsive: ["xs"]
    },
    {
      title: "Business Case",
      dataIndex: "business_unit",
      key: "business_unit",
      width: '50%',
      render: (text, record) => (
        <div className="productimgname">
          <div style={{ fontSize: "15px", marginLeft: "10px" ,color: "black",whiteSpace: 'pre-wrap'}}>
            {record.business_unit}
          </div>
        </div>
      ),
      sorter: (a, b) => a.business_unit.length - b.business_unit.length,
      responsive: ["sm"]
    },
    
    {
      title: "Description",
      dataIndex: "description",
      key: 'description',
      width: '100%',
      render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
      responsive: ["sm"]
    }
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Business Case</h4>
              <h6>Select the business you run on this unit</h6>
            </div>
            <div className="page-btn">
            
              <span className="btn btn-added" onClick={()=>selectedRowKeys ? SelectedBuisenessCase() : errorMessage("Please select any of the Business Case")}>
                Next
              </span>
              <span className="btn" onClick={selectedSkip}>
                Skip
              </span>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
            
              {/* /Filter */}
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      className="form-control form-control-sm search-icon"
                      type="text"
                      placeholder="Search..."
                      value={searchValue}
                      onChange={handleSearch}
                    />
                    <span className="btn btn-searchset">
                      <img src={Search} alt="img" />
                    </span>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
              <Table
                  className="table datanew dataTable no-footer"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={filteredData}
                  rowKey={(record) => record.business_unit}
                  pagination={false}
                  loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}} 

                />
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
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
export default SelectBusinessCase;
