import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** A call-back request from the contact form on the landing page. */
export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  /** WhatsApp number as typed: digits, spaces, dashes, brackets and an optional leading +. */
  @Transform(trim)
  @IsString()
  @Matches(/^\+?[\d\s()-]{6,20}$/, { message: 'phone must be a valid phone number' })
  phone: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  storeType?: string;

  @IsIn(['AE', 'SA'])
  market: 'AE' | 'SA';

  @IsOptional()
  @IsIn(['en', 'ar', 'hi', 'ur'])
  lang?: 'en' | 'ar' | 'hi' | 'ur';
}
