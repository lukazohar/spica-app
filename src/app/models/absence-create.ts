export interface IAbsenceCreate {
    userId?: string;
    Timestamp: Date
    AbsenceDefinitionId: string;
    Origin: number;
    Comment?: string;
    PartialTimeFrom?: Date
    PartialTimeTo?: Date
    PartialTimeDuration?: number;
    IsPartial: boolean;
    OverrideHolidayAbsence: boolean;
}
