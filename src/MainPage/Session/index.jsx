//it is the index file of session 
//from here we route the uri according to the workflow
import React , {useState ,useRef, createContext,useEffect} from 'react'
import { useNavigate, Route, Routes,Navigate,useLocation } from 'react-router-dom';
import Sales_person from './Sales_person';
import Commission_agent from './Commission_agent';
import Customer from './Customer';
import Cart from './Cart';
import Payment from './Payment';
import Session_close from './Session_close';
import AddCommission_agent from './AddCommission_agent';
import AddSales_person from './AddSales_person';
import Appointment from './Appointment'
import Select_desk from './Select_desk'
import Activesession from './Activesession';
import MatchingModule from './MoneyTransfer/MatchingModule';
import CashPayment from './MoneyTransfer/CashPayment';
import AddCustomer from './AddCustomer';
import TreatmentPlan from './Dental/TreatmentPlan';
import Inspection from './Inspection/Inspection';
import Training from './Training/Training';
import InspectionReportHeader from './Inspection/InspectionReportHeader';
import InspectionReportTable from './Inspection/InspectionReportTable';
import InspectionReportComments from './Inspection/InspectionReportComments';
import InspectionReportReview from './Inspection/InspectionReportReview';
import EditInspectionReportHeader from './Inspection/EditInspectionReportHeader';
import EditInspectionReportTable from './Inspection/EditInspectionReportTable';
import EditInspectionReportComments from './Inspection/EditInspectionReportComments';
import EditInspectionReportReview from './Inspection/EditInspectionReportReview';
import EditInspectionReportImage from './Inspection/EditInspectionReportImage';
import ListInspection from './Inspection/ListInspection';
import PullInspectionTemplate from './Inspection/PullInspectionTemplate';
import PrintSessionReciept from './PrintSessionReciept';
import { ForwardUriFetchFunction } from '../Functions/CommonFunctions';




export const SalesAttributes = createContext();

function Session  () {

//declaring the sales attribute
    const [sales_persion_name, setSales_persion_name] = useState("");
    const [sales_persion_id, setSales_persion_id] = useState("");
    const [commission_agent_name, setCommission_agent_name] = useState("");
    const [commission_agent_id, setCommission_agent_id] = useState("");
    const [customer_name, setCustomer_name] = useState("");
    const [customer_id, setCustomer_id] = useState("");
    const [session_id, setSession_id] = useState("");
    const [cart_id, setCart_id] = useState("");
    const [payment_type, setPayment_type] = useState("");
    const [total_sale, setTotal_sale] = useState("");
    const [appointment_id, setAppointment_id] = useState("");
    const [appointment_starttime,setAppointment_starttime] = useState("");
    const [desk_id, setDesk_id] = useState("");
    const [desk_name, setDesk_name] = useState("");
    const [OrderOfExecution, setOrderOfExecution] = useState(1);
    const [InitiatorCode, setInitiatorCode] = useState("");
    const [InspectionReportHeaderData,setInspectionReportHeaderData] = useState([])
    const [InspectionReportTableData,setInspectionReportTableData] = useState([])
    const [InspectionReportCommentsData,setInspectionReportCommentsData] = useState([])
    const [InspectionReportImage,setInspectionReportImage] = useState([])
    const [InspectionReportId, setInspectionReportId] = useState("")
    const loc = useLocation()
    const url = "/dream-pos/session"
    const navigate = useNavigate()
    const uri = useRef(null);

    

    useEffect(()=>{
        const { initiator } = loc.state ? loc.state : {};
        if (initiator) {uri.current = ForwardUriFetchFunction(OrderOfExecution,initiator);setInitiatorCode(initiator);}
        if (loc.pathname === url){
            if (uri.current !== "noWorkFlow"){navigate(`${url}/${uri.current}`,{state: { "order_of_execution": OrderOfExecution + 1 } })}
            else{navigate("/dream-pos/settings")}
        }
    })

    return(
        <SalesAttributes.Provider value={{
                sales_persion_name,sales_persion_id,commission_agent_name,commission_agent_id,customer_name,customer_id,session_id,cart_id,payment_type,total_sale,appointment_id,InspectionReportImage,
                desk_id,desk_name,appointment_starttime,OrderOfExecution,InitiatorCode,InspectionReportHeaderData,InspectionReportTableData,InspectionReportCommentsData,InspectionReportId, 
                setSales_persion_name,setSales_persion_id,setCommission_agent_name,setCommission_agent_id,setCustomer_name,setCustomer_id,setSession_id,setCart_id,setPayment_type,setTotal_sale,setAppointment_id,setInspectionReportImage,
                setDesk_id,setDesk_name,setAppointment_starttime,setOrderOfExecution,setInitiatorCode,setInspectionReportHeaderData,setInspectionReportTableData,setInspectionReportCommentsData,setInspectionReportId,
            }}>
            <Routes>           
                <Route path="/sales_person" element={<Sales_person/>} />
                <Route path="/commission_agent" element={<Commission_agent/>} /> 
                <Route path="/customer" element={<Customer/>} /> 
                <Route path="/cart" element={<Cart/>} /> 
                <Route path="/payment" element={<Payment/>} /> 
                <Route path="/addcommission_agent" element={<AddCommission_agent/>} /> 
                <Route path="/addsales_person" element={<AddSales_person/>} />
                <Route path="/appointment" element={<Appointment/>} />
                <Route path="/session_close" element={<Session_close/>} /> 
                <Route path="/activesession" element={<Activesession/>} /> 
                <Route path="/appointment_desk" element={<Select_desk/>} /> 
                <Route path="/cash_payment" element={<CashPayment/>} /> 
                <Route path="/addcustomer" element={<AddCustomer/>} /> 
                <Route path="/matching_module" element={<MatchingModule/>} /> 
                <Route path="/treatment_plan" element={<TreatmentPlan/>} /> 
                <Route path="/inspection" element={<Inspection/>} /> 
                <Route path="/training" element={<Training/>} /> 
                <Route path="/inspection_report_header" element={<InspectionReportHeader/>} />
                <Route path="/inspection_report_table" element={<InspectionReportTable/>} />
                <Route path="/inspection_report_comments" element={<InspectionReportComments/>} />
                <Route path="/inspection_report_review" element={<InspectionReportReview/>} />
                <Route path="/edit_inspection_report_header" element={<EditInspectionReportHeader/>} />
                <Route path="/edit_inspection_report_table" element={<EditInspectionReportTable/>} />
                <Route path="/edit_inspection_report_comments" element={<EditInspectionReportComments/>} />
                <Route path="/edit_inspection_report_review" element={<EditInspectionReportReview/>} />
                <Route path="/edit_inspection_report_image" element={<EditInspectionReportImage/>} />
                <Route path="/list_inspection" element={<ListInspection/>} />
                <Route path="/pull_inspection_template" element={<PullInspectionTemplate/>}/>
                <Route path="/sessionReciept" element={<PrintSessionReciept/>}/>
            </Routes>
        </SalesAttributes.Provider>

    )
}

export default Session