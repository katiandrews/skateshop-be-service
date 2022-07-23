export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
}

export interface NewProduct {
  description: string;
  price: number;
  title: string;
}

export interface ProductsResponse {
  body: Product[];
  headers: { 
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  }
}

export interface ProductResponse {
  body: Product;
  headers: { 
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  }
}

export interface ProductAdded {
  id: string;
  headers: { 
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  }
}
