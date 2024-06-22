
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";
// import { fullTextWithoutSpacePatt } from "../helpers/regexp.helper";
// import { ApiProperty } from '@nestjs/swagger';

export class PagerDto {
    
    @IsInt({
        message: 'El límite debe ser un entero'
    })
    @Min(0, { message: 'Mínimo 0' })
    @IsOptional()
    @Type( () => Number )
    // @ApiProperty({
    //     description: 'limite de registros por página',
    //     default: 5,
    //     required: false
    // })
    limit?: number;
    
    @IsInt({
        message: 'La página debe ser un entero'
    })
    @Min(0, { message: 'Mínimo 0' })
    @IsOptional()
    @Type( () => Number )
    // @ApiProperty({
    //     description: 'página',
    //     default: 1,
    //     required: false
    // })
    page?: number;

    @IsString({
        message: 'El filtro debe ser un texto'
    })
    @IsOptional()
    // @ApiProperty({
    //     description: 'filtro',
    //     nullable: true,
    //     required: false
    // })
    filter?: string;

    @IsBoolean({
        message: 'El estado debe ser un booleano'
    })
    // @IsIn([true, false], { message: 'El estado solo puede tener dos valores true o false' })
    @IsOptional()
    @Type( () => Boolean )
    // @ApiProperty({
    //     description: 'bandera para listar activos o inactivos',
    //     nullable: true,
    //     required: false
    // })
    active?: boolean;
    
    // @IsString({
    //     message: 'El ordenamiento debe ser un texto'
    // })
    // @Matches(
    //     fullTextWithoutSpacePatt,
    //     { message: 'El ordenamiento debe ser un texto sin espacios en blanco' }
    // )
    // @IsOptional()
    // @ApiProperty({
    //     description: 'campo para el orden de los registros',
    //     nullable: true,
    //     required: false
    // })
    // order: string;
}