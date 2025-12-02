import { z } from "zod";

const fileSchema = z.instanceof(File).refine(file => file.size > 0, {
  message: 'A file must be uploaded'
}).transform(file => ({
  ...file,
  preview: URL.createObjectURL(file)
}))

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name of product is required'),
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number()
    .min(1, 'Price is required')
    .min(100, 'Price must be at least $1.00'),
  type: z.string().min(1, 'Type is required'),
  brand: z.string().min(1, 'Brand is required'),
  quantityInStock: z.coerce.number()
    .min(1, 'Quantity is required'),
  pictureUrl: z.string().optional(),
  file: fileSchema.optional()
}).refine((data) => data.pictureUrl || data.file, {
  message: 'Please provide an image',
  path: ['file']
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
