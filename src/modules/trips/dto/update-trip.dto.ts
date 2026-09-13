import { IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { TripPartnerStatus } from "src/constant";

export class UpdateTripDto{
    @IsOptional()
    @IsString()
    @MaxLength(255)
    destination?: string

    @IsOptional()
    @IsString()
    startDate?:string

    @IsOptional()
    @IsString()
    endDate?:string

    @IsOptional()
    @IsNumber()
    @Min(0)
    budget?:string

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    status?: TripPartnerStatus;


}