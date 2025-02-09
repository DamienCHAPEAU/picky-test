import { z } from 'zod';

const validFormats = ['jpeg', 'jpg', 'png', 'webp'] as const;
export const imageUploadFormatSchema = z.enum(validFormats);
