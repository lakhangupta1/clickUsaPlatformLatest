// export interface Fields {
//     db_name: String;
//     field_name: String;
//     selected: Boolean;
//     description: String;
// }
export let geoGroupFields = [
    {
        db_name: 'oId',
        field_name: 'Offer',
        selected: true,
        description: ''
    }, {
        db_name: 'source',
        field_name: 'Source',
        selected: false,
        description: ''
    }, {
        db_name: 'isoCode',
        field_name: 'Country',
        selected: true,
        description: ''
    }, {
        db_name: 'app',
        field_name: 'App Id',
        selected: true,
        description: ''
    },
    {
        db_name: 'source',
        field_name: 'Source',
        selected: false,
        description: ''
    }, {
        db_name: 'day',
        field_name: 'Day',
        selected: false,
        description: ''
    }, {
        db_name: 'month',
        field_name: 'Month',
        selected: false,
        description: ''
    }
];
export let groupFields = [
    {
        db_name: 'offer',
        field_name: 'Offer',
        selected: true,
        description: ''
    }, {
        db_name: 'source',
        field_name: 'Source',
        selected: false,
        description: ''
    }, {
        db_name: 'day',
        field_name: 'Day',
        selected: false,
        description: ''
    }, {
        db_name: 'month',
        field_name: 'Month',
        selected: false,
        description: ''
    }
];

export let columnFields = [
    {
        db_name: 'click',
        field_name: 'Click',
        selected: true,
        description: ''
    }, {
        db_name: 'conversion',
        field_name: 'Conversion',
        selected: true,
        description: ''
    },
    {
        db_name: 'payout',
        field_name: 'Payout',
        selected: true,
        description: ''
    },
    {
        db_name: 'cr',
        field_name: 'CR',
        selected: true,
        description: ''
    }
];

const currentDate = new Date();
export let maxDate = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate()
};