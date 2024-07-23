//Template For Product Display, Selecting the Products and adding it in the cart,Procced To checkout
//Attributes --> Products,ProductsInCart,Commission,Tax,Discount
//Cart Have two Components, Cart_left.jsx and this file
//Cart_left file displays the Products and this file displays the cart details, Total amount, etc...

import React, { useEffect, useState, useRef, useContext } from "react";
import { SalesAttributes } from './index'
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Cart_left from "./Cart_left";
import $ from 'jquery';
import { CircleSpinner } from "react-spinners-kit";
import { AddNewBill_Billingtable, CloudFrontDistributionForImageFetch, fetchItemsForCart, FetchItemCategory } from '../../api/Aws-api'
import { delete2, dummyProductImage } from "../../EntryFile/imagePath";
import { GetDateTime, getEpochTime, ForwardUriFetchFunction, errorMessage, FetchActiveCategory } from '../Functions/CommonFunctions'
import { ConstructorEventGet, ConstructorEventPost, FormSubmitEvent } from "../../Event/ConstructorEvent";
import { ApplicationAttributes } from "../../InitialPage/App";


const Cart = (props) => {
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const [items, setItems] = useState([])
  const [SelectedCategory, setSelectedCategory] = useState("")
  const [itemCategory, setItemCategory] = useState([])
  const [incart, setIncart] = useState([]);
  const [FetchedCatogory, setFetchedCatogory] = useState(false);
  const [loading, setLoading] = useState(false)
  const [CategoryLoading, setCategoryLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const tab = useRef()
  const lastKey = useRef()
  const order = useRef()
  const uri = useRef(null);
  const navigate = useNavigate()
  const loc = useLocation()
  const date = GetDateTime()
  const epochTime = getEpochTime()
  const { setCart_id, commission_agent_name, customer_name, customer_id, commission_agent_id, sales_persion_name, sales_persion_id, session_id, InitiatorCode } = useContext(SalesAttributes)
  const { RoundOff, OutletCode, B2BCurrencyCode, B2BName } = useContext(ApplicationAttributes)
  const tax_percentage = 20


  useEffect(() => {
    fetchCatogory()
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) { setOrderOfExecution(order_of_execution); uri.current = ForwardUriFetchFunction(order_of_execution, InitiatorCode) }
  }, []);

  useEffect(() => {
    if (FetchedCatogory) { fetchNewTabdata(SelectedCategory) }
  }, [FetchedCatogory, SelectedCategory]);

  const fetchCatogory = async () => {
    setCategoryLoading(true)
    let AlreadyFetchedFlag = false
    const Category_data = sessionStorage.getItem('ItemCatogory');
    if (Category_data != "undefined" && Category_data != "null" && Category_data != undefined && Category_data != null) {
      setItemCategory(JSON.parse(Category_data));
      if (SelectedCategory === "") {
        const ActiveElement = FetchActiveCategory(JSON.parse(Category_data))
        setSelectedCategory(ActiveElement)
        fetchNewTabdata(ActiveElement)
        AlreadyFetchedFlag = true
      }
      setCategoryLoading(false)
      setLoading(false)
    }
    const CatogoryData = await ConstructorEventGet(FetchItemCategory, { client_code: OutletCode });
    if (SelectedCategory == "" && !AlreadyFetchedFlag) {
      const ActiveElement = FetchActiveCategory(CatogoryData)
      setSelectedCategory(ActiveElement)
      fetchNewTabdata(ActiveElement)
    }
    setItemCategory(CatogoryData)
    sessionStorage.setItem('ItemCatogory', JSON.stringify(CatogoryData))
    setCategoryLoading(false)
  }


  const fetchNewTabdata = async (selectedtab) => {
    tab.current = selectedtab
    order.current = 1
    FetchingCommonFormat(selectedtab, 1)
  }

  const fetchExistingTabData = async () => {
    FetchingCommonFormat(tab.current, order.current + 1)
    order.current = order.current + 1
  }

  const FetchingCommonFormat = async (tab, order) => {
    var ItemDetails = JSON.parse(sessionStorage.getItem('ItemDetails')) ? JSON.parse(sessionStorage.getItem('ItemDetails')) : {}
    if (ItemDetails !== null && ItemDetails[tab + order] !== undefined) { setItems(ItemDetails[tab + order]) }
    else { setItemLoading(true) }
    const params = order === 1 ? { Catogory: tab } : { Catogory: tab, LastEvaluatedKey: lastKey.current }
    const responseData = await ConstructorEventPost(fetchItemsForCart, { "payload": { "Item": params }, clientCode: OutletCode })
    ItemDetails[tab + order] = responseData
    if (responseData[1] !== "noFurtherData") { lastKey.current = responseData[1] }
    sessionStorage.setItem('ItemDetails', JSON.stringify(ItemDetails))
    setItems(responseData)
    setItemLoading(false)
  }

  const fetchPrevBatch = () => {
    var ItemDetails = JSON.parse(sessionStorage.getItem('ItemDetails')) ? JSON.parse(sessionStorage.getItem('ItemDetails')) : {}
    if (ItemDetails !== null && ItemDetails[tab.current + (order.current - 1)] !== undefined) { setItems(ItemDetails[tab.current + (order.current - 1)]) }
    order.current = order.current - 1
  }
  //fetch the data from backend and store in a useref and if already the data is available in the useref use it and replace with new data
  //also check for the lastevaluted key in the response, for taking the next set of data from backend
  /*async function fetchdata(selectedtab,Next){
    //for checking if the data of selected dab is present
    if (selectedtab !== undefined){tab.current = selectedtab}
    var ItemDetails = JSON.parse(sessionStorage.getItem('ItemDetails')) ? JSON.parse(sessionStorage.getItem('ItemDetails')) : {}
    //reverse the order of pagination
    let params = ""
    if (Next === undefined) {params = {Catogory:tab.current};order.current = 1}
    else if (Next){params = {Catogory:tab.current,LastEvaluatedKey:lastKey.current};order.current = order.current + 1}
    else {params = false;order.current = order.current -1;setPagination(true)}
    //checking if data is present in cache
    if (ItemDetails !== null && ItemDetails[tab.current+order.current] !== undefined){setItems(ItemDetails[tab.current+order.current])}
    else {setItemLoading(true);console.log("no data")}
    //fetch the data
    if (params){
      const responseData = await ConstructorEventPost(fetchItemsForCart,{"payload": {"Item": params},clientCode : OutletCode})
      console.log(responseData)
      if (responseData[1]){setPagination(true);lastKey.current = responseData[1]}
      else {setPagination(false)}
      ItemDetails[tab.current+order.current] = responseData[0]
      sessionStorage.setItem('ItemDetails', JSON.stringify(ItemDetails))
      setItems(responseData.errorMessage ? [] : responseData)
    }
    setItemLoading(false)
  } */



  //code for firing the pop up for delete confirmation
  const confirmText = (item_code) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    }).then(function (t) { t.value && setIncart(deleteitemincart(item_code)) });
  };
  //code for firing the pop up for emptying the cart conformation
  const confirmAlldelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: !0,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      confirmButtonClass: "btn btn-primary",
      cancelButtonClass: "btn btn-danger ml-1",
      buttonsStyling: !1,
    }).then(function (t) {

      t.value &&
        Swal.fire({
          type: "success",
          title: "Deleted!",
          text: "Your Cart has been cleared.",
          confirmButtonClass: "btn btn-success",
          isConfirmed: setIncart([]),
        });
    });
  };

  const YourCartIsEmpty = () => {
    Swal.fire({
      type: "warning",
      title: "Your Cart is Empty!",
      // text: "Your Dont Have an Item in cart to Remove",
      confirmButtonClass: "btn btn-success"
    })
  }
  //code for pulling the selected data from the Cart_left To this file
  const pull_data = (cartdata) => {
    setIncart(cartdata ? addincart(cartdata) : incart)
  }
  //reset the timeout time and start from the begining
  /*
    const resetTimeout = () => {
      let timeoutId;
      clearTimeout(timeoutId);
      //timeoutId = setTimeout(() => {console.log(timeoutId)}, 1 * 5 * 1000); // 3 minutes in milliseconds
    };
    //listen the event in the ui, for setting timeout
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keydown', resetTimeout);
    document.addEventListener('click', resetTimeout);*/



  // add pulled product in cart
  const addincart = (data) => {
    let exist = false;
    if (incart.length != 0) {
      for (let i = 0; i < incart.length; i++) {
        if (data.item_code == incart[i].item_code) { exist = true }
      }
    }
    if (exist) {
      return incrementcount(data.item_code)
    }
    else {
      return addnewincart(data)
    }
  }

  //increment the count of the component which exist in the cart
  const incrementcount = (item_code) => {
    const updatedfile = incart.map((item) => {
      if (item_code === item.item_code) {
        return { ...item, count: item.count < item["stock"]["StockQuantity"] ? item.count + 1 : item.count };
      } return item;
    })
    return updatedfile
  };

  //decrement the count of the component which exist in the cart
  const decrementcount = (item_code) => {
    const updatedfile = incart.map((item) => {
      if (item_code === item.item_code) {
        return { ...item, count: item.count > 1 ? item.count - 1 : 0 };
      } return item;
    })
    return updatedfile
  };

  //add new item in the cart  
  const addnewincart = (data) => {
    return incart.concat(data)
  }
  //delete an item in the cart
  const deleteitemincart = (item_code) => {
    return incart.filter(data => data.item_code !== item_code)
  }
  //calculate the totalamount of the products in the cart
  const TotalAmount = incart.reduce(function (total, data) {
    return total + data.price * (data.count > 0 ? data.count : 0)
  }, 0
  );
  //calculate the totalitem present in the cart
  const Totalitem = incart.reduce(function (total, data) {
    return total + (data.count > 0 ? data.count : 0)
  }, 0
  );

  const addBillingDatatoCloud = async () => {
    setLoading(true)
    let ItemDetails = [];
    let i;
    let sales_agent_amount = 0;
    let commission_agent_amount = 0;
    for (i = 0; i < incart.length; i++) {
      let dict = {}
      dict['item_id'] = incart[i]["item_code"];
      dict['item_name'] = incart[i]["item_name"];
      dict['item_qty'] = incart[i]["count"];
      dict['item_price'] = (parseFloat(incart[i]["price"]).toFixed(parseInt(RoundOff)));
      dict['item_catogory'] = incart[i]["catogory"];
      dict['commission_agent_amount'] = ((parseFloat(incart[i]["price"]) / 10).toFixed(parseInt(RoundOff)));
      dict['sales_agent_amount'] = (parseFloat(incart[i]["price"] / 10).toFixed(parseInt(RoundOff)));
      dict['tax_percentage'] = tax_percentage;
      dict['tax_amount'] = ((parseFloat(incart[i]["price"] * tax_percentage) / 100).toFixed(parseInt(RoundOff)));
      dict['discount_amount'] = "no-data"
      dict['discount_percentage'] = "no-data"
      ItemDetails[i] = dict
      commission_agent_amount = commission_agent_amount + (parseFloat(incart[i]["price"] / 10) * parseFloat(incart[i]["count"]))
      sales_agent_amount = sales_agent_amount + (parseFloat(incart[i]["price"] / 10) * parseFloat(incart[i]["count"]))
    }
    console.log(ItemDetails)
    const formData = {
      "clientCode": OutletCode,
      "payload": {
        "Item": {
          "CreatedDateTimeStamp": String(date),
          "UpdatedDateTimeStamp": String(date),
          "CreatedBy": B2BName,
          "UpdatedBy": B2BName,
          "since_unix_time": epochTime,
          "commission_agent_id": commission_agent_id,
          "commission_agent_name": commission_agent_name,
          "sales_persion_name": sales_persion_name,
          "sales_persion_id": sales_persion_id,
          "customer_id": customer_name,
          "customer_name": customer_id,
          "total_amount": String(TotalAmount.toFixed(parseInt(RoundOff))),
          "total_discount_amount": String(0),
          "total_discount_percentage": String(0),
          "item_details": ItemDetails,//item cant be used as name, because it is reserved name
          "session_id": session_id,
          "commission_agent_amount": commission_agent_amount.toFixed(parseInt(RoundOff)),
          "sales_agent_amount": sales_agent_amount.toFixed(parseInt(RoundOff))
          //"Total_Item_Count" : String(Totalitem),
          //"Total_Salesman_Commission" : String(Total_Salesman_Commission/10),
          //"Total_Agent_Commission" : String(Total_Agent_Commission/10),
          //"Total_Tax_Amount" : String(Total_Tax_Amount),
          //"Remark" : "sample",
        }
      }
    };

    const responseData = await FormSubmitEvent(AddNewBill_Billingtable, formData);
    setCart_id(responseData && responseData[0])
    setLoading(false)
    navigate(uri.current, { state: { Total: TotalAmount, Cart_id: responseData[0], Cartdata: incart, date: String(date), order_of_execution: OrderOfExecution + 1 } });
  }


  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <Cart_left
              func={pull_data}
              item={items}
              order={order.current}
              setFetchedCatogory={setFetchedCatogory}
              itemCategory={itemCategory}
              page={order.current}
              fetchNextBatch={fetchExistingTabData}
              fetchPrevBatch={fetchPrevBatch}
              ItemLoading={itemLoading}
              CategoryLoading={CategoryLoading}
              SelectedCategory={SelectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <div className="col-lg-4 col-sm-12 ">
              <div className="order-list">
                <div className="orderid">
                  <h4>Order List</h4>

                </div>
                <div className="actionproducts">
                  <ul>
                    <li>
                      {/*<Link
                          to="#"
                          className="deletebg confirm-text"
                          onClick={Totalitem ? confirmAlldelete : null}>
                          <img src={delete2} alt="img" />
                          </Link>*/}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card card-order">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <Link to="#" className="btn btn-adds" >
                        <i className="fa fa-barcode me-2" />
                        Scan Bardcode
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="split-card"></div>
                <div className="card-body col-12">
                  <div className="totalitem">
                    <h4>Total items : {Totalitem}</h4>
                    <Link to="#" onClick={Totalitem ? confirmAlldelete : YourCartIsEmpty}>
                      Clear all</Link>
                  </div>
                  <div className="product-table">

                    {incart.map(({ item_name, image_url, count, price, item_code, stock }) => (

                      <ul className="product-lists" key={item_code}>
                        <li>
                          <div className="productimg">
                            <div className="productimgs">
                              <img src={image_url ? CloudFrontDistributionForImageFetch + image_url : dummyProductImage} alt="img" />
                            </div>
                            <div className="productcontet">
                              <h4>{item_name}</h4>
                              <div className="productlinkset">
                                <h5>{B2BCurrencyCode}{(price * count).toFixed(parseInt(RoundOff))}</h5>
                              </div>
                              <div className="increment-decrement">
                                <div className="input-groups">
                                  <div onClick={() => count <= 1 ? confirmText(item_code) : setIncart(decrementcount(item_code))}
                                    className="button-minus dec button increment-decrement-button disable-select"> - </div>
                                  <span className="quantity-field">{count}</span>
                                  <div onClick={() => stock && stock["StockQuantity"] && count < stock["StockQuantity"] ? setIncart(incrementcount(item_code)) : null}
                                    className="button-plus inc button increment-decrement-button disable-select"> + </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </li>
                        <li>
                          <Link
                            to="#"
                            className="confirm-text"
                            onClick={() => confirmText(item_code)}
                          >
                            <img src={delete2} alt="img" />
                          </Link>
                        </li>
                      </ul>
                    ))}

                  </div>
                </div>


                <div className="split-card"></div>
                <div className="card-body pt-0 pb-2">
                  <div className="setvalue">
                    <ul>
                      <li>
                        <h5>Subtotal </h5>
                        <h6>{B2BCurrencyCode}{TotalAmount.toFixed(parseInt(RoundOff))}</h6>
                      </li>
                      <li>
                        <h5>Tax </h5>
                        <h6>{B2BCurrencyCode}0</h6>
                      </li>
                      <li className="total-value">
                        <h5>Total</h5>
                        <h6>{B2BCurrencyCode}{TotalAmount.toFixed(parseInt(RoundOff))}</h6>
                      </li>
                    </ul>
                  </div>


                  {loading ?
                    <div style={{ alignItems: 'center', justifyContent: 'center', }} className="btn-totallabel">
                      <CircleSpinner size={20} color="White" loading={loading} />
                    </div>
                    :
                    <div className="btn-totallabel" onClick={() => incart.length > 0 ? addBillingDatatoCloud() : errorMessage("please add an item in cart")} >
                      <h5>Proceed To Payment</h5>
                      <h6>{B2BCurrencyCode} {TotalAmount.toFixed(parseInt(RoundOff))}</h6>
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

export default Cart;
