import React,{useEffect,useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "./Sidebar/LoadingSpinner";
import { FetchUserOuletDetails } from '../api/Aws-api';
import { ConstructorEventGet } from '../Event/ConstructorEvent';
import { SetWorkFlowForApplication, errorMessage } from '../MainPage/Functions/CommonFunctions';
import { ApplicationAttributes } from './App';
import { Modal } from "react-bootstrap";


const Configuring = (props) => {
    const [outletSelection,setOutletSelection] = useState(false)
    const [modalAnimation,setModalAnimation] = useState(true)
    const [selectdata,setSelectdata] = useState()
    const [UserData,setUserData] = useState()
    const navigate = useNavigate()
    const {setB2BCurrencyCode,setRoundOff,setOutletCode,setB2BCode,setB2BName,setB2BCountry,setB2BCurrency,setB2BUser,setAgentCode,setOutletName} = useContext(ApplicationAttributes)
    useEffect(()=>{
        const LocalStorageUser = JSON.parse(localStorage.getItem('UserData'))
        //const dataOfOutlet = JSON.parse(localStorage.getItem('OutletData'))
        setUserData(LocalStorageUser)
        if (LocalStorageUser && LocalStorageUser["agent_outlet"].length > 1){ setOutletSelection(true) }
        else if (LocalStorageUser && LocalStorageUser["agent_outlet"].length === 1){ FetchOutlet(LocalStorageUser["agent_outlet"][0]["outlet_code"],LocalStorageUser)}
        else if (LocalStorageUser && LocalStorageUser["agent_outlet"].length === 0) {
          console.log("no Outlet for the user");
          if(LocalStorageUser && LocalStorageUser["b2b_code"]){
            setB2BUser(true);setB2BCode(LocalStorageUser["b2b_code"]);setB2BName(LocalStorageUser["agent_name"])
            navigate("/dream-pos/outlet/addoutlet");
          }
          else { navigate("/error401")}
        }
      },[])
    const FetchOutlet = async(code,userdata) => {
      console.log(code)
        if (outletSelection) {setOutletSelection(false)}
        const responseData = await ConstructorEventGet(FetchUserOuletDetails,{outlet_code: code});
        console.log(responseData)
        if (responseData[0] === "noWorkFlowSelected"){setOutletSelection(true);errorMessage("Currently We are facing some issue on opening this outlet, please try again later")}
        else {
          localStorage.setItem('OutletData', JSON.stringify(responseData))
          SetWorkFlowForApplication(responseData["workflow"])
          SaveDataToContextState(responseData,userdata)
        }
    }
    const SaveDataToContextState = (outletdata,userdata) => {
      console.log(outletdata,userdata)
      const roundoffSetting = outletdata["outlet"]["settings"].find(setting => setting.settings_name === "ROUNDOFF");
      const userOutletDetails = userdata["agent_outlet"].find(item => item.outlet_code === outletdata["outlet"]["outlet_unique_id"])
      setRoundOff(roundoffSetting.settings_value)
      setOutletCode(outletdata["outlet"]["outlet_unique_id"])
      setOutletName(outletdata["outlet"]["outlet_name"])
      setB2BName(userdata["agent_name"])
      setAgentCode(userdata["agent_code"])
      if (userOutletDetails["agent_role"] === "B2BUSER"){setB2BUser(true);setB2BCode(userdata["b2b_code"])}
      else {setB2BUser(false);setB2BCode(outletdata["outlet"]["b2b_code"])}
      navigate("/dream-pos/dashboard")
    }

    const dataSelected = (e) =>{
        setModalAnimation(false)
        setSelectdata(e.target.value)

    }
    function MyVerticallyCenteredModal(props) {
        return (
          <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static" 
            animation={modalAnimation}
            
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Select Outlet
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Select Your Perfered Outlet</h5>
                <div className="col-lg-12 col-sm-12 col-12" >
                  <div className="form-group pt-4">
                    <label>Outlet</label>
                    <select value={selectdata} className="checkInput" onChange={dataSelected}>
                    <option value="">Select An Outlet</option>
                      {UserData && UserData["agent_outlet"].map((data, index) => (<option key={index} value={data["outlet_code"]}>{data["name"]}</option>))}
                    </select>
                  </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-submit" onClick={() => selectdata && FetchOutlet(selectdata,UserData)}>Submit</button>
            </Modal.Footer>
          </Modal>
        );
      }
    return (
        <div>
            {outletSelection ? "" : <LoadingSpinner/>}
            <MyVerticallyCenteredModal
                    show={outletSelection}
                    onHide={() => setOutletSelection(false)}
                  />
        </div>
    );
}

export default Configuring;
