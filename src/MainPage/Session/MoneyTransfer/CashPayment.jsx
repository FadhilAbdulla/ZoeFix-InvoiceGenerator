import React, { useState,useContext,useEffect,useRef } from 'react'
import { CircleSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from '../../../InitialPage/App';
import { FatchCashPaymentDeatilsForCashTransfer,AddNewPaymentForMapping } from '../../../api/Aws-api';
import { ConstructorEventGet,ConstructorEventPost,uploadImage } from '../../../Event/ConstructorEvent';
import { successMessage,ForwardUriFetchFunction, errorMessage } from '../../Functions/CommonFunctions';
import { useNavigate,useLocation } from 'react-router-dom';
import { SalesAttributes } from '../index';


const CashPayment = (props) => {
    const [ForigenCurrency,setForigenCurrency] = useState("USD")
    const [ForigenCurrency_options,setForigenCurrency_options] = useState([])
    const [BaseCurrency,setBaseCurrency] = useState("GHS")
    const [BaseCurrency_options,setBaseCurrency_options] = useState([])
    const [Vendor,setVendor] = useState("1")
    const [Vendor_options,setVendor_options] = useState([])
    const [ModeOfPayment,setModeOfPayment] = useState("Cash")
    const [ModeOfPayment_options,setModeOfPayment_options] = useState([])
    const [ReferenceNumber, setReferenceNumber] = useState();
    const [ROE,setROE] = useState(0);
    const [FCAmount,setFCAmount] = useState(0);
    const [BCAmount,setBCAmount] = useState(0);
    const [ServiceCharge,setServiceCharge] = useState();

    const [Refreshloading,setRefreshLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const {OutletCode} = useContext(ApplicationAttributes)
    const {customer_id,customer_name,InitiatorCode} = useContext(SalesAttributes)
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    
    useEffect(()=>{
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
        async function fetchdata(){
          const responseData = await ConstructorEventGet(FatchCashPaymentDeatilsForCashTransfer ,{client_code: OutletCode});
          if (responseData){
            setBaseCurrency_options(responseData["currency"]);setForigenCurrency_options(responseData["currency"]);
            setVendor_options(responseData["vendor"]);setModeOfPayment_options(responseData["paymetType"])
          }
          setRefreshLoading(false)
        }
        setRefreshLoading(true)
        fetchdata()
      },[])

      const handleSubmit = async(e) => {
        setLoading(true)
        const params = {
            "ReferenceNumber" : ReferenceNumber,
            "ForigenCurrency" : ForigenCurrency,
            "BaseCurrency" : BaseCurrency,
            "Vendor" : Vendor,
            "ModeOfPayment" : ModeOfPayment,
            "FcAmount" : FCAmount,
            "BcPaid" : BCAmount,
            "Unmatched" : "sample",
            "Matching" : "sample",
            "Profit" : "200",
            "ServiceCharge" : ServiceCharge,
            "Customer" : customer_name,
            "Customer_id" : customer_id
        }
        const responsedata = await ConstructorEventPost(AddNewPaymentForMapping,{params : params, clientCode : OutletCode})
        if (responsedata === "Created"){
            console.log(responsedata)
            navigate( uri.current,{state: {order_of_execution: OrderOfExecution+1 }})
        }
        setLoading(false)
    }
    
    const SetValueForBCamountFromRoe = (e) => {
        setROE(e.target.value)
        setBCAmount(e.target.value * FCAmount)
    }
    const SetValueForBCamountFromFcAmount = (e) => {
        setFCAmount(e.target.value)
        setBCAmount(e.target.value * ROE)
    }

    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Money Transfer</h4>
                            <h6></h6>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                        <CircleSpinner size={20} color ="orange" loading={Refreshloading} /> 
                            <div className="row ">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Forigen Currency </label>
                                        <select value={ForigenCurrency} className="checkInput" onChange={(e) => setForigenCurrency(e.target.value) }>
                                        {ForigenCurrency_options && ForigenCurrency_options.map((data, index) => (<option key={index} value={data["code"]}>{data["name"]}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12" >
                                    <div className="form-group">
                                        <label>Base Currency </label>
                                        <select value={BaseCurrency} className="checkInput" onChange={(e) => setBaseCurrency(e.target.value) }>
                                        {BaseCurrency_options && BaseCurrency_options.map((data, index) => (<option key={index} value={data["code"]}>{data["name"]}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Vendor </label>
                                        <select value={Vendor} className="checkInput" onChange={(e) => setVendor(e.target.value) }>
                                        {Vendor_options && Vendor_options.map((data, index) => (<option key={index} value={data["VendorCode"]}>{data["VendorName"]}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Mode Of Payment</label>
                                        <select value={ModeOfPayment} className="checkInput" onChange={(e) => setModeOfPayment(e.target.value) }>
                                        {ModeOfPayment_options && ModeOfPayment_options.map((data, index) => (<option key={index} value={data["payment_type"]}>{data["payment_type"]}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Reference Number</label>
                                        <input
                                            type="text" 
                                            value={ReferenceNumber}
                                            onChange={(e) => setReferenceNumber(e.target.value)}
                                        />

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>FC Amount <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={FCAmount}
                                            onChange={SetValueForBCamountFromFcAmount} 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>ROE <span style={{color: "red"}}>*</span></label>
                                        <input 
                                            type="text" 
                                            value={ROE}
                                            onChange={SetValueForBCamountFromRoe}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>BC Amount</label>
                                        <input 
                                            type="text" 
                                            value={BCAmount}
                                            onChange={(e) => setBCAmount(e.target.value)}
                                            disabled
                                            
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Service Charge</label>
                                        <input 
                                            type="text" 
                                            value={ServiceCharge}
                                            onChange={(e) => setServiceCharge(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <button className="btn btn-submit me-2" onClick={FCAmount && ROE && handleSubmit} disabled={loading}>
                                    {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Submit"}
                                    </button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /add */}
                </div>
            </div>
        </>
    )
}
export default CashPayment;