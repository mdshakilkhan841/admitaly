export interface IUniversity {
    _id: string;
    name: string;
    address: string;
    image: string;
}

export interface IApplication {
    _id: string;
    uniId: IUniversity;
    call: string;
    applicationLink: string;
    admissionFee: string;
    startDate: string;
    endDate: string;
    cgpa: string;
    others: string[];
    languageProficiency: string[];
    createdAt?: string;
    updatedAt?: string;
}
