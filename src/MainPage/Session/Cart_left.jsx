//it is a sub file of class component, which desplays the current products

import React,{useState,useContext,useEffect} from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import {CloudFrontDistributionForImageFetch} from "../../api/Aws-api"
import { useForm } from 'react-hook-form'
import { FireworkSpinner,CircleSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from "../../InitialPage/App";
import { dummyProductImage,dummyCatogoryImage } from "../../EntryFile/imagePath";
import { ConstructorEventGet } from "../../Event/ConstructorEvent";
import { FetchItemNamesForCartAutoCompletion,FetchIndividualItemForCart } from "../../api/Aws-api";


const Cart_left = (props) => {
  const [items,setItems] = useState([])
  const { register, getValues } = useForm();
  const [SearchSpinner,setSearchSpinner] = useState(false)
  const [SearchData,setSearchData] = useState([])
  const [FilteredSearchData,setFilteredSearchData] = useState([])
  const [SearchInput,setSearchInput] = useState("")
  const {RoundOff,B2BCurrencyCode,OutletCode} = useContext(ApplicationAttributes)
 //function for sending the selected data to cart

  useEffect(()=>{
    fetchSearchData()
  },[])


  const fetchSearchData = async ()=>{
    setSearchSpinner(true)
    const Category_data = sessionStorage.getItem('SearchItems');
    if (Category_data != "undefined" && Category_data != "null" && Category_data != undefined && Category_data != null){setSearchData(JSON.parse(Category_data));setSearchSpinner(false)}
    const CatogoryData = await ConstructorEventGet(FetchItemNamesForCartAutoCompletion ,{client_code: OutletCode});
    setSearchData(CatogoryData)
    setFilteredSearchData(CatogoryData)
    sessionStorage.setItem('SearchItems', JSON.stringify(CatogoryData))
    setSearchSpinner(false)
  }
  const Clicked = (cartdata) => {
    cartdata.count = 1
    props.func(cartdata);    
  }

  const ClickedItemFromSearchData = async(itemKeys) => {
    setSearchSpinner(true)
    const temp = {"client_code" : OutletCode , "item_code" : itemKeys["item_code"] ,"catogory" : itemKeys["catogory"] }
    let CatogoryData = await ConstructorEventGet(FetchIndividualItemForCart ,temp);
    CatogoryData.count = 1
    props.func(CatogoryData);
    setSearchSpinner(false)
  }
  const BackwardPage = () => {
    props.fetchPrevBatch(); 
  }
  const ForwardPage = () => {
    props.fetchNextBatch(undefined, true); // pass only order
  }
  const HandelSearch = (searchdata) => {
    if(!SearchSpinner){
      if (searchdata === ""){props.setFetchedCatogory(true)}
      else {props.setFetchedCatogory(false)}
      const searchInput = searchdata.toLowerCase();
      setSearchInput(searchInput);
      // Filter the data source based on search input value
      const filtered = SearchData.filter(record =>(record.item_name.toLowerCase().includes(searchInput)||record.item_code.toLowerCase().includes(searchInput)||record.catogory.toLowerCase().includes(searchInput)));
      setFilteredSearchData(filtered);
    }
  }

  const responsiveOptions = {0: {items: 1},600: {items: 3},992: {items: 7}};

  /*
  const fetchsearchdata = async(data) =>{
    const searchapi = "https://f6udfd9v7c.execute-api.us-east-1.amazonaws.com/call/cloudsearch"
    const responseData = await ConstructorEventGet(searchapi,{q:"perfume"});
    console.log(responseData.hits)
    setItems(responseData.hits)
  }*/
  const spinnerWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  return (
    <div className="col-lg-8 col-sm-12 tabs_wrapper">
      <div className="page-header ">
        {props.itemCategory && props.itemCategory.length > 0 ?
        <div className="col-lg-12">
          <div className="col-lg-10 col-md-12 col-sm-12">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                aria-label="Text input with dropdown button"
                value={SearchInput}
                onChange={(e)=>HandelSearch(e.target.value)}
              />
              <button className="btn btn-outline-success ">
              {SearchSpinner ? <CircleSpinner size={20} color ="green" loading={SearchSpinner}/>
              : "search"}
              </button>
              <button className="btn btn-outline-danger" aria-label="Close" onClick={()=>HandelSearch("")}>
                <span >×</span>
              </button>
            </div>
          </div>
        </div> : ""}
      </div>
          {
            SearchInput && SearchInput != "" ?
              <div className="row">
                <div className="totalitem">
                  <h4>{FilteredSearchData && FilteredSearchData.length > 0 ? "Match Found : " + FilteredSearchData.length : null}</h4>
                </div>
                { FilteredSearchData && FilteredSearchData.map((item_data ,index) => (
                    (
                    <div key={index} className="col-lg-3 col-sm-6 d-flex " onClick={()=>ClickedItemFromSearchData(item_data)}>
                      <div className="productset flex-fill">
                        {/* <div className="productsetimg">
                          <img src={CloudFrontDistributionForImageFetch+item_data.image_url} alt="img" />
                          <h6> {item_data&&item_data["stock"]&&item_data["stock"]["StockQuantity"] ? `Qty:${item_data["stock"]["StockQuantity"]}` : ""}</h6>
                        </div> */}
                        <div className="productsetcontent">
                          <h5 className="disable-select">{item_data.catogory}</h5>
                          <h4 className="disable-select">{item_data.item_name}</h4>
                          {/* <h6>{B2BCurrencyCode} {item_data.price}</h6> */}
                        </div>
                      </div>
                    </div>)

                ))}
              </div>
            :
              props.itemCategory && props.itemCategory.length > 0 ?
              <div>
                <ul className=" tabs owl-carousel owl-theme owl-product  border-0 " >
                  <OwlCarousel
                    className="owl-theme"
                    items={7}
                    margin={10}
                    dots={false}
                    nav
                    responsive={responsiveOptions}
                  >
                    
                    {props.itemCategory.map(({ category_name,category_code,image_url,active}) => (
                              
                      <li key={category_code} id={category_code} className={category_code === props.SelectedCategory ? "item active " : " item"} onClick={()=>(props.setSelectedCategory(category_code),props.setFetchedCatogory(true))}>
                        <div className="product-details " >
                          <div className="CategoryImageView">
                            <img src={image_url ? CloudFrontDistributionForImageFetch+image_url : dummyCatogoryImage } alt="img" />
                          </div>
                          <h6>{category_name}</h6>
                        </div>
                        </li>
                      ))}
                  </OwlCarousel> 
                </ul>
                <div className="tabs_container">
                  {props.itemCategory && props.itemCategory.map((data,index ) => (
                      <div key={index} className={data.category_code === props.SelectedCategory ? "tab_content active" : "tab_content"} onClick={()=>(props.setSelectedCategory(data.category_code),props.setFetchedCatogory(true))} > {/*data-tab={data.category_code}*/}
                        <div className="row"> 
                      {props.ItemLoading ? 
                        <div style={spinnerWrapperStyle}>
                        <FireworkSpinner size={70} color ="orange" loading={props.ItemLoading} />
                        </div>
                        :
                        props.item && props.item[0] && props.item[0].length > 0 ?
                         props.item[0].map((item_data ,index) => (
                          <div key={index} className="col-lg-3 col-sm-6 d-flex " onClick={()=>Clicked(item_data)}>
                            <div className="productset flex-fill">
                              <div className="productsetimg">
                                <img src={item_data.image_url ? CloudFrontDistributionForImageFetch+item_data.image_url : dummyProductImage} alt="img" />
                                <h6> {item_data&&item_data["stock"]&&item_data["stock"]["StockQuantity"] ? `Qty:${item_data["stock"]["StockQuantity"]}` : ""}</h6>
                              </div>
                              <div className="productsetcontent">
                                <h5 className="disable-select">{item_data.catogory}</h5>
                                <h4 className="disable-select">{item_data.item_name}</h4>
                                <h6>{B2BCurrencyCode} {(item_data.price).toFixed(parseInt(RoundOff))}</h6>
                              </div>
                            </div>
                          </div>
                          
                          ))
                        :
                          <div className=" productset productsetcontent NoItemInCartBackGround"><iconify-icon icon="pepicons-print:no-entry" style={{ fontSize: "35px" , color: '#FF9F43' }} ></iconify-icon>
                          <br/>Please add an Item!</div>
                        }
                      </div>
                    </div>
                    ))}
                </div>
              </div> 
            : 
              <div style={spinnerWrapperStyle}>
                <FireworkSpinner size={70} color ="orange" loading={props.CategoryLoading} />
                {props.CategoryLoading ? "" : <div className="NoItemInCartBackGround"><iconify-icon icon="pepicons-print:no-entry" style={{ fontSize: "35px" , color: '#FF9F43' }} ></iconify-icon>
                  <br/>Please add a Category to Proceed!
                </div> }
              </div>
      
            }
              {props.itemCategory && props.itemCategory.length > 0 ? props.ItemLoading ? 
            "" :
          <ul className="pagination pagination-sm mb-4 ">
            <li className="page-item">
              {props.ItemLoading ? "" : props.order > 1 ?
                <button className={`btn ${props.order > 1 ? "btn-outline-primary" : "btn-outline-secondary disabled" } `} onClick={BackwardPage}>
                   {"<"}
                </button> 
                :""}
            </li>
            <li className="page-item">
              {props.ItemLoading ? "" : props.item[1] !== "noFurtherData" ? 
                <button onClick={ForwardPage} className={`btn  ${props.item[1] !== "noFurtherData" ? "btn-outline-primary" : "btn-outline-secondary disabled"}`} >
                    {">"}
                </button>
              : "" }
            </li>
            
            
        </ul> : ""}

    </div>
  );
};

export default Cart_left;
