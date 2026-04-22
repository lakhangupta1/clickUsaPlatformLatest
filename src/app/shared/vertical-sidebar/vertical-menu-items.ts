import { RouteInfo } from "./vertical-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Dashboard",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "monitor",
    class: "",
    extralink: false,
    submenu: [],
  },
  {
    path: "",
    title: "Offers",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
  },
  {
    path: '',
    title: 'Offers',
    icon: 'mdi mdi-tag',
    class: 'has-arrow',
    extralink: false,
    submenu: [
      // {
      //   path: '/offers/all',
      //   title: 'All Campaigns',
      //   icon: 'mdi mdi-format-list-bulleted',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
      {
        path : '/offers/create',
        title: 'create-campaign',
        icon: 'mdi mdi-format-list-bulleted',
        class: '',
        extralink: false,
        submenu: []
      },
      {
        path : '/offers/campaign-list',
        title : 'All Campaigns',
        icon : 'mdi mdi-bullhorn',
        class : '',
        extralink: false,
        submenu: []
      }
      // {
      //   path: '/offers/active',
      //   title: 'Active Offers',
      //   icon: 'mdi mdi-rocket',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
      // {
      //   path: '/offers/public',
      //   title: 'Public Offers',
      //   icon: 'mdi mdi-earth',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
      // {
      //   path: '/offers/private',
      //   title: 'Private Offers',
      //   icon: 'mdi mdi-lock',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // },
      // {
      //   path: '/offers/working',
      //   title: 'Working Offers',
      //   icon: 'mdi mdi-format-list-bulleted',
      //   class: '',
      //   extralink: false,
      //   submenu: []
      // }
    ]
  },
  {
    path: "",
    title: "Statistics",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
  },
  {
    path: "Statistics",
    title: "Statistics",
    icon: "cpu",
    class: "has-arrow",
    extralink: false,
    submenu: [
      {
        path: "/statistics/reports",
        title: "Report",
        icon: "mdi mdi-equal",
        class: "",
        extralink: false,
        submenu: [],
      },
      // {
      //   path: "/statistics/conversions",
      //   title: "Conversion",
      //   icon: "mdi mdi-message-bulleted",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },
      // {
      //   path: "/statistics/geo-reports",
      //   title: "Geo Reports",
      //   icon: "mdi mdi-map-marker",
      //   class: "",
      //   extralink: false,
      //   submenu: [],
      // },


    ],
  },
  {
    path: "",
    title: "API Reference",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
  },
  {
    path: "api-details",
    title: "API Reference",
    icon: "codesandbox",
    class: "",
    extralink: false,
    submenu: [],
  },
  {
    path: "",
    title: "Postback",
    icon: "mdi mdi-refresh",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
  },
  {
    path: "postback/list",
    title: "Postback",
    icon: "mdi mdi-tag",
    class: "",
    extralink: false,
    submenu: [],
  },

];
