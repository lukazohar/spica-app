export interface IAbsenceDefinition {
    Id: string;
    Name?: string;
    nullable: true;
    IntegrationId: number;
    Code: number;
    Type: number;
    IsAvailableForAdminsOnly: boolean;
    CategoryDefinitionId: string;
    CategoryDefinitionName?: string;
    Fraction: number;
    IconId?: string;
}
