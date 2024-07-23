import React, { useState , useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Table } from "antd";
import Tabletop from "../../EntryFile/tabletop"
import {PlusIcon,EditIcon,DeleteIcon} from "../../EntryFile/imagePath";
import { FetchItemCategory,CloudFrontDistributionForImageFetch,UpdateCategoryDetails} from "../../api/Aws-api";
import { ConstructorEventGet,ConstructorEventPost } from "../../Event/ConstructorEvent";
import { ClassicSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from "../../InitialPage/App";
import { successMessage,errorMessage } from "../Functions/CommonFunctions";
import { Search} from "../../EntryFile/imagePath";


const CatogoryList = () => {
  const [inputfilter, setInputfilter] = useState(false);  
  const [CategoryList, setCategoryList] = useState([]);
  const [FilteredCategoryList,setFilteredCategoryList] = useState([])
  const [SearchInput,setSearchInput] = useState("")

  const [loading,setLoading] = useState(false)
  const {OutletCode} = useContext(ApplicationAttributes)

  useEffect(() => {
    fetchdata()
  },[])
const fetchdata = async() =>{
  setLoading(true)
  const responseData = await ConstructorEventGet(FetchItemCategory ,{client_code: OutletCode});
  console.log(responseData)
  setCategoryList(responseData.errorMessage ? [] : responseData)
  setFilteredCategoryList(responseData.errorMessage ? [] : responseData)
  setLoading(false)
}

  const togglefilter = (value) => {    
    setInputfilter(value);  
  };
  const confirmText = (Item_data) => {
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
      t.value && DeleteAnItem(Item_data)});
  };



  const columns = [
    {
      title: "Category Name",
      dataIndex: "category_name",
      render: (text, record) => (
        <div className="productimgname">
          {record && record.image_url ? <Link to="#" className="product-img">
            <img alt="" style={{ width: "40px", height: "40px" }} src={CloudFrontDistributionForImageFetch + record.image_url} />
          </Link> : ""}
          <Link to="#" style={{ fontSize: "15px", marginLeft: "10px"  }}>
            {record.category_name}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.category_name.length - b.category_name.length,
    },  
    {
      title: "Action",
      render: (record) => (
        <>
          <>
            <Link className="confirm-text" to="#" onClick={()=>confirmText(record)}>
              <img src={DeleteIcon} alt="img" />
            </Link>
          </>
        </>
      ),
    },
  ];
  const DeleteAnItem = async (Item_data) => {
    setLoading(true)
    const responsedata = await ConstructorEventPost(UpdateCategoryDetails,{params : Item_data,delete : true,clientCode : OutletCode})
    if (responsedata === "deleted"){successMessage("Category Deleted");fetchdata()}
    else {errorMessage("Category Deletion Failed")}
    setLoading(false)
  }

  const HandelSearch = (searchdata) => {
    const searchInput = searchdata.toLowerCase();
    setSearchInput(searchInput);
    // Filter the data source based on search input value
    const filtered = CategoryList.filter(record =>(record.category_name.toLowerCase().includes(searchInput)||record.category_code.toLowerCase().includes(searchInput)));
    setFilteredCategoryList(filtered);
  }
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Category List</h4>
              <h6>Manage your Category</h6>
            </div>
            <div className="page-btn">
              <Link
                to="/dream-pos/item/AddNewCatogory"
                className="btn btn-added"
              >
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Category
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    className="form-control form-control-sm search-icon"
                    type="text"
                    placeholder="Search..."
                    value={SearchInput}
                    onChange={(e)=>HandelSearch(e.target.value)}
                  />
                  <div className="btn btn-searchset">
                    <img src={Search} alt="img" />
                  </div>
                </div>
              </div>
            </div>
              
              <div className="table-responsive">
                <Table                                    
                  columns={columns}
                  dataSource={FilteredCategoryList}   
                  rowKey={(record) => record.category_code}
                  loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading} /> </div>, spinning: loading}}          
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
    </>
  );
};
export default CatogoryList;
