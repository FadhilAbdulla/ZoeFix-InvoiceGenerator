import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CircleSpinner } from 'react-spinners-kit';
import { ConstructorEventGet, ConstructorEventPost } from '../../Event/ConstructorEvent';
import { BillHelper, BillNewFetch } from '../../api/Aws-api';
import { Table } from "antd";
import "../../EntryFile/antd.css";
import { successMessage, errorMessage } from '../Functions/CommonFunctions';


const AddNewClients = (props) => {
    const columns = [
        { title: "Item Name", dataIndex: "ItemName", sorter: (a, b) => a.ItemName.length - b.ItemName.length, },
        { title: "Code", dataIndex: "ItemCode" }, { title: "Price", dataIndex: "ItemPrice", align: "right" },];
    const [loading, setLoading] = useState(false);
    const [Refreshloading, setRefreshloading] = useState(true)
    const [ItemColumns, setItemColumns] = useState([...columns, { title: "Quantity", dataIndex: "Quantity", align: "right", }, { title: "Amount", dataIndex: "Amount", align: "right", }])
    const [ItemSingleSelect, setItemSingleSelect] = useState("")
    const [ItemSingleQuantity, setItemSingleQuantity] = useState("")
    const [TotalClientList, setTotalClientList] = useState([])
    const [TotalItemList, setTotalItemList] = useState([])
    const [SelectedItems, setSelectedItems] = useState([]);
    const [TotalAmount, setTotalAmount] = useState(0)
    const [TotalCGSTAmount, setTotalCGSTAmount] = useState(0)
    const [TotalIGSTAmount, setTotalIGSTAmount] = useState(0)
    const [TotalSGSTAmount, setTotalSGSTAmount] = useState(0)
    const [BillClient, setBillClient] = useState("")
    const [BillDate, setBillDate] = useState("")
    const [BillGSTMode, setBillGSTMode] = useState("IntraState")
    const [BillInvoiceType, setBillInvoiceType] = useState("BillOfSupply")
    const [BillVehicleNumber, setBillVehicleNumber] = useState("")
    const [BillDateOfSupply, setBillDateOfSupply] = useState("")
    const [BillPlaceOfSupply, setBillPlaceOfSupply] = useState("")


    const navigate = useNavigate()

    useEffect(() => {
        async function fetchdata() {
            setRefreshloading(true)
            const responseData = await ConstructorEventGet(BillNewFetch);
            if (responseData["statusCode"] === 200) { setTotalClientList(responseData["body"]['Clients']); setTotalItemList(responseData["body"]['Item']) }
            else if (responseData["statusCode"] === 500) { errorMessage(["Something Went Wrong!"]) }
            else { errorMessage("Server Error") }
            console.log(responseData)
            setRefreshloading(false)
        }
        fetchdata()
    }, [])

    const onSubmit = async () => {
        if (SelectedItems.length <= 0) { errorMessage("please add an item in cart"); return }
        else if (BillClient === "") { errorMessage("please select a client to proceed"); return }
        setLoading(true)
        const params = {
            "BillClientId": BillClient,
            "BillItems": SelectedItems,
            "BillInvoiceType": BillInvoiceType,
            "BillDate": BillDate,
            "BillGSTMode": BillGSTMode,
            "BillVehicleNumber": BillVehicleNumber,
            "BillDateOfSupply": BillDateOfSupply,
            "BillPlaceOfSupply": BillPlaceOfSupply,
            "BillTotal": TotalAmount,
            "BillTotalCGSTAmount" : TotalCGSTAmount,
            "BillTotalIGSTAmount" : TotalIGSTAmount,
            "BillTotalSGSTAmount" : TotalSGSTAmount,
            "BillAmountInWords" : inWords(parseInt(TotalAmount)),
            "BillRoundOff": 0
        }
        const responsedata = await ConstructorEventPost(BillHelper, { data: params, operation: "create" })
        if (responsedata["statusCode"] === 200) { successMessage(responsedata["body"]); navigate("/zoefix/bill") }
        else if (responsedata["statusCode"] === 500) { errorMessage(responsedata["body"]) }
        else { errorMessage("Server Error") }
        setLoading(false)
    }

    const onCancel = async () => {
        navigate("/zoefix/bill")
    }

    const RerenderColumns = (gst, invoice) => {
        let temp = columns
        if (invoice === "TaxInvoice") {

            if (gst === "IntraState") {
                temp.push({ title: "CGST", dataIndex: "ItemCGST", align: "right" })
                temp.push({ title: "SGST", dataIndex: "ItemSGST", align: "right", })
                // setItemColumns(temp)
            }
            else if (gst === "InterState") {
                temp.push({ title: "IGST", dataIndex: "ItemIGST", align: "right", })
                // setItemColumns(temp)
            }
            temp.push({ title: "Price With Tax", dataIndex: "PriceWithTax", align: "right", })
        }
        temp.push({ title: "Quantity", dataIndex: "Quantity", align: "right", })
        temp.push({ title: "Amount", dataIndex: "Amount", align: "right", })
        setItemColumns(temp)
        // else if (invoice === "BillOfSupply"){setItemColumns(temp)}
    }


    const inWords = (num) => {

        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';

        return str;
    }

    const AddItemToCart = () => {
        if (ItemSingleQuantity <= 0) { return }
        let SelectedItemData = TotalItemList.find(item => item.ItemId === ItemSingleSelect)
        //calculate price with tax
        let PriceWithTax = 0
        let TotalCGST = 0
        let TotalIGST = 0
        let TotalSGST = 0
        if (BillInvoiceType === "TaxInvoice") {
            if (BillGSTMode === "IntraState") {
                let CgstTax = (parseFloat(SelectedItemData["ItemPrice"]) * parseFloat(SelectedItemData["ItemCGST"])) / 100
                let SgstTax = (parseFloat(SelectedItemData["ItemPrice"]) * parseFloat(SelectedItemData["ItemSGST"])) / 100
                TotalCGST = CgstTax
                TotalSGST = SgstTax
                PriceWithTax = CgstTax + SgstTax + parseFloat(SelectedItemData["ItemPrice"])
                SelectedItemData["TotalCGST"] = TotalCGST * parseFloat(ItemSingleQuantity)
                SelectedItemData["TotalSGST"] = TotalSGST * parseFloat(ItemSingleQuantity)
            }
            else if (BillGSTMode === "InterState") {
                TotalIGST = (parseFloat(SelectedItemData["ItemPrice"]) * parseFloat(SelectedItemData["ItemIGST"])) / 100
                PriceWithTax = TotalIGST + parseFloat(SelectedItemData["ItemPrice"])
                SelectedItemData["TotalIGST"] = TotalIGST * parseFloat(ItemSingleQuantity)
            }
        } else { PriceWithTax = parseFloat(SelectedItemData["ItemPrice"]) }
        SelectedItemData["PriceWithTax"] = PriceWithTax

        //calculate final amount
        SelectedItemData["Quantity"] = ItemSingleQuantity
        SelectedItemData["Amount"] = PriceWithTax * parseFloat(ItemSingleQuantity)

        setSelectedItems([...SelectedItems, SelectedItemData])
        CalculateTotalAmount([...SelectedItems, SelectedItemData])
        setItemSingleSelect("")
        setItemSingleQuantity("")
    }

    const CalculateTotalAmount = (data) => {
        let totalAmount = 0;
        let CGST = 0
        let IGST = 0
        let SGST = 0
        data.forEach(item => totalAmount += item.Amount);
        setTotalAmount(totalAmount)
        if (BillInvoiceType === "TaxInvoice") {
            if (BillGSTMode === "IntraState") {
                data.forEach(item => (CGST += item.TotalCGST, SGST += item.TotalSGST));
                setTotalCGSTAmount(CGST)
                setTotalSGSTAmount(SGST)
            }
            else if (BillGSTMode === "InterState") {
                data.forEach(item => IGST += item.TotalIGST,);
                setTotalIGSTAmount(IGST)
            }
        }
    }
    return (
        <>
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="page-title">
                            <h4>Add New Bill</h4>
                        </div>
                    </div>
                    {/* /add */}
                    <div className="card">
                        <div className="card-body">
                            <CircleSpinner size={20} color="orange" loading={Refreshloading} />
                            <div className="row">
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Client</label>
                                        <select value={BillClient} className="checkInput" onChange={(e) => setBillClient(e.target.value)}>
                                            <option value="" >Select A Client</option>
                                            {TotalClientList && TotalClientList.map((data, index) => (
                                                <option value={data["ClientId"]} key={index}>{data["ClientName"]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            className='time-input'
                                            maxLength="30"
                                            value={BillDate}
                                            onChange={(e) => setBillDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Invoice Type</label>
                                        <select value={BillInvoiceType} className="checkInput" onChange={(e) => (setBillInvoiceType(e.target.value), RerenderColumns(BillGSTMode, e.target.value))} disabled={SelectedItems.length > 0}>
                                            <option value="BillOfSupply" >Bill of Supply</option>
                                            <option value="TaxInvoice" >Tax Invoice</option>
                                        </select>
                                    </div>
                                </div>
                                {BillInvoiceType === "TaxInvoice" &&
                                    <div className="col-lg-3 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label>GST Mode</label>
                                            <select value={BillGSTMode} className="checkInput" onChange={(e) => (setBillGSTMode(e.target.value), RerenderColumns(e.target.value, BillInvoiceType))} disabled={SelectedItems.length > 0}>
                                                <option value="IntraState" >IntraState (same state)</option>
                                                <option value="InterState" >interstate (different state)</option>

                                            </select>

                                        </div>
                                    </div>}
                                <hr></hr>

                                {/* {addmore ? 
                                    <div className='row'>
                                        <div className="col-lg-3 col-sm-3 col-12">
                                            <div className="form-group ">
                                                <label>Working From :</label>
                                                    <input 
                                                        type="time" 
                                                        className='time-input'
                                                        value={WorkStart}
                                                        onChange={(e) => setWorkStart(e.target.value) }
                                                    />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-3 col-12">    
                                            <div className="form-group ">
                                                <label>To :</label>
                                                <input 
                                                    type="time" 
                                                    className='time-input'
                                                    value={WorkEnd}
                                                    onChange={(e) => setWorkEnd(e.target.value) }
                                                />
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                :
                                    <div className="signinform-changed">
                                        <h4>
                                        <span  className="hover-a ml-4 fontSize-12" onClick={()=>setAddmore(true)}>   
                                        Add More ...
                                        </span>
                                        </h4>
                                    </div>
                                } */}

                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Item</label>
                                        <select value={ItemSingleSelect} className="checkInput" onChange={(e) => setItemSingleSelect(e.target.value)}>
                                            <option value="" >Select an Item</option>
                                            {TotalItemList && TotalItemList.map((data, index) => (
                                                <option value={data["ItemId"]} key={index}>{data["ItemName"]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {ItemSingleSelect != "" && <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Quantity</label>
                                        <input
                                            type="number"
                                            maxLength="30"
                                            value={ItemSingleQuantity}
                                            onChange={(e) => setItemSingleQuantity(e.target.value)}
                                        />
                                    </div>
                                </div>}
                                {ItemSingleSelect != "" && ItemSingleQuantity != "" && <div className="col-lg-3 col-sm-6 col-12 mt-4">
                                    <div className="btn btn-primary mt-1" onClick={AddItemToCart}>
                                        Add Item
                                    </div>
                                </div>}

                                <div className="table-responsive col-lg-12">
                                    <Table
                                        className="table datanew dataTable no-footer"
                                        columns={ItemColumns}
                                        dataSource={SelectedItems}
                                        pagination={false}
                                    // rowKey={(record) => record.User_id}
                                    // loading={{ indicator: <div><CircleSpinner size={50} color="black" loading={loading} /> </div>, spinning: loading }}

                                    />
                                    <div className='alignTextToRight mt-4 mb-4'>
                                        {TotalCGSTAmount !== 0 && <p className="ml-4 mb-0 mr-4 billFontColour">CGST : {parseFloat(TotalCGSTAmount).toFixed(2)}</p>}
                                        {TotalSGSTAmount !== 0 && <p className="ml-4 mb-0 mr-4 billFontColour">SGST : {parseFloat(TotalSGSTAmount).toFixed(2)}</p>}
                                        {TotalIGSTAmount !== 0 && <p className="ml-4 mb-0 mr-4 billFontColour">IGST : {parseFloat(TotalIGSTAmount).toFixed(2)}</p>}

                                        <p className="ml-4 mb-0 mr-4 billFontColour">Tax Total : {
                                            TotalCGSTAmount !== 0 && TotalSGSTAmount !== 0 ? (parseFloat(TotalCGSTAmount) + parseFloat(TotalSGSTAmount)).toFixed(2)
                                                : TotalCGSTAmount !== 0 ? parseFloat(TotalCGSTAmount).toFixed(2)
                                                    : TotalSGSTAmount !== 0 ? parseFloat(TotalSGSTAmount).toFixed(2)
                                                        : TotalIGSTAmount !== 0 ? parseFloat(TotalIGSTAmount).toFixed(2) : 0
                                        }</p>
                                        <p className="ml-4 mb-0 mr-4 billFontColour">Total Amount : {parseFloat(TotalAmount).toFixed(2)}</p>
                                        
                                    </div>
                                    <p className='font-underline-and-bold small-text mb-4'>Total Amount (in words): {inWords(parseInt(TotalAmount))}</p>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12 ">
                                    <div className="form-group">
                                        <label>Vehicle No.</label>
                                        <input
                                            type="text"
                                            className='time-input'
                                            maxLength="30"
                                            value={BillVehicleNumber}
                                            onChange={(e) => setBillVehicleNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Date Of Supply</label>
                                        <input
                                            type="date"
                                            className='time-input'
                                            maxLength="30"
                                            value={BillDateOfSupply}
                                            onChange={(e) => setBillDateOfSupply(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-12">
                                    <div className="form-group">
                                        <label>Place of Supply</label>
                                        <input
                                            type="text"
                                            className='time-input'
                                            maxLength="30"
                                            value={BillPlaceOfSupply}
                                            onChange={(e) => setBillPlaceOfSupply(e.target.value)}
                                        />
                                    </div>
                                </div>


                                <div className="col-lg-12 mt-4">
                                    <button className="btn btn-cancel mr-4" onClick={onCancel} disabled={loading}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-submit" onClick={onSubmit} disabled={loading}>
                                        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color="black" loading={loading} /> </div> : "Submit"}
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
export default AddNewClients;