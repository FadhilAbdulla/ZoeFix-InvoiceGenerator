import React,{useEffect, useState,useContext} from 'react';
import { Table,Checkbox } from 'antd';
import { errorMessage } from '../../Functions/CommonFunctions';
import { useNavigate } from 'react-router-dom';
import { ApplicationAttributes } from "../../../InitialPage/App";
import { FetchInspectionTemplates } from '../../../api/Aws-api';
import { ConstructorEventGet } from '../../../Event/ConstructorEvent';
import { SimpleSwalNotification } from '../../Functions/CommonFunctions';



const PullInspectionTemplate = () => {
    const LocalStorageUser = JSON.parse(localStorage.getItem('UserData'))
    const [AssignedOutlets,setAssignedOutlets] = useState([])
    const [SelectedOutlets,setSelectedOutlets] = useState("")
    const [TemplateList,setTemplateList] = useState([])
    const [CurrentTemplateList,setCurrentTemplateList] = useState([])
    const [CurrentTemplateNames,setCurrentTemplateNames] = useState([])
    const {OutletCode} = useContext(ApplicationAttributes)
    const [loading,setLoading] = useState(false)
    const [ShowSaveButton,setShowSaveButton] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        if (LocalStorageUser && LocalStorageUser["agent_outlet"]){ 
            setAssignedOutlets(LocalStorageUser["agent_outlet"]) ;console.log(LocalStorageUser["agent_outlet"])
            if (LocalStorageUser["agent_outlet"].length === 1){
                errorMessage("You Need Multiple Projects for performing this Actions!")
                navigate("/dream-pos/outlet/addoutlet")
            }
            else {fetchdata()}
        }
    },[])

    const fetchdata = async() => {
        const fetchrequest = {"client_code" : OutletCode };
        const responseData = await ConstructorEventGet(FetchInspectionTemplates,fetchrequest);
        console.log(responseData)
        if (!responseData.errorMessage){
            setCurrentTemplateList(responseData)
            setCurrentTemplateNames(responseData.map((item) => FindTemplateName(item.HeaderData)))
        }
        else {
            setCurrentTemplateList([])
        }
        setLoading(false)
    }

    const ListTemplates = async () => {
        const fetchrequest = {"client_code" : SelectedOutlets };
        const responseData = await ConstructorEventGet(FetchInspectionTemplates,fetchrequest);
        console.log(responseData)
        setTemplateList(responseData.errorMessage ? [] : responseData)
        setLoading(false)
    }

    const columns = [
        {
            dataIndex: 'checked',
            render: (_, record) => (
              <Checkbox
                checked={record.checked}
                onChange={(e) => handleCheckboxChange(record["template_id"], e.target.checked)}
              />
            ),
          },
        {
            title: "Template Name",
            dataIndex: "HeaderData",
            sorter: (a, b) => FindTemplateName(a.HeaderData).length - FindTemplateName(b.HeaderData).length,
            render: (text, record) => <div className="divHoverForTables">{FindTemplateName(text)}</div>
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

    const handleCheckboxChange = (key,checked) => {
        setShowSaveButton(true)
        let temp = TemplateList
        let SingleItemTemp = temp.find((item) => item["template_id"] === key)
        if (checked){SingleItemTemp["checked"] = true}
        else if (!checked){SingleItemTemp["checked"] = false}
        let remainingdata = temp.filter((item) => item["template_id"] !== key)
        setTemplateList([...remainingdata,SingleItemTemp])
    }

    const CheckRepeatedTemplates = () => {
        let temp = []
        for (let templates of TemplateList){
            if (templates && templates["checked"]){
                if (CurrentTemplateNames.includes(FindTemplateName(templates["HeaderData"]))){

                    temp.push(FindTemplateName(templates["HeaderData"]))
                }
            }

        }
        return temp
    }
    const SelectedPullTemplates =async () => {
        const isRepetation = CheckRepeatedTemplates()
        if (isRepetation.length > 0){
            const resultString = isRepetation.join(", ");
            const response = await SimpleSwalNotification("Do you want to replace these Templates ?","Templates :" + resultString)
            console.log(response, "response from swal alert")
            if (response){saveDataToCloud()}
        }
        else {console.log("noRepeatedTemplates");saveDataToCloud()}
    }

    const saveDataToCloud = () => {
        navigate("/dream-pos/session/inspection")
    }

    return (
    <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Pull Inspection From Another Project</h4>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body row">
                <div className="col-lg-6 col-sm-6 col-12" >
                    <div className="form-group">
                        <label >Select A Project From Which The template should be Imported <span style={{color: "red"}}>*</span></label>
                        <select value={SelectedOutlets} className="checkInput "  onChange={(e) => setSelectedOutlets(e.target.value) }>
                        <option value="" >Select A Project</option>
                        {AssignedOutlets && AssignedOutlets.map((data, index) => {
                            if (data["outlet_code"] !== OutletCode){
                                return (
                                <option value={data["outlet_code"]} key={index}>{data["name"]}</option>
                                )
                            }
                        })}
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-sm-6 col-12 mt-4 pl-12" >
                    <button className='btn btn-secondary' onClick={SelectedOutlets && ListTemplates}> List Templates</button>
                </div>
                <div className="col-lg-12 col-sm-12 col-12 mt-4" >
                    <div>
                        <Table
                            className="table datanew dataTable no-footer"      
                            columns={columns}
                            dataSource={TemplateList}      
                            pagination={false}
                        />
                    </div>
                </div>
                <div className="col-lg-12 col-sm-12 col-12 mt-8" >
                    {ShowSaveButton ? <button className='btn btn-primary' onClick={SelectedPullTemplates}> Pull Selected Templates</button> : ""}
                </div>
            </div>
          </div>
        </div>
    </div>
    );
}

export default PullInspectionTemplate;
