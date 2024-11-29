import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class PlayerActionDto {
    @IsString()
    striker: string;

    @IsString()
    nonStriker: string;

    @IsString() // Add validation for striker's team name
    strikerTeam: string;

    @IsString() // Add validation for bowler's name
    bowler: string;

    @IsNumber()
    run: number;

    @IsBoolean()
    @IsOptional()
    wicket?: boolean;

    @IsBoolean()
    @IsOptional()
    bye?: boolean;

    @IsBoolean()
    @IsOptional()
    legByes?: boolean;

    @IsBoolean()
    @IsOptional()
    noBall?: boolean;

    @IsBoolean()
    @IsOptional()
    wide?: boolean;
}