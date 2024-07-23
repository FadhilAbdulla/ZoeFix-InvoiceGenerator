import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import { Link, useLocation } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { PlusIcon, Search } from "../../EntryFile/imagePath";
import { ClientGet } from "../../api/Aws-api";
import { ConstructorEventGet } from "../../Event/ConstructorEvent";
import { errorMessage } from "../Functions/CommonFunctions";


const Clients = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchdata() {
      setLoading(true)
      const responseData = await ConstructorEventGet(ClientGet);
      if (responseData["statusCode"] === 200) {setData(responseData["body"])}
      else if (responseData["statusCode"] === 500) {errorMessage(["Something Went Wrong!"])}
      else {errorMessage("Server Error")}
      setLoading(false)
    }
    fetchdata()
  }, [])

  const columns = [
    {
      title: "Client Name",
      dataIndex: "ClientName",
      sorter: (a, b) => a.ClientName.length - b.ClientName.length,
    },
    {
      title: "Phone",
      dataIndex: "ClientMobile",

    },
    {
      title: "Email",
      dataIndex: "ClientEmail",

    },
    {
      title: "Address",
      dataIndex: "ClientState",
    },
    {
      title: "GSTIN/UIN",
      dataIndex: "ClientGstNumber",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Clients</h4>
              <h6>Client list</h6>
            </div>
            <div className="page-btn">
              <Link to="/zoefix/clients/addnewclient" className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Client
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
export default Clients;