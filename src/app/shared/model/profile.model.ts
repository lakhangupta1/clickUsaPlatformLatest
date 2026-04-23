export interface Address {
    address?: string;
    city?: string;
    locality?: string;
    state?: string;
    pincode?: number;
    country?: string;
}
export interface AccountManager {
    name: string;
    email: string;
    phone: string;
    skypeId?: string;
    userId?: string;
    profile_image?: string;
}
export interface PublisherData {
    _id?: string;
    pid: number;
    name: string;
    company: string;
    email: string;
    phone: string;
    skype_id?: string;
    status: string;
    company_logo?: string;
    address?: Address;
    account_manager?: AccountManager;
    fD?: PublisherFinanceDetails;
    updatedAt?: string;
}

export interface UserData {
    id?: string;
    // pid: number;
    first_name: string;
    last_name: string;
    company: string;
    email: string;
    phone: string;
    country : string,
    currency : string,
    // skype_id?: string;
    status: string;
    state : string;
    address : string,

    pay_type?: string,
    is_primary?: boolean,
    account_holder_name?: string,
    account_number?: Number,
    ifsc_code?: string,
    bank_name?: string,
    is_verified?: boolean,

    upi? : string,
    paypal?: string,
    paytm?: string,
    pincode : string;
    
}

export interface PublisherFinanceDetails {
    aN?: string,
    aNumber?: number,
    aType?: string,
    addr?: string,
    bN?: string,
    ifcs?: string,
    payoneerId?: string,
    ppId?: string,
    rT?: string,
    wc?: string
}