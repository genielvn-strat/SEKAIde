export type Response<T> = {
    success: boolean;
    message: string;
    status: number;
    data?: T;
};

export const success = <T>(
    status: number,
    message: string,
    data?: T
): Response<T> => {
    console.log({
        success: true,
        message,
        status,
        data,
    });
    return {
        success: true,
        message,
        status,
        data,
    };
};

export const failure = (status: number, message: string): Response<null> => {
    console.log({
        success: false,
        message,
        status,
        data: null,
    });
    return {
        success: false,
        message,
        status,
        data: null,
    };
};
