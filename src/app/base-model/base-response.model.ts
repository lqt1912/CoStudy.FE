export interface BaseResponse<T>  {
    result: T;
    success: boolean;
    code: number;
    message: string;
}