const formSchema = z.object({
    id: z.number(),
    type: z.string(),
    height: z.number(),
    width: z.number(),
    length: z.number(),
    price: z.number(),
    photos: z
      .array(z.instanceof(File))
      .min(1, "At least one photo is required"),
  });