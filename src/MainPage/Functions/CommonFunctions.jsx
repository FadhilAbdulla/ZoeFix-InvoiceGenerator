import alertify from "alertifyjs";
import "../../../node_modules/alertifyjs/build/css/alertify.css";
import "../../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { useRef, useContext } from 'react'
import { googleLogout } from '@react-oauth/google';
import { ConstructorEventGet } from "../../Event/ConstructorEvent";
import { FetchWorkFlowCode } from '../../api/Aws-api'
import Swal from "sweetalert2";


export const FetchWorkflow_code = () => {
  return localStorage.getItem('Workflow_code')
}

export const GetDate = () => {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  return date
}
export const GetDateForStock = () => {
  const current = new Date();
  const date = `${current.getDate()}${current.getMonth() + 1}${current.getFullYear()}`;
  return date
}
export const GetDateTime = () => {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
  const time = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
  const dateTime = `${date} ${time}`;
  return dateTime;
}
export const getEpochTime = () => {
  const current = new Date();
  const epochTime = current.getTime() / 1000; // Convert milliseconds to seconds
  return Math.floor(epochTime);
}

export const successMessage = (message) => {
  alertify.set("notifier", "position", "top-right");
  alertify.success(message);
}
export const errorMessage = (message) => {
  alertify.set("notifier", "position", "top-right");
  alertify.error(message);
}
export const ForwardUriFetchFunction = (OrderOfExecution, WorkFlowName) => {
  const pathname = window.location.pathname
  var Main_workflow = JSON.parse(localStorage.getItem(WorkFlowName))
  let uri = "";
  const prev = pathname.split("/").pop()
  if (OrderOfExecution === undefined || OrderOfExecution === null) { console.log("sdhsbcscsdhs"); return "/dream-pos/dashboard" }
  else if (!Main_workflow) { console.log("Cant Find Main Workflow on localstorage"); return "/dream-pos/dashboard" }
  else if (!Main_workflow[OrderOfExecution.toString()]) { console.log("no corresponding order of execution on mainWorkflow"); return "/dream-pos/dashboard" }
  //else if(!Main_workflow[OrderOfExecution.toString()]){return "/dream-pos/dashboard"}
  else {
    if (prev === "session") { uri = Main_workflow[OrderOfExecution.toString()]["routing_uri"] }
    else { uri = pathname.replace(prev, Main_workflow[OrderOfExecution.toString()]["routing_uri"]) }
    console.log(uri, "uri")
    return uri
  }
}

export const ApplicationLogout = (history) => {
  googleLogout();
  localStorage.clear();
  sessionStorage.clear();
  //setuserAuthenticated(false)
  //setVerifiedAsMentor(false)
  //setVerifiedAsAdmin(false)
}

export const SetWorkFlowForApplication = async (WorkFlowData) => {
  console.log(WorkFlowData)
  let sessiondata = CheckTheSessionStartPageForWorkFlow(WorkFlowData.workflow_config)
  localStorage.setItem('ActiveSession', sessiondata === "" ? false : true)
  localStorage.setItem('Workflow_code', WorkFlowData["workflow_code"])

  if (WorkFlowData.workflow_config["session"] && WorkFlowData.workflow_config["session"].some(obj => obj.routing_uri === "cash_payment")) { localStorage.setItem('MatchingSession', true) }
  else { localStorage.setItem('MatchingSession', false) }

  for (let [key, value] of Object.entries(WorkFlowData.workflow_config)) {
    const transformedJson = value.reduce((result, item) => {
      result[item.order_of_execution] = {
        //Id: item.Id,
        //workflow_code: item.workflow_code,
        CreateSession: item.routing_uri === sessiondata ? true : false,
        template_name: item.template_name,
        routing_uri: item.routing_uri
      };
      return result;
    }, {});
    localStorage.setItem(key, JSON.stringify(transformedJson));
  }
  successMessage("WorkFlow Changed Successfully");
}

export const CheckTheSessionStartPageForWorkFlow = (FullWorkFlow) => {
  if (FullWorkFlow && FullWorkFlow["session"]) {
    FullWorkFlow = FullWorkFlow["session"]
    let highestOrder = -1
    let Template = ""
    let checkTemplates = ["appointment", "customer", "appointment_desk"]
    for (let workflow of FullWorkFlow) {
      if (checkTemplates.includes(workflow.routing_uri) && workflow.order_of_execution > highestOrder) {
        Template = workflow.routing_uri
        highestOrder = workflow.order_of_execution
      }
    }
    return Template
  } else { return "" }
}

export const CheckWorkFlowCreatingSession = (OrderOfExecution) => {
  var Main_workflow = JSON.parse(localStorage.getItem('session'))
  if (OrderOfExecution === undefined || OrderOfExecution === null) { return false }
  else if (!Main_workflow) { return false }
  else if (!Main_workflow[OrderOfExecution.toString()]) { return false }
  else { console.log(Main_workflow[OrderOfExecution.toString()]["CreateSession"]); return Main_workflow[OrderOfExecution.toString()]["CreateSession"] }
}

export const WorkFlowSpecificNameChanger = (Default_Name) => {
  var NamingJson = JSON.parse(localStorage.getItem('OutletData'))
  if (NamingJson && NamingJson["workflow"] && NamingJson["workflow"]["NameReplacement"] &&
    NamingJson["workflow"]["NameReplacement"][Default_Name]) {
    return NamingJson["workflow"]["NameReplacement"][Default_Name]
  }
  else { return Default_Name }
}

export const FetchSessionRedirectTemplateFromFetchedWorkflow = () => {
  var outletJson = JSON.parse(localStorage.getItem('OutletData'))
  if (outletJson && outletJson["workflow"] && outletJson["workflow"]["SessionRedirect"]) { return outletJson["workflow"]["SessionRedirect"] }
  else { return "cart" }
}

export const FetchWorkingHours = () => {
  var outletJson = JSON.parse(localStorage.getItem('OutletData'))
  if (outletJson && outletJson["outlet"] && outletJson["outlet"]["WorkingHours"] && outletJson["outlet"]["WorkingHours"] !== "") {
    const time = outletJson["outlet"]["WorkingHours"].split("_")
    return time[0] + ":00&" + time[1] + ":00"
  }
  else { return "00:00:00&24:00:00" }
}

export const SimpleSwalNotification = async (title, message) => {
  const response = await Swal.fire({
    title: title,
    text: message,
    type: "warning",
    showCancelButton: !0,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    confirmButtonClass: "btn btn-primary",
    cancelButtonClass: "btn btn-danger ml-1",
    buttonsStyling: !1,
  })
  console.log(response)
  if (response.value) { return true }
  else { return false }
}

export const FetchOutletImage = () => {
  var outletJson = JSON.parse(localStorage.getItem('OutletData'))
  if (outletJson && outletJson["outlet"] && outletJson["outlet"]["OutletHeaderImage"] && outletJson["outlet"]["OutletHeaderImage"] !== "") {
    return outletJson["outlet"]["OutletHeaderImage"]
  }
  else { return }
}

export const FetchOutletDetails = () => {
  var outletJson = JSON.parse(localStorage.getItem('OutletData'))
  if (outletJson && outletJson["outlet"]) {
    return outletJson["outlet"]
  }
  else { return }
}

export const FetchActiveCategory = (data) => {
  console.log(data)
  let activeItem = null;
  for (const item of data) { if (item.active === true) { activeItem = item["category_code"]; break; } }
  if (activeItem === null) { activeItem = data[0]["category_code"] }
  return activeItem
}

export const isNumber = (input) => {
  console.log(input)
  if (/^-?\d*\.?\d+$/.test(input)) { console.log("no"); return true }
  else if (input === "" || input === null) { return true }
  else { return false }
}