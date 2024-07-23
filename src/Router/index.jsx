import Dashboard from "../MainPage/Dashboard";
import {Settings_Index} from "../MainPage/Settings";
import { Item_Index } from "../MainPage/Item";
import {Clients_Index} from "../MainPage/Clients"
import {Bill_Index} from "../MainPage/Bill";
import { Report_Index } from "../MainPage/Report";

export const routerService = [
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path:'clients',
        component: Clients_Index
    },
    {
        path:'item',
        component: Item_Index
    },
    {
        path:'settings',
        component: Settings_Index
    },
    {
        path:'bill',
        component: Bill_Index
    },
    {
        path:'report',
        component: Report_Index
    }
]
