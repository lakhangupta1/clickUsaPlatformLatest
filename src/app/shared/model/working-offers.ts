
export const maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
};


export interface IofferFields {
    db_name: string;
    field_name: string;
    selected: boolean;
    description: string;
}


export const workingOffersfields: Array<IofferFields> = [
    {
        db_name: 'category',
        field_name: 'Tags',
        selected: false,
        description: ''
    },
    {
        db_name: 'country_allow',
        field_name: 'Geo',
        selected: true,
        description: ''
    },
    {
        db_name: 'currency',
        field_name: 'Currency',
        selected: true,
        description: ''
    },
    {
        db_name: 'app_id',
        field_name: 'app_id',
        selected: true,
        description: ''
    },
    {
        db_name: 'jumps',
        field_name: 'Redirection Count',
        selected: false,
        description: ''
    },
    {
        db_name: 'os',
        field_name: 'OS',
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
        db_name: 'payout_type',
        field_name: 'Payout Type',
        selected: true,
        description: ''
    },
    {
        db_name: 'preview_url',
        field_name: 'preview',
        selected: false,
        description: ''
    },
    {
        db_name: 'revenue',
        field_name: 'Revenue',
        selected: true,
        description: ''
    },
    {
        db_name: 'revenue_type',
        field_name: 'Revenue Type',
        selected: false,
        description: ''
    },
    {
        db_name: 'wTime',
        field_name: 'Working Date',
        selected: true,
        description: ''
    }
];
