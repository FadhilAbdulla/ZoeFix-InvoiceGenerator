//Template For Payment,Select the payment type,Jump to sessionClose or Print
//Attributes --> Total Amount, Payment Type

import React,{useRef , useContext, useState , useEffect}  from 'react'
import { Link ,useLocation,useNavigate} from "react-router-dom";
import {SalesAttributes} from './index'
import {FormSubmitEvent} from '../../Event/ConstructorEvent'
import { ConstructorEventGet } from '../../Event/ConstructorEvent';
import {PaymentTypeFetchApi} from '../../api/Aws-api'
import { CircleSpinner } from "react-spinners-kit";
import {FetchWorkflow_code,getEpochTime,GetDateTime,ForwardUriFetchFunction,GetDate} from '../Functions/CommonFunctions'
import {AddNewCheckoutData} from '../../api/Aws-api';
import { ApplicationAttributes } from '../../InitialPage/App';

function Payment(props) {
  const [payment_options,setPayment_options] = useState([])
  const [showSessionClose,setShowSessionClose] = useState(false)
  const [selectdata,setSelectdata] = useState()
  const [loading,setLoading] = useState(false)
  const [Refreshloading,setRefreshloading] = useState(false)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [TotalSale, setTotalSale] = useState();
  const [CartId, setCartId] = useState();
  const [CheckoutId, setCheckoutId] = useState();
  const [CartItems, setCartItems] = useState([]);
  const uri = useRef(null);
  const loc = useLocation()
  const {setPayment_type,setTotal_sale,session_id,InitiatorCode} = useContext(SalesAttributes)
  const {RoundOff,OutletCode,B2BCurrencyCode,B2BName} = useContext(ApplicationAttributes)
  const WorkFlowCode = FetchWorkflow_code()
  const CheckoutDate = GetDateTime()
  const epochTime = getEpochTime()
  const OnlyDate = GetDate()
  const navigate = useNavigate()

  //function for fetching the payment type on the loading of the page
  useEffect(()=>{
    const { order_of_execution,Total,Cart_id,Cartdata } = loc.state ? loc.state : {};
    if (order_of_execution) {setOrderOfExecution(order_of_execution)}
    if (Total) {setTotalSale(Total)}
    if (Cart_id) {setCartId(Cart_id)}
    if (Cartdata){setCartItems(Cartdata)}
    async function fetchdata(){
      const responseData = await ConstructorEventGet(PaymentTypeFetchApi,{client_code: OutletCode});
      setPayment_options(responseData);setRefreshloading(false)}
    setRefreshloading(true)
    fetchdata()
  },[])

  uri.current =ForwardUriFetchFunction(OrderOfExecution,InitiatorCode) 

  const AddCheckoutDatatoCloud = async () =>  {
    setLoading(true)
    const formData = {
      "clientCode" : OutletCode,
      "payload": {"Item": {
        "CreatedDateTimeStamp" : String(CheckoutDate),
        "UpdatedDateTimeStamp" : String(CheckoutDate),
        "CreatedBy" : B2BName,
        "UpdatedBy" : B2BName,
        "since_unix_time" : epochTime,
        "total_amount" : TotalSale.toFixed(parseInt(RoundOff)),
        "cash_paid": TotalSale.toFixed(parseInt(RoundOff)),
        "cash_balance" : 0,
        "discount_amount" : 0,
        "WorkFlowCode" : WorkFlowCode,
        "payment_type" : {
          "payment_type_selection" : selectdata,
          "amount":TotalSale.toFixed(parseInt(RoundOff))
        },
        "cart" : {
          "cart_id" : CartId ,
          "cart_total_amount": TotalSale.toFixed(parseInt(RoundOff))
        }
    }}};
    const responseData = await FormSubmitEvent(AddNewCheckoutData,formData);
    if (responseData[1]=="Created"){setCheckoutId(responseData[0])}
    setPayment_type(selectdata)
    setTotal_sale(TotalSale)
    setLoading(false)
    setShowSessionClose(true)
  }

  const HandleSubmit = () => {
    navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1 }});
  }

  const NavigateToPrintSessionBill = () => {
    navigate("/dream-pos/session/sessionReciept",{state: {InvoiceId: CheckoutId ,CheckoutDate : OnlyDate,CartItemsData : CartItems  }})
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Checkout</h4>
              <h6>Make your Payment Here / Cart id : {CartId}</h6>
            </div>
          </div>
          {/* /add */}
          <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
              <CircleSpinner size={20} color ="orange" loading={Refreshloading} /> 
                <h4 className="card-title mb-0">Date: {OnlyDate}</h4>
                <hr></hr>
                <p className="card-title mb-0">Total Amount : {B2BCurrencyCode}{TotalSale && TotalSale.toFixed(parseInt(RoundOff))}</p>


                <hr></hr>


                {showSessionClose ? 
                <h4 className="card-title">Selected Payment Method: {selectdata}</h4>
                :
                <div>
                  <h4 className="card-title">Select your payment type</h4>
                {payment_options.map(option => (
                  <button key={option.Id} className={`col-lg-3 col-sm-12 col-xs-12 p-3 mt-4 btn btn-rounded ${option.payment_type === selectdata ? "btn-secondary" : "btn-outline-secondary"} me-4`} onClick={()=>{setSelectdata(option.payment_type)}}>
                    {option.payment_type}
                  </button>
                ))}
                </div>}
              <hr></hr>
              {showSessionClose ? 
                <div>
                  {uri.current === "/dream-pos/session/session_close" ? <button className="btn btn-success me-1" onClick={HandleSubmit}  >
                    Session Close
                  </button> : null }
                  <button className="btn btn-success  me-1" onClick={NavigateToPrintSessionBill} >
                    Print
                  </button>
                  <Link to={'/dream-pos/dashboard'} className="btn btn-primary me-1">
                    Dashboard
                  </Link>
                </div>
              :
                <button className="btn btn-primary" onClick={selectdata ? AddCheckoutDatatoCloud : null}  >
                  {loading ? <CircleSpinner size={20} color ="white" loading={loading} /> : "Submit" }
                </button>
              }   

            </div>
          </div>
          </div>
          {/* /add */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment