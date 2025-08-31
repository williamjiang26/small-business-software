import { APIGatewayProxyHandler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { OrderStatusEnum } from "@prisma/client";
import AWS from "aws-sdk";

const prisma = new PrismaClient();

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // from your AWS IAM
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// GET
export const getManager: APIGatewayProxyHandler = async (event) => {
  try {
    const { cognitoId } = event.pathParameters?.params;
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });

    if (manager) {
      return {
        statusCode: 200,
        body: JSON.stringify(manager),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error retrieving sales", error }),
    };
  }
};
