import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import { Link, useLocation,useNavigate } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { PlusIcon, Search,Printer } from "../../EntryFile/imagePath";
import { ConstructorEventGet } from "../../Event/ConstructorEvent";
import { BillGet } from "../../api/Aws-api";
import { errorMessage } from "../Functions/CommonFunctions";



const ListBill = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchdata() {
      setLoading(true)
      const responseData = await ConstructorEventGet(BillGet);
      if (responseData["statusCode"] === 200) {setData(responseData["body"])}
      else if (responseData["statusCode"] === 500) {errorMessage(["Something Went Wrong!"])}
      else {errorMessage("Server Error")}
      setLoading(false)
    }
    fetchdata()
  }, [])

  const NavigateToPrintSessionBill = (BillId) => {
    console.log("fdds")
    navigate("/zoefix/report/generatetaxinvoice",{state: {BillId: BillId}})
  }
  const columns = [
    {
      title: "Client Name",
      dataIndex: "BillClientName",
      sorter: (a, b) => a.BillClientName.length - b.BillClientName.length,
    },
    {
      title: "Date",
      dataIndex: "BillDate",

    },
    {
      title: "Invoice Type",
      dataIndex: "BillInvoiceType",
    },
    
    {
      title: "Total Amount",
      dataIndex: "BillTotal",
    },
    {
      title: "Action",
      render: (record) => (
        <>
            <div className="confirm-text " style={{ cursor: 'pointer' }} onClick={()=>NavigateToPrintSessionBill(record.BillId)}>
              <img src={Printer} alt="img" />
            </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Bill</h4>
              <h6>Bill list</h6>
            </div>
            <div className="page-btn">
              <Link to="/zoefix/bill/addnewbill" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Generate New Bill
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      className="form-control form-control-sm search-icon"
                      type="text"
                      placeholder="Search..."
                    />
                    <Link to="#" className="btn btn-searchset">
                      <img src={Search} alt="img" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <Table
                  className="table datanew dataTable no-footer"
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  rowKey={(record) => record.User_id}
                  loading={{ indicator: <div><ClassicSpinner size={50} color="black" loading={loading} /> </div>, spinning: loading }}

                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ListBill;