import React,{useState,useRef ,useContext,useEffect} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import { ForwardUriFetchFunction,GetDate,SimpleSwalNotification,successMessage,FetchOutletImage } from '../../Functions/CommonFunctions';
import { SalesAttributes } from '../index';
import { Table,Tooltip } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { ApplicationAttributes } from "../../../InitialPage/App";
import { FormSubmitEvent,uploadImage } from '../../../Event/ConstructorEvent';
import { CreateNewInspectionReport,CloudFrontDistributionForOutletDataFetch } from '../../../api/Aws-api';
import { CircleSpinner } from 'react-spinners-kit';


const EditInspectionReportReview = () => {
    const [OrderOfExecution, setOrderOfExecution] = useState();
    const loc = useLocation()
    const navigate = useNavigate()
    const uri = useRef(null);
    const {InitiatorCode,InspectionReportHeaderData,InspectionReportTableData,InspectionReportImage,InspectionReportCommentsData,InspectionReportId,setInspectionReportId} = useContext(SalesAttributes)    
    const [loading,setLoading] = useState(false)
    const {OutletCode,B2BName} = useContext(ApplicationAttributes)
    const CurrentDate = GetDate()
    const OutletHeaderImage = FetchOutletImage()

    useEffect(()=> {
        const { order_of_execution } = loc.state ? loc.state : {};
        if (order_of_execution) {setOrderOfExecution(order_of_execution);uri.current = ForwardUriFetchFunction(order_of_execution,InitiatorCode)}
    })

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      pageStyle: '@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin-top: 20mm; margin-bottom: 20mm; #header {content: none; } #footer {display: none; }} } '
    });

    const HeaderData = InspectionReportHeaderData
    const columns = [
        {dataIndex: "name"},
        {
            dataIndex: 'data',
            ellipsis: true, // Enable ellipsis
            render: (text) => <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
          }
    ];
    const TableData = InspectionReportTableData
    const ImageData = InspectionReportImage 
    const CommentData = InspectionReportCommentsData
    const DivideSentenceintoPieces = (data) => {return data.split(".").filter((item) => item !== "")}

    const SendWarningNotification = async () => {
        const messageHeading = "Are You Sure ?"
        const MessageBody = "You can't change the Report after Printing"
        const response =await SimpleSwalNotification(messageHeading,MessageBody)
        return response
    }
    
    
    
    const addInspectionReportDatatoCloud = async () =>  {
        if (InspectionReportId === ""){
            const response = await SendWarningNotification()
            console.log(response)
            if (response){
                setLoading(true)
                handlePrint()
                const FileNames = ImageData.map((file) => ({ name: file.name, type: file.type }))
                const formData = {
                    "clientCode" : OutletCode,
                    "ImageFileNames" : FileNames,
                    "params":{
                    "HeaderData": InspectionReportHeaderData,
                    "TableData" : InspectionReportTableData,
                    "CommentData" : InspectionReportCommentsData,
                    "InspectionReportDate" : CurrentDate
                    }
                };
                const responseData = await FormSubmitEvent(CreateNewInspectionReport,formData);
                //const PDFData = await handleConvertToPdf()
                //const element = componentRef.current;
                //const pdf = new html2pdf();
                let flag = true
                for (let FileUrldata of responseData){
                    const foundFile = ImageData.find((file) => file.name === FileUrldata["fileName"])
                    const response = await uploadImage(FileUrldata["uploadUrl"],foundFile)
                    if (response["status"] == 200){console.log(FileUrldata["fileName"],"done")}
                    else {flag = false}
                }
                if (flag) {successMessage("Inpection Report Saved SuccesFully")}
                navigate(uri.current,{state: {order_of_execution: OrderOfExecution+1}})
            }
        }
        else {
            setLoading(true)
            handlePrint()
            navigate("/dream-pos/dashboard")
            setInspectionReportId("")
        }
        setLoading(false)
    }

    return (
        <div className="page-wrapper">
            <div className="content" >
                <div className="page-header">
                    <div className="page-title">
                    <h4>Final Report Review</h4>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row ml-4" ref={componentRef}>
                            <div className="col-12 mt-4 InspectionReviewHeaderDisplay" >
                                {HeaderData.map((item,index) => (
                                    <div className='row' key={index}>
                                    <div className='col-lg-3 col-sm-3 col-12'>{item.name}</div>
                                    <div className='col-lg-9 col-sm-9 col-12'>: {item.data}</div>
                                    </div>
                                ))
                                }
                            </div>
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-12 mt-4">
                                {TableData.length > 0 && <Table
                                className="table datanew dataTable no-footer"      
                                columns={columns}
                                dataSource={TableData}      
                                pagination={false}
            
                                />
                                }
                            </div>
                            <div className='col-12 mt-4 row'>
                                {
                                InspectionReportId === "" ? 
                                    ImageData.map((image, index) => (
                                        <div className="col-lg-3 col-sm-3 col-3 pb-4" >
                                            <div className='image-container-inspection'>
                                                <img
                                                    key={index}
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Image ${index}`}
                                                    style={{borderRadius: "10px"}}
                                                />
                                            </div>
                                        </div>
                                    ))
                                :
                                ImageData.map((FileName, index) => (
                                    <div className="col-lg-3 col-sm-6 col-12 pb-4" >
                                        <div className='image-container-inspection'>
                                            <img src={CloudFrontDistributionForOutletDataFetch+FileName}
                                                 alt={`Image ${index}`}
                                                 style={{borderRadius: "10px"}}
                                            />
                                        </div>
                                    </div>
                                ))
                                } 
                            </div>
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-12 mt-4">
                                {CommentData.map((item,index) => (
                                    <div  key={index}>
                                        <div className='InspectionReviewCommentHeader'>{item.name} :</div>
                                            {DivideSentenceintoPieces(item.data).map((data)=>(
                                                <div className='InspectionReviewCommentBody'>
                                                    {data}
                                                </div>
                                            ))}
                                    </div>
                                ))
                                }
                            </div>
                            <div className="col-12 mt-4" >
                                <hr className='hrBolder mt-4'></hr>
                                    {OutletHeaderImage ? <img className='ml-4' src={CloudFrontDistributionForOutletDataFetch+OutletHeaderImage}
                                                    alt={`Image`}
                                                    style={{borderRadius: "10px" , maxHeight : "80px" , maxWidth: "150px"}}
                                                /> : ""}
                                <div className="inspectionPdfHeader">
                                    <h2 className='ml-4'> {B2BName}</h2>
                                    <h6 className='mr-8 strong'>{CurrentDate}</h6>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row ml-4">
                            <hr className='hrBolder mt-4'></hr>
                            <div className="col-lg-12 mt-4">
                            <button className="btn btn-cancel me-2" onClick={()=>navigate("/dream-pos/dashboard")}>
                                Dashboard
                            </button>
                            <button className="btn btn-submit" onClick={addInspectionReportDatatoCloud}> 
                                {loading ?<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircleSpinner size={20} color ="black" loading={loading}/> </div> : "Print"}
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditInspectionReportReview;
