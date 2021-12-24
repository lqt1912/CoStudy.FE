export interface StringContent {
    content_type: number;
    content: string;
}

export interface ImageContent {
    discription: string;
    image_hash: string;
}

export interface Field {
    field_id: string;
    level_id: string;
}

export interface  NewPostRequest {


    title: string;
    string_contents: StringContent[];
    image_contents: ImageContent[];
    fields: Field[];
    post_type: number;
}