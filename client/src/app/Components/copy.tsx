export const createProduct = async (req: Request, res: Response) => {
  try {
    const { id, color, height, width, length, type, price, altText } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const file = files[0]; // Only take the first photo
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read", // assuming bucket policy allows public access
    };

    const uploadResult = await s3.upload(s3Params).promise();
    const photoUrl = uploadResult.Location;

    // 1. Create the ProductDetails
    const newProduct = await prisma.productDetails.create({
      data: {
        id,
        type,
        color,
        height,
        width,
        length,
        price,
      },
    });

    // 2. Create the related ProductPhoto
    const newPhoto = await prisma.productPhoto.create({
      data: {
        url: photoUrl,
        altText: altText || null,
        product: {
          connect: { id: newProduct.id }, // links to the product via foreign key
        },
      },
    });

    // Optional: return both product and photo
    res.status(201).json({
      product: newProduct,
      photo: newPhoto,
    });
  } catch (error) {
    console.error("Create product failed:", error);
    res.status(500).json({ message: "Failed to create product", error });
  }
};
