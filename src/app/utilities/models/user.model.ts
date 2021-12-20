import { Field } from "src/app/posts/models/post-timeline.model";

export interface Address {
    district?: any;
    city?: any;
    detail?: any;
    longtitude: string;
    latitude: string;
}

export interface Avatar {
    discription?: any;
    image_url: string;
    image_hash: string;
    media_type?: any;
    created_date: Date;
    modified_date: Date;
    oid: string;
}

export interface AdditionalInfo {
    information_name: string;
    information_value: string;
}

export interface User {
    oid: string;
    index?: any;
    last_name: string;
    first_name: string;
    full_name: string;
    date_of_birth: Date;
    email: string;
    phone_number: string;
    address: Address;
    full_address: string;
    avatar: Avatar;
    avatar_hash: string;
    status: number;
    refresh_token: string;
    status_name: string;
    created_date: Date;
    modified_date: Date;
    post_count: number;
    followers: number;
    followings: number;
    additional_infos: AdditionalInfo[];
    fields: Field[];
    post_saved: string[];
    call_id: string;
}

