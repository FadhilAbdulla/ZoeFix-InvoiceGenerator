//Template For Appointmnet using FullCalendar Plugins
//Atributes -> Events,start time,end time,duration

import React, { useState,useRef, useEffect ,useContext} from 'react';
import { useLocation,useNavigate,Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../../assets/plugins/fullcalendar/fullcalendar.min.css"
import {WorkFlowSpecificNameChanger,ForwardUriFetchFunction,GetDateTime,CheckWorkFlowCreatingSession,FetchWorkingHours,errorMessage} from '../Functions/CommonFunctions'
import {AddNewAppointmentData,AddSession_Sessiontable,FetchAppointmentDetailsForListing,guidedata_fetch_api,UpdateAppointmentDateChange} from '../../api/Aws-api';
import { CircleSpinner } from "react-spinners-kit";
import {FormSubmitEvent,ConstructorEventGet,ConstructorEventPost} from '../../Event/ConstructorEvent'
import {SalesAttributes} from './index'
import { ApplicationAttributes } from "../../InitialPage/App";
import {PlusIcon,search_whites} from "../../EntryFile/imagePath";
import { Modal } from "react-bootstrap";



const Appointment = (props) => {
  const [appointment_menu,setAppointment_menu] = useState(true)
  const [ClickedProceed,setClickedProceed] = useState(false)
  const [SaveChanges,setSaveChanges] = useState(false)
  const [SaveChangesLoading,setSaveChangesLoading] = useState(false)
  const [selectevent,setSelectevent] = useState()
  const { register, getValues,setValue } = useForm();
  const [events, setEvents] = useState([])
  const [Filteredevents, setFilteredEvents] = useState([])
  const [salesPersonList, setSalesPersonList] = useState([])
  const [ChangedEventList, setChangedEventList] = useState([])
  const [salesPerson,setSalesPerson] = useState()
  const [loading,setLoading] = useState(false)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const loc = useLocation()
  const uri = useRef(null);
  const {sales_persion_name,sales_persion_id,commission_agent_name,commission_agent_id,desk_id,desk_name,InitiatorCode,
    setAppointment_id,customer_id,setAppointment_starttime,customer_name,setSession_id,setSales_persion_id,setSales_persion_name} = useContext(SalesAttributes)
  const {OutletCode} = useContext(ApplicationAttributes)
  const date = GetDateTime()
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(true)
  const [modalShow, setModalShow] = useState(false)
  const [ResheduleDateFrom,setResheduleDateFrom] = useState()
  const [ResheduleDateTo,setResheduleDateTo] = useState()


  useEffect(()=>{
    const {order_of_execution} = (loc.state ? loc.state : {})
    if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode);}
    fetchdata()
    setLoading(true)
  },[])
  
  const fetchdata = async() => {
    const responseData = await ConstructorEventGet(FetchAppointmentDetailsForListing,{"client_code" : OutletCode });
    SetOldAppointmentstocalender(responseData)
    const SalesPersonResponseData = await ConstructorEventPost(guidedata_fetch_api,{"tablename" : OutletCode +"_user"});
    let salespersonArray = SalesPersonResponseData.filter(data => data.User_type == "sales_person");
    setSalesPersonList(salespersonArray)
    setLoading(false)
  }


const SetOldAppointmentstocalender = (data) => {
  let NewArray = []
  for (let i in data){
    const RawData = {
      title: data[i]["customer_name"],
      customer_id : data[i]["customer_id"],
      start: Date.parse(data[i]["start_time"].replace(" ", "T")),
      end: Date.parse(data[i]["end_time"].replace(" ", "T")),
      className: data[i]["appointment_status"] === "Sheduled" ? "bg-Coral" : data[i]["appointment_status"] === "InProgress" ? "bg-SoftLavender" : data[i]["appointment_status"] === "Completed" ? "bg-Teal" : "bg-warning",
      eventStatus: data[i]["appointment_status"],
      notes: data[i]["notes"],
      id: data[i]["appointment_id"],
      sales_person_id : data[i]["sales_person_id"],
      sales_person_name : data[i]["sales_person_name"]
    }
    console.log(RawData)
    NewArray.push(RawData)
  }
  setEvents(NewArray)
  setFilteredEvents(NewArray)
}
//default function of fullcalender for rendering event content
  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.title}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }
  //function for creating new appointment in the local state when the form is filled and submitted
  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    if (customer_id){
      const dateObj = new Date(getValues("appointment_date")+"T"+getValues("appointment_time")+":00")
      dateObj.setMinutes(dateObj.getMinutes() + parseInt(getValues("duration")))
      const newTime = dateObj.toTimeString().slice(0, 8);
      const RawData = {
        title: customer_name,
        start: Date.parse(getValues("appointment_date")+"T"+getValues("appointment_time")+":00"),
        end: Date.parse(getValues("appointment_date")+"T"+newTime),
        className: "bg-danger",
        eventStatus: "Sheduled",
        notes: getValues("notes"),
        id: Date.now()
      }
      console.log(RawData,"newFormSubmit")
      setEvents([...events,RawData])
      const newData = RawData
      newData["extendedProps"] = {eventStatus : newData["eventStatus"],notes : newData["notes"] }
      newData["start"] = getValues("appointment_date")+" "+getValues("appointment_time")+":00"
      newData["end"] = (getValues("appointment_date")+" "+newTime)
      newData["id"] = newData["id"].toString()
      //setAppointment_menu(false)
      addDataToCloud(newData)
    }
  }
//set the values of the date which is clicked into the create new appointment form
  const handleDateSelect = (selectInfo) => {
    setAppointment_menu(true)
    const datetime = new Date(selectInfo.startStr);
    const endTime = new Date(selectInfo.endStr)
    const durationOption = checkTheSuitableDuration((endTime - datetime) / 1000 / 60)
    const date = ChangeTimestampToDesiredDate(selectInfo.startStr);
    const time24h = datetime.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setValue('appointment_date', date)
    if (selectInfo.allDay){setValue('appointment_time', "09:00");setValue('duration',"15")}
    else {setValue('appointment_time', time24h);setValue('duration',durationOption)}
    //document.querySelector('#appointment_date').value = date
    //document.querySelector('#appointment_time').value = time24h
  };
  const checkTheSuitableDuration = (input) => {
    const values = [15, 30, 45, 60, 120, 180, 240];
    let result = 15; // Initialize the result variable
    for (let i = 0; i < values.length; i++) {
      if (values[i] <= input) {
        result = values[i]; // Update the result with the current value
      } else {
        break; // Exit the loop if the current value exceeds the input
      }
    }
    return result
  }
  //Go to the event page whenever an event is clicked
  const handleEventClick = (clickInfo) => {
    setAppointment_menu(false)
    const data = clickInfo.event.toPlainObject()
    setSelectevent(data)
    console.log(data)
  };

  const ConvertToActualTimeFormat = (olddate) => {
    const date = olddate ? olddate.split("+")[0].replace("T", " ") : olddate
    if (!olddate) {console.log("issue")}
    return date
  }
  const SelectedAnEventAndProceeded = () => {
    console.log("clicked proceed")
    setLoading(true)
    const Temp = selectevent
    for (let eachevent in events){
      if (events[eachevent]["id"] == Temp["id"]){
        const convertedTime = ConvertToActualTimeFormat(Temp["start"]);
        Temp["start"] = convertedTime
        console.log(Temp)
        addNewSessionForProceededEvent(Temp)
      }
    }
  }

  const eventChanged = (data) =>{
    const event = data.event.toPlainObject()
    const temp = {
      "appointment_id" : event.id,
      "startTime" : ConvertToActualTimeFormat(event.start),
      "endTime" : ConvertToActualTimeFormat(event.end),
    }
    const tempArray = ChangedEventList
    const CheckDuplication = tempArray.findIndex(data => data.appointment_id === event.id)
    if (CheckDuplication !== -1){
      tempArray[CheckDuplication]["startTime"] = temp["startTime"]
      tempArray[CheckDuplication]["endTime"] = temp["endTime"]
    }
    else{tempArray.push(temp)}
    setChangedEventList(tempArray)
    setSaveChanges(true)
  }

  //change event status when an event is selected and proeceed to cart
  const SaveEventStatusUpdate = (selectevent) => {
    let newarray = []
    for (let eachevent in events){
      if (events[eachevent]["id"] == selectevent["id"]){
        console.log(events[eachevent]["id"])
        newarray[eachevent] = {
          id: events[eachevent]["id"],
          title: events[eachevent]["title"],
          start: events[eachevent]["start"],
          end: events[eachevent]["end"],
          notes: events[eachevent]["notes"],
          eventStatus: "Sheduled",
          className: 'bg-primary' 
        }
      }
      else{
        newarray[eachevent] = events[eachevent]
      }
    }
    setEvents(newarray)
  }
//add the appointement data to cloud
  const addDataToCloud = async (selectevent) =>{
    SaveEventStatusUpdate(selectevent)
    setLoading(true)
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
          "start_time": selectevent.start,
          "end_time" : selectevent.end,
          "customer_id" : customer_id,
          "customer_name" : customer_name,
          "sales_person_id" : sales_persion_id,
          "sales_person_name" : sales_persion_name,
          "notes" : selectevent.extendedProps.notes,
          "appointment_status" : "Sheduled"
    }}};
    const responseData = await FormSubmitEvent(AddNewAppointmentData,formData);
    setAppointment_starttime(selectevent.start)
    setAppointment_id(responseData[0])
    if (ClickedProceed){
      if (CheckWorkFlowCreatingSession(parseInt(OrderOfExecution)-1)){addNewSessionDataToCloud(responseData[0],selectevent)}
      else {navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }})}
    }
    else {navigate("/dream-pos/dashboard")}
    
  }
  const addNewSessionForProceededEvent= async (selectedevent) =>  {
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "customer_id" : selectedevent["extendedProps"]["customer_id"],
        "customer_name" : selectedevent["title"],
        "session_status" : true,
        "appointment_id" : selectedevent["id"],
        "appointment_starttime": selectedevent["start"],
        "session_startDateTimeStamp" : date,
        "sales_person_name" : selectedevent["extendedProps"]["sales_person_name"],
        "sales_person_id" : selectedevent["extendedProps"]["sales_person_id"],
        "commission_agent_name" : commission_agent_name,
        "commission_agent_id" : commission_agent_id,
        "desk_id" : desk_id,
        "desk_name" : desk_name
    }}}
    console.log(formData,"formdata")
    const responseData = await FormSubmitEvent(AddSession_Sessiontable,formData);
    console.log(responseData,"from addSession")
    setSession_id(responseData[0])
    navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }})
    setLoading(false)
  }

  const addNewSessionDataToCloud = async (appointment_id,selectevent) =>  {
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "customer_id" : customer_id,
        "customer_name" : customer_name,
        "session_status" : true,
        "appointment_id" : appointment_id,
        "appointment_starttime": selectevent.start,
        "session_startDateTimeStamp" : date,
        "sales_person_name" : sales_persion_name,
        "sales_person_id" : sales_persion_id,
        "commission_agent_name" : commission_agent_name,
        "commission_agent_id" : commission_agent_id,
        "desk_id" : desk_id,
        "desk_name" : desk_name,
    }}};

    const responseData = await FormSubmitEvent(AddSession_Sessiontable,formData);
    setSession_id(responseData[0])
    navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }})
    setLoading(false)
  }

  const ChangedSalesPerson = (salesPersonData) => {
    if (salesPersonData === "ALL"){
      setFilteredEvents(events)
      setSales_persion_name()
      setSales_persion_id()
    }
    else {
      let newArray = []
      setSales_persion_name(salesPersonData.split("&")[0])
      setSales_persion_id(salesPersonData.split("&")[1])
      for (let eachevent in events){
        if (events[eachevent]["sales_person_id"] === salesPersonData.split("&")[1]){
          newArray.push(events[eachevent])
        }
      }
      setFilteredEvents(newArray)
    }
  }
  const UpdateTheAppointmentDateChange = async(data) => {
    setSaveChangesLoading(true)
    const responseData = await FormSubmitEvent(UpdateAppointmentDateChange ,{"client_code": OutletCode, "appointmentChangeData" : data });
    if (responseData === "updation_Success"){setChangedEventList([]);setSaveChanges(false);fetchdata()}
    else(errorMessage("Something Went Wrong"))
    setSaveChangesLoading(false)
    setModalShow(false)
  }

  const ChangeTimestampToDesiredDate = (timestamp) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const data1 =  new Date(timestamp).toLocaleDateString('en-IN', options).split("/")
    return data1[2] + "-" + data1[1] + "-" + data1[0]
  }
  

  const ReSheduleEventsOfASpecificDay = () => {
    const tempArray = []
    const FetchTimeFromTimeStamp = (timeStamp) => {return new Date(timeStamp).toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ":00"}
    const EventsOfThatSpecificDay = events.filter((data) => ChangeTimestampToDesiredDate(data.start) === ResheduleDateFrom)
    console.log(EventsOfThatSpecificDay)
    for (let eachevent of EventsOfThatSpecificDay){
      const temp = {
        "appointment_id" : eachevent.id,
        "startTime" : ResheduleDateTo + " " + FetchTimeFromTimeStamp(eachevent.start),
        "endTime" : ResheduleDateTo + " " + FetchTimeFromTimeStamp(eachevent.end),
      }
      tempArray.push(temp)
    }
    console.log(tempArray,"temArray")
    UpdateTheAppointmentDateChange(tempArray)
  }

  function ResheduleModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static" 
        animation={false}
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reshedule Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

              <div className="form-group">
                <label>Reshedule From : </label>
                  <input 
                      type="date" 
                      className='time-input'
                      value={ResheduleDateFrom}
                      onChange={(e) => setResheduleDateFrom(e.target.value)}
                  />
              </div>
              <div className="form-group">
                <label>Reshedule To : </label>
                  <input 
                      type="date" 
                      className='time-input'
                      value={ResheduleDateTo}
                      onChange={(e) => setResheduleDateTo(e.target.value)}
                  />
              </div>

        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={props.onHide} disabled={SaveChangesLoading}>Close</button>
          <button className="btn btn-submit" onClick={ResheduleDateFrom && ResheduleDateTo && ReSheduleEventsOfASpecificDay} >
          {SaveChangesLoading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="white" loading={SaveChangesLoading}/> </div> : "Save Changes"}
            </button>
        </Modal.Footer>
      </Modal>
    );
  }

  const WorkingHours = FetchWorkingHours()
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row align-items-center w-100">
              <div className="col-lg-9 col-sm-12">
                <h3 className="page-title" >Appointment View</h3>
                <CircleSpinner size={20} color ="orange" loading={loading} />
              </div>
              {appointment_menu ? 
              ""
              :
              
                <div className="col-lg-3 col-sm-12 page-btn">
                  <div className="btn btn-primary" onClick={()=>setAppointment_menu(true)}>
                    Add New Appointment 
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="row">

            <div className="col-lg-8 col-md-12">
              <div className="card bg-white">
                <div className="card-body">
                <ResheduleModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  />
                  <div>
                    <FullCalendar
                      plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
                      headerToolbar={{
                        right: "customButton prev,next today,dayGridMonth,timeGridWeek",
                      }}
                      customButtons= {{
                        customButton: {
                          text: 'Reshedule',
                          click: function() {
                            // Custom button click event handler
                            setModalShow(true)
                          }
                        }
                      }}
                      initialView='timeGridWeek'
                      slotDuration="00:15:00"
                      slotMinTime={WorkingHours.split("&")[0]}
                      slotMaxTime={WorkingHours.split("&")[1]}
                      dayMaxEvents={true}
                      weekends={true}
                      selectable={true}
                      editable={true}
                      selectMirror={true}
                      eventChange={(clickInfo) => eventChanged(clickInfo)}
                      select={(clickInfo) => handleDateSelect(clickInfo)}
                      eventClick={(clickInfo) => handleEventClick(clickInfo)}
                      events={Filteredevents}
                      eventContent={renderEventContent}
                    />
                  </div>
                </div>
              </div>
            </div>
              <div className="col-lg-4 col-md-12">
                <div className="card bg-white">
                  <div className="card-body">
                  {SaveChanges ? <button className="btn btn-save rounded mb-4" onClick={()=>UpdateTheAppointmentDateChange(ChangedEventList)}>{SaveChangesLoading ? <CircleSpinner size={20} color ="white" loading={SaveChangesLoading} /> : "Save Changes"}</button> : ""}
                    {appointment_menu ? 
                      <div>
                        <h4 className="card-title">Add New Appointment</h4>
                        
                        <hr></hr>
                        <form onSubmit={onFormSubmit}>
                          <div className="form-group">
                              <label>{WorkFlowSpecificNameChanger("sales_person")} <span style={{color: "red"}}>*</span></label>
                              <select value={salesPerson} className="checkInput" onChange={(e) => ChangedSalesPerson(e.target.value) }>
                              <option value="ALL" >All</option>
                              {salesPersonList && salesPersonList.map((data, index) => (<option value={data["name"]+"&"+data["user_id"]}>{data["name"]}</option>))}
                              </select>
                          </div>
                          <div className="form-group">
                            <label>
                            {WorkFlowSpecificNameChanger("customer")}<span className="text-danger">*</span>
                            </label>
                            
                          { customer_name ? customer_name : <input type="text" required {...register('customer')}/> }
                          </div>
                          
                
                          <div className="form-group">
                            <label>
                              Appointment Date <span className="text-danger">*</span>
                            </label>
                            <div className="cal-icon">
                              <input id="appointment_date" name="appointment_date" className="form-control " required type="date" {...register('appointment_date')}/>
                            </div>
                          </div>
                          <div className="form-group ">
                            <label >
                              Appointment Time and Duration <span className="text-danger">*</span>
                            </label>
                            <div className='row'>
                              <div className="col-lg-6 col-md-6 col-sm-6 ">
                                <input id="appointment_time" name="appointment_time" className="form-control " type="time" required {...register('appointment_time')}/>
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6">
                                <select className="form-control" required {...register('duration')}>
                                  <option value="15">15 Minutes</option>
                                  <option value="30">30 Minutes</option>
                                  <option value="45">45 Minutes</option>
                                  <option value="60">1 hour</option>
                                  <option value="120">2 hours</option>
                                  <option value="180">3 hours</option>
                                  <option value="240">4 hours</option>
                                </select>
                              </div>
                          </div>
                          </div>

                          <div className="form-group">
                            <label>
                              Notes:
                              <textarea  {...register('notes')} style={{ height: "50px"}}/>
                            </label>
                          </div>
                          <div className="submit-section">
                            {loading ? 
                            <button className="btn btn-secondary me-1" ><CircleSpinner size={20} color ="white" loading={loading} /> </button>
                            :
                              <div>
                                <button className="btn btn-secondary me-2 mt-1" type="submit" >Save & Exit</button>
                                <button className="btn btn-primary me-2 mt-1" type="submit" onClick={()=>setClickedProceed(true)} >Proceed</button>
                              </div>
                            }
                          </div>
                          
                        </form>
                      </div>
                      :
                        <div>
                        <h4 className="card-title">Appointment</h4>
                        <hr></hr>
                        <p>Customer Name : {selectevent.title}</p>
                        <p>start Time : {ConvertToActualTimeFormat(selectevent.start)}</p>
                        {selectevent.end ? <p>end Time : {ConvertToActualTimeFormat(selectevent.end)}</p> : ""}
                        {loading ? 
                        <button className="btn btn-secondary me-1" ><CircleSpinner size={20} color ="white" loading={loading} /> </button>
                        :
                        selectevent["extendedProps"]["eventStatus"] === "Sheduled" ? <button className="btn btn-primary me-2"  onClick={SelectedAnEventAndProceeded} >Proceed</button> :
                        selectevent["extendedProps"]["eventStatus"] === "InProgress" ? "":
                        selectevent["extendedProps"]["eventStatus"] === "Completed" ? "" : ""
                        }
                        {/*<button className="btn btn-primary me-2" type="submit" onClick={ProceedFunctionForInprogressEvents} >Proceed</button> */}
                        </div>
                        }
                  </div>
                </div>
              </div>
             

          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
