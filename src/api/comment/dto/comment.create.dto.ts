import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentCreateDto {
    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsNumber()
    @IsOptional()
    parentCommentId?: number;
}