import React, { useState, useEffect, useRef, useContext } from "react";
import { Navigate, Link } from 'react-router-dom';
import { Dash1, Dash2, Dash3, Dash4, Dropdown, } from "../EntryFile/imagePath";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { Excel, Pdf, Printer } from "../EntryFile/imagePath";
import Table from "../EntryFile/datatables"
import Chart from "react-apexcharts";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { ClassicSpinner } from "react-spinners-kit";
import { ApplicationAttributes } from "../InitialPage/App";

const Dashboard = () => {
  const [selectyear, setSelectyear] = useState("2023")
  const [loading, setLoading] = useState(false)
  const chartRef = useRef(null);
  const { OutletCode, B2BCurrencyCode, setHeaderLoading } = useContext(ApplicationAttributes)

  useEffect(() => {
    const intervalID = setInterval(() => {
      // fetchdata()
      console.log("Auto Refresh Initiated");
    }, 60 * 1000);
    return () => { clearTimeout(intervalID); };

  }, [])

  const spinnerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const spinnerWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const ChartOptions = {
    colors: ["#28C76F", "#EA5455"],
    chart: {
      type: "bar",
      height: 300,
      stacked: true,

      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          legend: {
            position: "bottom",
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadius: 5,
        borderRadiusTop: 5,
      },
    },
    xaxis: {
      categories: [
        " Jan ",
        "feb",
        "march",
        "april",
        "may",
        "june",
        "july",
        "auguest",
      ],
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
  };

 
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {loading ?
              <div style={spinnerStyle}>
                <div style={spinnerWrapperStyle}>
                  <ClassicSpinner size={50} color="black" loading={loading} />
                </div></div>
              : null}
          <div>
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="dash-widget dash3">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash1} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>
                      {B2BCurrencyCode}
                      <span className="counters">
                        <CountUp end={500} />
                      </span>
                    </h5>
                    <h6>Total Monthly Sale</h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="dash-widget dash3">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash1} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>
                      {B2BCurrencyCode}
                      <span className="counters">
                        <CountUp end={500} />
                      </span>
                    </h5>
                    <h6>Total Monthly Purchase</h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="dash-widget dash3">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash1} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>
                      {B2BCurrencyCode}
                      <span className="counters">
                        <CountUp end={500} />
                      </span>
                    </h5>
                    <h6>Total Profit</h6>
                  </div>
                </div>
              </div>
            </div>
            {/*Dash Widget*/}
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12 d-flex">
                <div className="dash-count">
                  <div className="dash-counts">
                    <h4>{2}</h4>
                    <h5>New Clients</h5>
                  </div>
                  <div className="dash-imgs">
                    <FeatherIcon icon="user" />
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12 d-flex">
                <div className="dash-count">
                  <div className="dash-counts">
                    <h4>{5}</h4>
                    <h5>All Clients</h5>
                  </div>
                  <div className="dash-imgs">
                    <FeatherIcon icon="user" />
                  </div>
                </div>
              </div>
            </div>
            {/* dash_chart */}
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Yearly Sales and Profit Chart</h5>
                    {/* <div className="graph-sets">
                      <div className="dropdown" >
                        <select className="form-control" value={selectyear} onChange={handleYearChange}>
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                        </select>
                      </div>
                    </div> */}
                  </div>
                  <div className="card-body">
                    <div className="table-top">
                      <div className="search-set"> </div>
                      <div className="wordset">
                        <ul>
                          <ReactTooltip place="top" type="dark" effect="solid" />
                          <li>
                            <a data-tip="Pdf">
                              <img src={Pdf} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Excel">
                              <img src={Excel} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Print">
                              <img src={Printer} alt="img" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div ref={chartRef}>
                      <Chart
                        options={ChartOptions}
                        series={[]}
                        type="bar"
                        height={250}
                      /></div>
                  </div>
                </div>
              </div>

            </div>
            {/* data tables */}
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Client Wise Sales</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-top">
                      <div className="search-set"> </div>
                      <div className="wordset">
                        <ul>
                          <ReactTooltip place="top" type="dark" effect="solid" />
                          <li>
                            <a data-tip="Pdf">
                              <img src={Pdf} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Excel">
                              <img src={Excel} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Print">
                              <img src={Printer} alt="img" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive dataview" >
                      <Table
                        columns={null}
                        dataSource={null}
                        pagination={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-sm-12 col-12 d-flex">
                <div className="card flex-fill">
                  <div className="card-header pb-0 d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Category Wise Sales</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-top">
                      <div className="search-set"> </div>
                      <div className="wordset">
                        <ul>
                          <ReactTooltip place="top" type="dark" effect="solid" />
                          <li>
                            <a data-tip="Pdf">
                              <img src={Pdf} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Excel">
                              <img src={Excel} alt="img" />
                            </a>
                          </li>
                          <li>
                            <a data-tip="Print">
                              <img src={Printer} alt="img" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive dataview" >
                      <Table
                        columns={null}
                        dataSource={null}
                        pagination={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          {/* <div
            className="refreshButton"
            onClick={fetchdata}>
            <div className="refreshButtonInside">
              {refreshSpinnner ?
                <CircleSpinner size={20} color="orange" loading={refreshSpinnner} /> :
                <iconify-icon icon="ic:baseline-refresh" style={{ color: 'orange', fontSize: '25px' }} ></iconify-icon>}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
