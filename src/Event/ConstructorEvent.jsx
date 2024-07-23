import axios from 'axios';
import alertify from "alertifyjs";
import "../../node_modules/alertifyjs/build/css/alertify.css";
import "../../node_modules/alertifyjs/build/css/themes/semantic.css";
import { errorMessage } from '../MainPage/Functions/CommonFunctions';

const DataFetchFailed = (message) => {
  alertify.set("notifier", "position", "top-right");
  alertify.error("Data fetch Submition Failed",message);
};
const ConstructAuthorisationHeader = () => {
  const UserKey = JSON.parse(localStorage.getItem('UserKey'))["agent_code"]
  const SecretKey = localStorage.getItem('authToken')
  const headers = {'Authorization': `${UserKey}=${SecretKey}`}
  return headers
}

export const ConstructorEventPost = async (api,data) => {
  try {
    // const headers = ConstructAuthorisationHeader()
    // const response = await axios.post(api,data,{headers});
    const response = await axios.post(api,data);
    return response.data ? response.data : "error";
  } catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
    return "error"
  }
};

export const ConstructorEventGet = async (api,data) => {
  try {
    // const headers = ConstructAuthorisationHeader()
    // const response = await axios.get(api , {params: data,headers : headers});
    const response = await axios.get(api , {params: data});

    return response.data;
  } catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
  }
};
export const ConstructorEventGetNoParams = async (api,data) => {

  try {
    const response = await axios.get(api , data);
    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage("Something Went Wrong")
  }
};

export const FormSubmitEvent = async (api,data) => {
  try {
    const headers = ConstructAuthorisationHeader()
    const response = await axios.post(api,data,{headers});
    //formSubmitSuccess()
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
    //formSubmitFailed(error.message)
  }
};

export const PublicApiFormSubmitEvent = async (api,data) => {
  try {
    const response = await axios.post(api,data);
    //formSubmitSuccess()
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
    //formSubmitFailed(error.message)
  }
};

export const uploadImage= async(link,file) => {
  try{
    const response = await axios.put(link,file,{headers: {'Content-Type': file.type},})
    return response
  }
  catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
  }
  
}

export const uploadPDF = async (link, file) => {
  try{
    const response = await axios.put(link, file, { headers: { 'Content-Type': 'application/pdf' } });
    return response;
  }catch (error) {
    console.error(error,"error");
    errorMessage("Something Went Wrong")
  }
};