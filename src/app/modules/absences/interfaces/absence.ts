export interface IAbsence {
    Id: string
    UserId: string
    FirstName?: string
    MiddleName?: string
    LastName?: string
    Timestamp: string
    Status: number
    PartialTimeFrom?: string;
    PartialTimeTo?: string
    IsPartial: boolean;
}
