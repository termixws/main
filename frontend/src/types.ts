// frontend/src/types.ts

export interface Master {
    id: string;
    name: string;
    sex: string;
    phone: string;
    experience: number;
    specialty: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
}