import React,{useState} from "react";
import { Table } from "antd";
import "./antd.css";
import { ClassicSpinner } from "react-spinners-kit";


const Datatables = ({ props, columns, dataSource,loading1 ,pagination}) => {
  return (
    <Table    
      className="table datanew dataTable no-footer"      
      columns={columns}
      dataSource={dataSource}      
      pagination={pagination}
      rowKey={(record) => record.User_id}
      //loading={{ indicator: <div><ClassicSpinner size={50} color ="black" loading={loading1} /> </div>, spinning: loading1}} 

    />
  );
};

export default Datatables;
