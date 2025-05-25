import { createContext, useContext, type ReactNode, useReducer } from "react";
import type { Product } from "../types/types";
import { type Category } from "../types/types";

//Actions are instructions to change the state
//we must define the type of action
//actions are instructions to change the state
type ProductAction = 
    //each action has a type and a payload, which is the data we want to change
    { type: 'SET_PRODUCTS'; payload: Product[] } 
    | { type: 'SET_SELECTED_CATEGORY'; payload: string }

//defining the structure/shape of the state with typescript
interface ProductState {
    products: Product[];
    selectedCategory: string;
}

//setting the initial state with everything empty
//this is the state that will be used in the reducer
const initialState: ProductState = {
    products: [],
    selectedCategory: '',
};

//creating the reducer function
//a reducer function is just listening for actions and changing the state based on the action type
const productReducer = (
    state: ProductState, //this line is just saying that the state is of the product type structure defined above
    action: ProductAction
): ProductState => {
    switch (action.type) {
        case 'SET_PRODUCTS':  // if the type is SET_PRODUCTS, then it will change the state based on that type
            return { ...state, products: action.payload };
        case 'SET_SELECTED_CATEGORY': // if the type is SET_SELECTED_CATEGORY , then it will change the state based on that type
            return { ...state, selectedCategory: action.payload };
        default:
            throw new Error('Unhandled action type: ${action.type}');
    }
};

//this will be the structure/interface of our whole context, it is similar to the state but it will also include the dispatch function
interface ProductContextType {
    products: Product[];
    selectedCategory: string;
    //The dispatch function allows us to trigger actions like SET_PRODUCTS and SET_SELECTED_CATEGORY to update the state
    dispatch: React.Dispatch<ProductAction>;
}

//creating the context
//this will be the context that will be used in the whole app
//what will be stored here is either a ProductContextType (as defined in the interface) or undefined
const ProductContext = createContext<ProductContextType | undefined>(undefined);

//creating the provider component
interface ProductProviderProps {
    children: ReactNode; //this will be the children of the provider, which will be the whole app
    //REACTNODE is all of the things that React can render, like strings, numbers, elements, fragments, portals, etc.
}

export const ProductProvider: React.FC<ProductProviderProps> = ({        //the product provider is the component that wraps the whole app and provides the state to all of the components
    children,
}) => {
    const [state, dispatch] = useReducer(productReducer, initialState);     //useReducer is an alternative to useState, it is used to manage complex state logic in React applications

    return (
        <ProductContext.Provider value={{ ...state, dispatch}}>
            {children}
        </ProductContext.Provider>
    );
};

//Custom hook to use the ProductContext
export const useProductContext = (): ProductContextType => {
    const context = useContext(ProductContext);    //useContext is the hook we imported that gives us access to the ProductContext created above. It gives us easy access to the state and dispatch function
    if (!context) {                                //we define the context above and this line is checking to see if what we have is the context or somethign else
        throw new Error('useProductContext must be within a ProductProvider');
    }
    return context;
}