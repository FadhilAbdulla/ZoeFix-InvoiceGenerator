//Template For Listing SalesPerson ,Attributes --> SalesPerson's name,id,phoneNumber,email,address
//in this template we fetch both salesperson data and commission agent data and send the commission agent data to commission agent template as props

import React, { useEffect, useState, useRef, useContext } from "react";
import { Table } from "antd";
import "../../EntryFile/antd.css";
import Tabletop from "../../EntryFile/tabletop"
import { Link, useLocation } from "react-router-dom";
import { ClassicSpinner } from "react-spinners-kit";
import { PlusIcon, search_whites } from "../../EntryFile/imagePath";
import { guidedata_fetch_api } from '../../api/Aws-api'


const Report = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [OrderOfExecution, setOrderOfExecution] = useState();
  const loc = useLocation()

  useEffect(() => {
    const { order_of_execution } = loc.state ? loc.state : {};
    if (order_of_execution) { setOrderOfExecution(order_of_execution) }
    async function fetchdata() {
      setLoading(false)
    }
  }, [])

  const [inputfilter, setInputfilter] = useState(false);
  const uri = useRef(null);
  const togglefilter = (value) => { setInputfilter(value); };



  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
    {
      title: "Phone",
      dataIndex: "Mobile",

    },
    {
      title: "Email",
      dataIndex: "Email",

    },
    {
      title: "Address",
      dataIndex: "Address",
    },
    {
      title: "GSTIN/UIN",
      dataIndex: "gstnumber",
    },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Report</h4>
              <h6>This part is under construction, Please Come back After SomeTime</h6>
            </div>
            {/* <div className="page-btn">
              <Link to="/dream-pos/session/addsales_person" state={{ order_of_execution: OrderOfExecution + 1, uri: uri.current }} className="btn btn-added">
                <img src={PlusIcon} alt="img" className="me-1" />
                Add New Client
              </Link>
            </div> */}
          </div>
          {/* <div className="card">
            <div className="card-body">
              <Tabletop inputfilter={inputfilter} togglefilter={togglefilter} />
              {/* /Filter               <div
                className={`card mb-0 ${inputfilter ? "toggleCls" : ""}`}
                id="filter_inputs"
                style={{ display: inputfilter ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Name" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Phone" />
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-6 col-12">
                      <div className="form-group">
                        <input type="text" placeholder="Enter Email" />
                      </div>
                    </div>

                    <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                      <div className="form-group">
                        <a className="btn btn-filters ms-auto">
                          <img src={search_whites} alt="img" />
                        </a>
                      </div>
                    </div>
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
          </div> */}

        </div>
      </div>
    </>
  );
};
export default Report;