import { RouteInfo } from './horizontal-sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '',
        title: 'Dashboard',
        icon: 'monitor',
        class: 'has-arrow',
        ddclass: '',
        extralink: false,
        submenu: [
            {
                path: "/dashboard",
                title: "Dashboard",
                icon: "mdi mdi-adjust",
                class: "",
                ddclass: '',
                extralink: false,
                submenu: [],
            }
        ]
    },
    {
        path: '',
        title: 'Offers',
        icon: 'inbox',
        class: 'has-arrow',
        ddclass: 'two-column',
        extralink: false,
        submenu: [
            {
                path: '/offers/all',
                title: 'All Offers',
                icon: 'mdi mdi-inbox',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/offers/active',
                title: 'Active Offers',
                icon: 'mdi mdi-briefcase',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/offers/public',
                title: 'Public Offers',
                icon: 'mdi mdi-comment-processing-outline',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/offers/private',
                title: 'Private Offers',
                icon: 'mdi mdi-clipboard-text',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },


        ]
    },
    {
        path: '',
        title: 'Statistics',
        icon: 'grid',
        class: 'has-arrow',
        ddclass: 'two-column',
        extralink: false,
        submenu: [
            {
                path: '/statistics/reports',
                title: 'Report',
                icon: 'mdi mdi-equal',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/statistics/conversions',
                title: 'Conversion',
                icon: 'mdi mdi-message-bulleted',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/statistics/geo-reports',
                title: 'Geo Reports',
                icon: 'mdi mdi-message-bulleted',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },           
        ]
    },
    {
        path: '',
        title: 'API Reference',
        icon: 'file-text',
        class: 'has-arrow',
        ddclass: '',
        extralink: false,
        submenu: [
            {
                path: "api-details",
                title: "API Reference",
                icon: "mdi mdi-priority-low",
                class: "",
                ddclass: "",
                extralink: false,
                submenu: [],
            }

        ]
    },
    {
        path: '',
        title: 'Postback',
        icon: 'server',
        class: 'has-arrow',
        ddclass: '',
        extralink: false,
        submenu: [
            {
                path: 'postback/list',
                title: 'Postback',
                icon: 'mdi mdi-border-none',
                class: '',
                ddclass: '',
                extralink: false,
                submenu: []
            },

        ]
    },
    // {
    //     path: '',
    //     title: 'Pages',
    //     icon: 'book-open',
    //     class: 'has-arrow',
    //     ddclass: 'mega-dropdown',
    //     extralink: false,
    //     submenu: [
            // {
            //     path: '/ecom/products',
            //     title: 'Products',
            //     icon: 'mdi mdi-cards-variant',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/ecom/cart',
            //     title: 'Cart',
            //     icon: 'mdi mdi-cart',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/ecom/edit',
            //     title: 'Edit Products',
            //     icon: 'mdi mdi-cart-plus',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/ecom/details',
            //     title: 'Product Details',
            //     icon: 'mdi mdi-camera-burst',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/ecom/orders',
            //     title: 'Orders',
            //     icon: 'mdi mdi-chart-pie',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/ecom/checkout',
            //     title: 'Checkout',
            //     icon: 'mdi mdi-clipboard-check',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/maps/google',
            //     title: 'Google Maps',
            //     icon: 'mdi mdi-google-maps',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/login',
            //     title: 'Login',
            //     icon: 'mdi mdi-account-key',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/login2',
            //     title: 'Login 2',
            //     icon: 'mdi mdi-account-key',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/signup',
            //     title: 'Register',
            //     icon: 'mdi mdi-account-plus',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/signup2',
            //     title: 'Register 2',
            //     icon: 'mdi mdi-account-plus',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/404',
            //     title: '404',
            //     icon: 'mdi mdi-alert-outline',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/authentication/lock',
            //     title: 'Lockscreen',
            //     icon: 'mdi mdi-account-off',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: 'sample-pages/profile',
            //     title: 'Profile',
            //     icon: 'mdi mdi-account-network',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: 'sample-pages/pricing',
            //     title: 'Pricing',
            //     icon: 'mdi mdi-file-export',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: 'sample-pages/invoice',
            //     title: 'Invoice',
            //     icon: 'mdi mdi-ungroup',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: 'sample-pages/helperclasses',
            //     title: 'Helper Classes',
            //     icon: 'mdi mdi-tune',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/starter',
            //     title: 'Starter Page',
            //     icon: 'mdi mdi-crop-free',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/timeline/left',
            //     title: 'Left Timeline',
            //     icon: 'mdi mdi-clock-fast',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/timeline/right',
            //     title: 'Right Timeline',
            //     icon: 'mdi mdi-clock-end',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/timeline/center',
            //     title: 'Center Timeline',
            //     icon: 'mdi mdi-clock-in',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/icons/fontawesome',
            //     title: 'Fontawesome',
            //     icon: 'mdi mdi-emoticon-cool',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/icons/simpleline',
            //     title: 'Simple Line Icons',
            //     icon: 'mdi mdi mdi-image-broken-variant',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // },
            // {
            //     path: '/icons/material',
            //     title: 'Material Icons',
            //     icon: 'mdi mdi-emoticon',
            //     class: '',
            //     ddclass: '',
            //     extralink: false,
            //     submenu: []
            // }
    //     ]
    // },
    // {
    //     path: '',
    //     title: 'Charts',
    //     icon: 'bar-chart-2',
    //     class: 'has-arrow',
    //     ddclass: '',
    //     extralink: false,
    //     submenu: [
    //         {
    //             path: '/charts/chartistjs',
    //             title: 'Chartist Js',
    //             icon: 'mdi mdi-blur',
    //             class: '',
    //             ddclass: '',
    //             extralink: false,
    //             submenu: []
    //         },
    //         {
    //             path: '/charts/ngxchart',
    //             title: 'Ngx Charts',
    //             icon: 'mdi mdi-blur',
    //             class: '',
    //             ddclass: '',
    //             extralink: false,
    //             submenu: []
    //         },
    //         {
    //             path: "/charts/apexchart",
    //             title: "Apex Charts",
    //             icon: "mdi mdi-blur",
    //             class: "",
    //             ddclass: "",
    //             extralink: false,
    //             submenu: [],
    //         }
    //     ]
    // },

    // {
    //     path: '',
    //     title: 'DD',
    //     icon: 'align-left',
    //     class: 'has-arrow',
    //     ddclass: '',
    //     extralink: false,
    //     submenu: [
    //         {
    //             path: '',
    //             title: 'Second Level',
    //             icon: 'mdi mdi-octagram',
    //             class: '',
    //             ddclass: '',
    //             extralink: true,
    //             submenu: []
    //         },
    //         {
    //             path: '/second',
    //             title: 'Second Child',
    //             icon: 'mdi mdi-octagram',
    //             class: 'has-arrow',
    //             ddclass: '',
    //             extralink: false,
    //             submenu: [
    //                 {
    //                     path: '/thirdone',
    //                     title: 'Third 1.1',
    //                     icon: 'mdi mdi-playlist-plus',
    //                     class: '',
    //                     ddclass: '',
    //                     extralink: false,
    //                     submenu: []
    //                 },
    //                 {
    //                     path: '/thirdtwo',
    //                     title: 'Third 1.2',
    //                     icon: 'mdi mdi-playlist-plus',
    //                     class: '',
    //                     ddclass: '',
    //                     extralink: false,
    //                     submenu: []
    //                 }
    //             ]
    //         }
    //     ]
    // }
];
