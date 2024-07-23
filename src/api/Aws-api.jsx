const awsGatewayId =  "ve95w7ga8e"
const stage_name =  "dev"
const aws_region = "ap-south-1"
const api_body = 'https://'+awsGatewayId+'.execute-api.'+aws_region+'.amazonaws.com/'+stage_name+'/'

export const guidedata_fetch_api = api_body + 'ReadUser';
//for calling data's from Users Table {called at guide.jsx}
export const AddNewUser = api_body + 'AddNewUser';
//for adding guide data to usertable {called at AddGuide.jsx}
export const AddSession_Sessiontable = api_body + 'AddNewSession';
//for adding Session data to Sessiontable {called at AddTourist.jsx}
export const FetchWorkFlowCode = api_body + 'FetchWorkflowCode';
//for calling data's from B2B_Workflow {called at Settings.jsx}
export const FetchWorkFlow =  api_body + 'FetchWorkflow';
//for calling data's from workflow_config {called at Settings.jsx}
export const ActiveSession_fetch_api = api_body + 'ReadActiveSession';
//for calling data's from Session Table {called at Activesession.jsx}
export const UpdateSession_Sessiontable = api_body + 'UpdateSessionStatus';
//for updating Session Status of Sessiontable {called at DeleteSession.jsx}
export const BillingData_fetch_api = api_body + 'ReadCommissionDetails';
//for calling data's from Billing Table {called at DeleteSession.jsx}
export const AddNewBill_Billingtable = api_body + 'AddNewCart';
export const PaymentTypeFetchApi = api_body + 'FetchPaymentType';
export const AddNewAppointmentData = api_body + 'AddNewAppointment'
export const fetchDeskList = api_body + 'FetchDeskList';
export const AddNewCheckoutData = api_body + 'AddNewCheckout';
export const fetchItemsForCart = api_body + 'FetchCartItems';
export const FetchDashboardLayout = api_body + 'FetchDashboardLayout';
export const FetchDashboardData = api_body + 'FetchDashboardData';
export const FetchJsonFromS3 = api_body + 'FetchJsonFromS3';
export const AddNewBuisenessAccount = api_body + 'AddNewBuisenessAccount';
export const EmailVerification = api_body + 'EmailVerification';
export const handleSignIn = api_body + 'handleSignIn';
export const AddNewOutlet = api_body + 'AddNewOutlet';
export const FetchBusinessCase = api_body + 'FetchBusinessCase';
export const FetchOutletDetails = api_body + 'FetchOutletDetails';
export const RecieptGenerator = api_body + 'RecieptGenerator';
export const UpdateOutletDetails = api_body + 'UpdateOutletDetails';
export const CreateClientSpecificResources = api_body + 'CreateClientSpecificResources';
export const AddNewWorkflow = api_body + 'AddNewWorkflow';
export const FetchItemCategory = api_body + 'FetchItemCategory';
//export const InitialDataFetchingForUsers = api_body + 'InitialDataFetchingForUsers'
export const FetchUserOuletDetails = api_body+'FetchUserOuletDetails'
export const AddNewCatogory = api_body + 'AddNewCatogory'
export const AddNewItems = api_body + 'AddNewItem'
export const AssignUserToOutlet = api_body + 'AssignUserToOutlet';
export const FatchCashPaymentDeatilsForCashTransfer = api_body + 'FatchCashPaymentDeatilsForCashTransfer'
export const FetchMappingDetails = api_body + 'FetchMappingDetails'
export const AddNewPaymentForMapping = api_body + 'AddNewPaymentForMapping'
export const FetchAppointmentDetailsForListing = api_body + 'FetchAppointmentDetailsForListing'
export const UpdateAppointmentDateChange = api_body + 'UpdateAppointmentDateChange'
export const FetchTotalItem = api_body + 'FetchTotalItem'
export const UpdateItemDetails = api_body + 'UpdateItemDetails'
export const UpdateCategoryDetails = api_body + 'UpdateCategoryDetails' 
export const CreateNewTemplate = api_body + 'CreateNewTemplate'
export const FetchInspectionTemplates = api_body + 'FetchInspectionTemplates'
export const CreateNewInspectionReport = api_body + 'CreateNewInspectionReport'
export const FetchInspectionReport = api_body + 'FetchInspectionReport'
export const AddTreatementScript = api_body + 'AddTreatementScript'
export const FetchTreatementPlanForSpecificCustomer = api_body + 'FetchTreatementPlanForSpecificCustomer'
export const FetchItemNamesForCartAutoCompletion = api_body + 'FetchItemNamesForCartAutoCompletion'
export const FetchIndividualItemForCart = api_body + 'FetchIndividualItemForCart'

export const CloudFrontDistributionForImageFetch = 'https://d3dxaco7fc7241.cloudfront.net/'
export const CloudFrontDistributionForOutletDataFetch = 'https://d1bd4ibfoasd3k.cloudfront.net/'

//new
export const ClientHelper = api_body + 'ClientHelper'
export const ClientGet = api_body + 'ClientGet'
export const ItemHelper = api_body + 'ItemHelper'
export const ItemGet = api_body + 'ItemGet'
export const BillHelper = api_body + 'BillHelper'
export const BillGet = api_body + 'BillGet'
export const BillNewFetch = api_body + 'BillNewFetch'
export const GenerateBillData = api_body + 'GenerateBillData'



