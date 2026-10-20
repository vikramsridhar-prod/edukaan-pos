import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
/** Optional text fields: treat "" the same as not sent. */
const trimOrDrop = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() || undefined : value);

/** A call-back request from the contact form on the landing page. */
export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  companyName: string;

  @Transform(trimOrDrop)
  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  /** Mobile or WhatsApp number as typed: digits, spaces, dashes, brackets and an optional leading +. */
  @Transform(trim)
  @IsString()
  @Matches(/^\+?[\d\s()-]{6,20}$/, { message: 'phone must be a valid phone number' })
  phone: string;

  /** Store type in English ("Mobile shop", "Baqala", …), or what the visitor typed after choosing "Other". */
  @Transform(trimOrDrop)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  storeType?: string;

  @IsIn(['AE', 'SA'])
  market: 'AE' | 'SA';

  @IsOptional()
  @IsIn(['en', 'ar', 'hi', 'ur'])
  lang?: 'en' | 'ar' | 'hi' | 'ur';

  /** The landing page address the form was sent from. */
  @Transform(trimOrDrop)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^https?:\/\//, { message: 'pageUrl must be an http(s) URL' })
  pageUrl?: string;
}
