import React, { useState,useEffect,useRef,useContext } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { CloudFrontDistributionForOutletDataFetch } from '../../api/Aws-api';
import { FetchOutletImage,FetchOutletDetails } from '../Functions/CommonFunctions';
import { Table } from "antd";
import { useReactToPrint } from 'react-to-print';
import { ApplicationAttributes } from "../../InitialPage/App";


const PrintSessionReciept = () => {
    const OutletHeaderImage = FetchOutletImage()
    const OutletData = FetchOutletDetails()
    const OutletAddress = OutletData ? OutletData["outlet_address"] : {}
    const [CheckoutInvoiceId,setCheckoutInvoiceId] = useState("")
    const [Checkoutdate,setCheckoutdate] = useState("")
    const [ItemData,setItemData] = useState([])
    const {RoundOff} = useContext(ApplicationAttributes)
    const loc = useLocation()
    const navigate = useNavigate()

    useEffect(()=>{
        const {InvoiceId,CheckoutDate,CartItemsData} = loc.state ? loc.state : {};
        if (InvoiceId){setCheckoutInvoiceId(InvoiceId)}
        if (CheckoutDate){setCheckoutdate(CheckoutDate)}
        if (CartItemsData){setItemData(CartItemsData)}
        // setTimeout(() => {handlePrint()}, 1000);
    },[])
    const columns = [
        {
          title: "Sl No.",
          dataIndex: "name",
          render: (text, record, index) => index + 1,
        },
        {
          title: "Item Name",
          dataIndex: "item_name",
          className: "long-text-cell",
          render: (text) => <div className="long-text">{text}</div>
        },
        {
          title: "Price",
          dataIndex: "price",
          align: "right",
          render: (text) => parseFloat(text).toFixed(RoundOff),
    
        },
        {
            title: "Quantity",
            dataIndex: "count",
            align: "right"
      
        },
        {
          title: "Tax Percentage",
          dataIndex: "tax_percentage",
          align: "right",
        },
        {
          title: "Total Price",
          dataIndex: "price",
          align: "right",
          render: (text,record) => parseFloat(parseInt(record["count"]) * parseFloat(text)).toFixed(2)
        }
      ];

      const TotalAmount = ItemData.reduce(function (total, data) {
        return total + data.price * (data.count > 0 ? data.count : 0)
        }, 0
      );
      const TotalTaxAmount = 0
      const pageStyle = 
        `
        @media print {
            html, body {
              height: 100vh; /* Use 100% here to support printing more than a single page*/
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden;
            }
          }
          @media print {
            .page-break {
              margin-top: 1rem;
              display: block;
              page-break-before: auto;
              background-color: #4d1905;
            }
          }
          @page {
            size: auto;
            margin: 20mm;
            background-color: #4d1905;
          }
        `
      const componentRef = useRef();
      const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        // onAfterPrint: () => navigate("/dream-pos/dashboard")
        //pageStyle: pageStyle,
      });
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Bill</h4>
                            <h6>Order Checkout Bill</h6>
                        </div>
                    </div>
                    <div className="row" ref={componentRef}>
                        <div className="col-lg-12">
                            <div className="card billBackGround" >
                                <div className="card-header row InvoiceMainHeader">
                                    <div className='mt-4 col-6'>
                                        {OutletHeaderImage ? <div className='ml-4 logo-medium rounded-6'>
                                            <img src={CloudFrontDistributionForOutletDataFetch+OutletHeaderImage} alt="" />
                                        </div> : <h2 className="ml-4 mb-2 mt-2 billFontColour"><b><u>{OutletData["outlet_name"]}</u></b></h2> }
                                        <p className="ml-4 mb-0 billfontcolorChampagne">{OutletData && OutletData["outlet_mobile"] && `Ph: ${OutletData["outlet_mobile"]}`} </p>
                                        <p className="ml-4 mb-0 billfontcolorChampagne">{OutletAddress && OutletAddress["StreetAddress"]} </p>
                                        <p className="ml-4 mb-0 billfontcolorChampagne">{OutletAddress && OutletAddress["State"]} {OutletAddress && OutletAddress["PinCode"] != "" ? ` (${OutletAddress["PinCode"]})` : ""} </p>
                                        <p className="ml-4 mb-0 billfontcolorChampagne">{OutletAddress && OutletAddress["Country"]} </p>
                                    </div>
                                    <div className='InvoiceHeader col-6'>
                                        <h4 className="mb-4 billFontAsTanMonCheri"><b>INVOICE</b></h4>
                                        <div className=' right-align '>
                                            <p className="ml-4 mb-0 mr-20 billfontInvoiceBelow right-align">Invoice Id: {CheckoutInvoiceId}</p> 
                                            <p className="ml-4 mb-0 mr-20 billfontInvoiceBelow right-align">Date: {Checkoutdate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body ml-4 mr-4 ">
                                    <table className='InvoiceBodyTable'>
                                        <thead>
                                            <tr className='billFontColourBrown'>
                                                <th>Sl No.</th>
                                                <th>Item Name</th>
                                                <th className='right-align'>Price</th>
                                                <th className='right-align'>Quantity</th>
                                                <th className='right-align'>Tax Percentage</th>
                                                <th className='right-align'>Total Price</th>
                                            </tr>
                                            <tr>
                                                <th colSpan="6">
                                                    <hr />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ItemData && ItemData.map((item,index)=>(
                                                <>
                                                <tr className='billFontColour'>
                                                    <td>{index+1}</td>
                                                    <td className='long-text'>{item["item_name"]}</td>
                                                    <td className='right-align'>{parseFloat(item["price"]).toFixed(RoundOff)}</td>
                                                    <td className='right-align'>{item["count"]}</td>
                                                    <td className='right-align'>{item["tax_percentage"]}</td>
                                                    <td className='right-align'>{parseFloat(parseInt(item["count"]) * parseFloat(item["price"])).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th colSpan="6">
                                                        <hr />
                                                    </th>
                                                </tr>
                                            </>
                                            ))}
                                            
                                        </tbody>
                                    </table>
                                    {/* <Table    
                                        className="table datanew dataTable no-footer"      
                                        columns={columns}
                                        dataSource={ItemData}      
                                        pagination={false}
                                    /> */}
                                    
                                    <div className='alignTextToRight mt-4'>
                                        <p className="ml-4 mb-0 mr-4 billFontColour">Total Amount : { parseFloat(TotalAmount).toFixed(2)}</p>
                                        <p className="ml-4 mb-0 mr-4 billFontColour">Tax Total : { parseFloat(TotalTaxAmount).toFixed(2)}</p>
                                        <p className="BoldFontWithCustomSize ml-4 mb-0 mr-4 mt-2 billFontColourBrown">Grand Total : {parseFloat(TotalAmount+TotalTaxAmount).toFixed(2)}</p> 
                                    </div>
                                    <div className='mb-8'><p className="ml-4 mt-16 billFontColourBrown">Cashier</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-primary' onClick={handlePrint}>print</button>
                    <button className='btn btn-secondary ml-4' onClick={()=>navigate("/dream-pos/dashboard")}>Dashboard</button>
                </div>
            </div>
        </>
    );
}

export default PrintSessionReciept;
