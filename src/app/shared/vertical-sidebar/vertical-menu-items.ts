import { RouteInfo } from "./vertical-sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "Dashboard",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "monitor",
    class: "",
    extralink: false,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "",
    title: "Offers",
    icon: "mdi mdi-dots-horizontal",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: '',
    title: 'Offers',
    icon: 'mdi mdi-tag',
    class: 'has-arrow',
    extralink: false,
    permissions : [],
    permissionexcept : [],
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
        submenu: [],
        permissions : [],
        permissionexcept : [],
      },
      {
        path : '/offers/campaign-list',
        title : 'All Campaigns',
        icon : 'mdi mdi-bullhorn',
        class : '',
        extralink: false,
        submenu: [],
        permissions : [],
        permissionexcept : [],
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
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "Statistics",
    title: "Statistics",
    icon: "cpu",
    class: "has-arrow",
    extralink: false,
    permissions : [],
    permissionexcept : [],
    submenu: [
      {
        path: "/statistics/reports",
        title: "Report",
        icon: "mdi mdi-equal",
        class: "",
        extralink: false,
        submenu: [],
        permissions : [],
        permissionexcept : [],
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
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "api-details",
    title: "API Reference",
    icon: "codesandbox",
    class: "",
    extralink: false,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "",
    title: "Postback",
    icon: "mdi mdi-refresh",
    class: "nav-small-cap",
    extralink: true,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "postback/list",
    title: "Postback",
    icon: "mdi mdi-tag",
    class: "",
    extralink: false,
    submenu: [],
    permissions : [],
    permissionexcept : [],
  },
  {
    path: "network-setting",
    title: "Network Setting",
    icon: "mdi mdi-access-point-network",
    class: "has-arrow",
    extralink: false,
    permissions : ['Admin'],
    permissionexcept : [],
    submenu: [
      {
        path: "setting",
        title: "setting",
        icon: "mdi mdi-access-point-network",
        class: "",
        extralink: false,
        submenu: [],
        permissions : ['Admin'],
        permissionexcept : [],
      },
      {
        path: '',
        title: 'Manage User',
        icon: 'mdi mdi-account-settings-variant',
        class: 'has-arrow',
        extralink: false,
        permissions: ['Admin'],  // 'user.list'
        permissionexcept: [],
        submenu: [
          {
            path: 'user/edit',
            title: 'Add User',
            icon: 'mdi mdi-account-plus',
            class: '',
            extralink: false,
            permissions : ['Admin'],
            permissionexcept : [],
            submenu: []
          },         
          {
            path: '/list/user',
            title: 'List User',
            icon: 'mdi mdi-account-multiple',
            class: '',
            permissions : ['Admin'],
            permissionexcept : [],
            extralink: false,
            submenu: []
          },

        ]
      },
    ]
  }

];
