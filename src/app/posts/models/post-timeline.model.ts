export interface StringContent {
    content_type: number;
    content: string;
    oid: string;
}

export interface ImageContent {
    discription: string;
    image_url?: any;
    image_hash: string;
    media_type?: any;
    created_date: Date;
    modified_date: Date;
    oid: string;
}

export interface Field {
    oid: string;
    object_id: string;
    field_id: string;
    field_name: string;
    level_id: string;
    level_name: string;
    level_description: string;
    point: number;
    is_active: boolean;
    created_date: Date;
    modified_date: Date;
}

export interface TimelineModel {
    oid: string;
    title: string;
    author_id: string;
    author_name: string;
    author_avatar: string;
    author_email: string;
    upvote: number;
    downvote: number;
    created_date: Date;
    string_contents: StringContent[];
    image_contents: ImageContent[];
    media_type: number;
    comments_count: number;
    post_type: number;
    post_type_name: string;
    field: Field[];
    is_vote_by_current: boolean;
    is_downvote_by_current: boolean;
    is_save_by_current: boolean;
    is_notify_by_current?: boolean;
    index?: any;
    status: number;
    status_name: string;
}