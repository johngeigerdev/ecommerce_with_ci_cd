//in this file we will define the types/interfaces that can be passsed to
// various components in the app

export interface Product {  
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;  //the link for an image will always be stored as a string
    imageUrl: string;
    createdAt?: any //can be a timestamp or a string
    rating: {
        rate: number;
        count: number;
    }
}

export type Category = string; //categories are just strings