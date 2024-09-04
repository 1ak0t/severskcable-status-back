export enum UserRoles {
    Operator = "Оператор",
    ITR = "ИТР",
    Engineers = "Инженеры",
    HeadEngineer = "Главный инженер",
    CEO = "Генеральный директор",
    Admin = "Администратор"
}

export type UserType = {
    surname: string;
    name: string;
    middleName: string;
    email: string;
    role: UserRoles[];
}