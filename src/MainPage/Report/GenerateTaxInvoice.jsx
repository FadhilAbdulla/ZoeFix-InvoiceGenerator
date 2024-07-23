import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { GenerateBillData } from '../../api/Aws-api'
import { ConstructorEventPost } from '../../Event/ConstructorEvent';
import { errorMessage, successMessage } from '../Functions/CommonFunctions';

const GenerateTaxInvoice = () => {

    let data1 = {
        "BillInvoiceId": "23",
        "BillDate": "22-12-2023",
        "BillVehicleNumber": "KL58L556",
        "BillDateOfSupply": "22-12-2023",
        "BillPlaceOfSupply": "Mananthavady",

        "BillGSTMode": "IntraState",
        "ClientName": "Suabir Traders",
        "ClientAddress": "12/81, SUABIR TRADERS, Mysore Road , Mananthavady,Wayanad, Kerala, 670645",
        "ClientState": "Kerala",
        "ClientStateCode": "32",
        "ClientGst": "32AAKFS1753J1Z4",
        "ClientMobileNumber": "9746595925",
        "BillItems": [{
            "ItemName": "Pepper",
            "ItemCode": "346247",
            "Quantity": "45",
            "ItemPrice": "500",
            "ItemSGST": "18",
            "ItemCGST": "18",
            "PriceWithTax": "680",
            "ItemRatePerAmount": "KGs",
            "Amount": "30600"
        }],
        "BillTotal": "30600",
        "BillTotalSGSTAmount": "50",
        "BillTotalCGSTAmount": "50",
        "BillAmountInWords": "INR Twenty Four Thousand Three Hundred Ninety Six Only"
    }
    const loc = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(data1)

    useEffect(() => {
        const {BillId} = loc.state ? loc.state : {};
        if (BillId){fetchdata(BillId)}
        else {errorMessage("Bill Creation Went Wrong")}
        async function fetchdata(BillId) {
            const params = { "BillId": BillId, "BillGSTMode": "IntraState" }
            const responsedata = await ConstructorEventPost(GenerateBillData, params)
            if (responsedata["statusCode"] === 200) { setData(responsedata["body"]) }
            else if (responsedata["statusCode"] === 500) { errorMessage(["Something Went Wrong!"]) }
            else { errorMessage("Server Error") }
            setLoading(false)
        }
        setLoading(true)


    }, [])

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Bill</h4>
                            <h6>Generate tax Invoice</h6>
                        </div>
                    </div>
                    <div className="row" ref={componentRef}>
                        <div className="card" >
                            <div className="row p-4">
                                <h3 className='align-center mt-2 '>SUABIR TRADERS</h3>
                                <h4 className='align-center mt-1'>Hill Produce and Food Grain Dealer</h4>
                                <p className='align-center mb-0 mt-1'>Mysore Road, Mananthavady, Wayanad District, Kerala (32) - 670645</p>
                                <p className='align-center mb-0'>PH : 9605431719 , 9847617537</p>
                                <p className='align-center '>GSTIN : 32AAKFS1753J1Z4</p>
                                <h6 className='align-center mt-2 '>Tax Invoice</h6>

                                <div className='mt-4 col-6 bordered-div p-4'>

                                    <table className="invoice-table">
                                        <tbody>
                                            <tr>
                                                <td>Invoice ID : </td>
                                                <td>{data["BillInvoiceId"]}</td>
                                            </tr>
                                            <tr>
                                                <td>Invoice Date : </td>
                                                <td>{data["BillDate"]}</td>
                                            </tr>
                                            <tr>
                                                <td>Vehicle Number </td>
                                                <td>{data["BillVehicleNumber"]}</td>
                                            </tr>
                                            <tr>
                                                <td>Date Of Supply </td>
                                                <td>{data["BillDateOfSupply"]}</td>
                                            </tr>
                                            <tr>
                                                <td>Place Of Supply </td>
                                                <td>{data["BillPlaceOfSupply"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className='mt-4 col-6 row bordered-div'>
                                    <table className="invoice-table pl-4">
                                        <tbody>
                                            <tr>
                                                <td><p className='font-underline-and-bold'>Details of reciver</p></td>
                                            </tr>
                                            <tr>
                                                <td>{data["ClientName"]}</td>
                                            </tr>
                                            <tr>
                                                <td>{data["ClientAddress"]}</td>
                                            </tr>
                                            <tr>
                                                <td>GSTIN/UIN : {data["ClientGst"]}</td>
                                            </tr>
                                            <tr>
                                                <td>State Name : {data["ClientState"]}, Code : {data["ClientStateCode"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='pl-4 pr-4'>

                                <table className="invoice-table">
                                    <thead>
                                        <tr>
                                            <th>SI</th>
                                            <th>Description of Goods</th>
                                            <th>HSN/SAC</th>
                                            <th className='right-align'>Quantity</th>
                                            <th className='right-align'>Rate</th>
                                            <th className='right-align'>Rate (Incl of CGST & SGST)</th>
                                            <th>Per</th>
                                            <th className='right-align'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data && data["BillItems"] && data["BillItems"].map((item, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item["ItemName"]}</td>
                                                <td>{item["ItemCode"]}</td>
                                                <td className='right-align'>{item["Quantity"] + " " + item["ItemRatePerAmount"]}</td>
                                                <td className='right-align'>{item["ItemPrice"]}</td>
                                                <td className='right-align'>{item["PriceWithTax"]}</td>
                                                <td>{item["ItemRatePerAmount"]}</td>
                                                <td className='right-align'>{item["Amount"]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="5"></td>
                                            <td colspan="1">Total Amount</td>
                                            <td colspan="2" className='right-align'>{data["BillTotal"]}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="5"></td>
                                            <td colspan="1">Total SGST</td>
                                            <td colspan="2" className='right-align'>{data["BillTotalSGSTAmount"]}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="5"></td>
                                            <td colspan="1">Total CGST</td>
                                            <td colspan="2" className='right-align'>{data["BillTotalCGSTAmount"]}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="5"></td>
                                            <td colspan="1">Total Tax Amount</td>
                                            <td colspan="2" className='right-align'>{parseFloat(data["BillTotalSGSTAmount"]) + parseFloat(data["BillTotalCGSTAmount"])}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <p className='mt-4'><p className='font-underline-and-bold small-text'>Amount Chargable (in Words) :  </p>{data["BillAmountInWords"]}</p>
                                {/* <p className='mt-4'><p className='font-underline-and-bold'>Tax Amount (in Words) :  </p>INR Twenty Four Thousand Three Hundred Ninety Six Only</p> */}
                                <table className="invoice-table-footer">
                                    <tbody>
                                        <tr>
                                            <td><p className='font-underline-and-bold mb-0 small-text'> Declaration</p>
                                                <p className='mb-0 small-text'>Certified that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                                                <p className='mb-0 small-text'></p></td>
                                            <td>For Suabir Traders</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                            <p className='align-center mt-4 small-text'>This is a Computer Generated Invoice</p>
                        </div>
                    </div>
                    <button className='btn btn-primary' onClick={handlePrint}>print</button>
                    <button className='btn btn-secondary ml-4' onClick={() => navigate("/dream-pos/dashboard")}>Dashboard</button>
                </div>
            </div>
        </>
    );
}

export default GenerateTaxInvoice;
