import {z} from 'zod';
import {zoneSchema,typographyStyleSchema,type Draft,type Format} from './model';
export const customerFormats=['portrait','story'] as const;
export type CustomerFormat=typeof customerFormats[number];
const zones=z.object({title:zoneSchema.optional(),guest:zoneSchema.optional(),body:zoneSchema.optional(),details:zoneSchema.optional(),host:zoneSchema.optional(),eyebrow:zoneSchema.optional()});
const typography=z.object({title:typographyStyleSchema.optional(),guest:typographyStyleSchema.optional(),body:typographyStyleSchema.optional(),details:typographyStyleSchema.optional(),host:typographyStyleSchema.optional(),eyebrow:typographyStyleSchema.optional()});
export const variantSchema=z.object({backgroundId:z.string().uuid(),zones:zones.default({}),typography:typography.default({})});
export const catalogTemplateSchema=z.object({id:z.string().uuid().optional(),title:z.string().trim().min(2).max(60),tag:z.string().trim().max(40).default('Авторский дизайн'),published:z.boolean().default(false),variants:z.object({portrait:variantSchema.optional(),story:variantSchema.optional()}).refine(v=>Boolean(v.portrait||v.story),'Загрузите хотя бы один формат')});
export type CatalogTemplate=Omit<z.infer<typeof catalogTemplateSchema>,'id'>&{id:string};
export function useVariant(e:Draft,t:CatalogTemplate,f:Format,reset=false):Partial<Draft>{const variant=t.variants[f as CustomerFormat];if(!variant)throw new Error('Для этого оформления формат еще не подготовлен');return {canvasSize:null,backgroundCrop:{x:.5,y:.5,zoom:1},catalogId:t.id,template:'custom',backgroundId:variant.backgroundId,format:f,zones:variant.zones,typography:reset?variant.typography:{...variant.typography,...e.typography},textColor:''};}
