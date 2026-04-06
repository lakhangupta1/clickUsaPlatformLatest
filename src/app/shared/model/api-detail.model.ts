
export let docParameters = [
  { "key": "secretkey", "type": "headers", "require": "yes", "format": "string", "description": "Secret Key for autherization", "example": "2909bc3e8af18f295148a18f60558a54" },
  { "key": "apikey", "type": "headers", "require": "yes", "format": "string", "description": "API Key for autherization", "example": "iodFhyuqCHZmJKZVLtv6gZILT4PM9xas3DU1iv72" },
  { "key": "limit", "type": "query", "require": "no", "format": "number", "description": "Records per page", "example": "10, max: no limit, default: 5000" },
  { "key": "page", "type": "query", "require": "no", "format": "number", "description": "page index,default value is 1", "example": "1" },
  { "key": "offer_type", "type": "query", "require": "no", "format": "string", "description": "If no key and value entered then default is 'all', otherwise value needs to be either 'all' or 'active'. ", "example": "offer_type=active" },
]

export let responseData = [

  { "key": "err", "format": "boolean", "description": "True or False", "example": "false" },
  { "key": "msg", "format": "string", "description": "Success or error message", "example": "Success" },
  { "key": "payloadType", "format": "array", "description": "Payload format", "example": "array" },
  { "key": "payload", "format": "array", "description": "Offers data", "example": "[{},{}]" },
  { "key": "page", "format": "number", "description": "Current page number", "example": "1" },
  { "key": "nextPage", "format": "boolean", "description": "Next page is available for traverse", "example": "true or false" },
  { "key": "count", "format": "number", "description": "Current page offer count", "example": "5000" }
]

export let payloadData = [
  { "key": "offer_id", "format": "string", "description": "Offer id", "example": "5f887f8e00fdf74f730cedc3" },
  { "key": "offer_name", "format": "string", "description": "Offer Name", "example": "PUBG" },
  { "key": "kpi", "format": "string", "description": "Offer KPI", "example": "Hard KPIs for sub ids with 10 or more installs: Click injection: Al" },
  { "key": "description", "format": "string", "description": "Offer description", "example": "CH Nastyporn (in app allowed)carrier: Sunrise only" },
  { "key": "updatedAt", "format": "date", "description": "Last offer update time", "example": "December 19th 2020, 12:30:24 pm" },
  { "key": "category", "format": "array", "description": "Offer category", "example": "['games','role_playing']" },
  { "key": "isCapEnabled", "format": "boolean", "description": "Offer cap in on or not", "example": "true or false" },
  { "key": "isTargeting", "format": "boolean", "description": "Targetting on offer or not", "example": "true or false" },
  { "key": "isgoalEnabled", "format": "boolean", "description": "Goal available or not", "example": "true or false" },
  { "key": "thumbnail", "format": "string", "description": "Offer Image URL", "example": "https://<ANY_DOMAIN>/partner_4549/test/testthumb_sp-logo_cc07665c6d451bb27ecc3b88c41498.png" },
  { "key": "preview_url", "format": "string", "description": "Store preview link", "example": "https://itunes.apple.com/app/id1005442353" },
  { "key": "currency", "format": "string", "description": "Valid Currency", "example": "USD" },
  { "key": "payout_type", "format": "object", "description": "Payout Type", "example": "{'enum_type': 'CPI'}" },
  { "key": "geo_targeting", "format": "object", "description": "Countries, Country code, and Cities", "example": "{...}" },
  { "key": "device_targeting", "format": "object", "description": "Device, OS, and OS Version", "example": "{...}" },
  { "key": "creative", "format": "array", "description": "Array of creative urls object", "example": "[{},{}]" },
  { "key": "tracking_link", "format": "string", "description": "Tracking Url", "example": "http://[YPUR_UNUQUE_ID].g2prof.net/click?aff_sub6={app_name}&source={source}" },
  { "key": "approvalRequired", "format": "boolean", "description": "Offer available or not", "example": "true or false" },
  { "key": "payout", "format": "float", "description": "Offer payout", "example": "1.34413214141" },
  { "key": "status_label", "format": "string", "description": "new, active, applied, paused, rejected", "example": "active" }
]

export let geoTargeting = [
  { "key": "country_allow", "format": "array", "description": "Allowed country for offer", "example": "[{'key':'US','value':'US'}]" },
  { "key": "country_deny", "format": "array", "description": "Deny country for offer", "example": "[{'key':'US','value':'US'}]" },
  { "key": "city_allow", "format": "array", "description": "Allowed city for offer", "example": "[{'key':'US','value':'US'}]" },
  { "key": "city_deny", "format": "array", "description": "Deny city for offer", "example": "[{'key':'US','value':'US'}]" },
]

export let deviceTargeting = [
  { "key": "device", "format": "array", "description": "offer for any specific device i.e 'all', 'mobile' or 'desktop'", "example": "['mobile']" },
  { "key": "os", "format": "array", "description": "Device OS i.e 'all', 'android', 'ios'", "example": "['android']" },
  { "key": "os_version", "format": "array", "description": "Device OS version targeting", "example": "[{'os': 'android','version': '6','version_condition': 'gte'}]" },
]

export let creative = [
  { "key": "creative_id", "format": "string", "description": "Creative id could be anything", "example": "123" },
  { "key": "name", "format": "string", "description": "Creative name", "example": "amazon_60X60" },
  { "key": "description", "format": "string", "description": "rules and regulation for implementing", "example": "area should be 60x60" },
  { "key": "creative_type", "format": "string", "description": "Creative type like image or zip", "example": "image" },
  { "key": "width", "format": "number", "description": "Creative width", "example": "60" },
  { "key": "height", "format": "number", "description": "Creative height", "example": "60" },
  { "key": "landing_page_url", "format": "string", "description": "Creative page url", "example": "http://<ANY_DOMAIN>/fsgsg/sfsfsd/sdfsd.html" },
  { "key": "tracking_link", "format": "string", "description": "Creative tracking url", "example": "http://<ANY_DOMAIN>/download/626a5864e4b05645fa7e471c" },
  { "key": "creative_file", "format": "string", "description": "Creative resource url", "example": "http://<ANY_DOMAIN>/appstore/richmedia/20190124/9zjfjuw4nvxhn9vzbcrxwcxy_lucky-box.jpg" },
  { "key": "status", "format": "string", "description": "Status of current creative", "example": "active" },
]