import { DataMapper } from "@aws/dynamodb-data-mapper";
import gen2array from "../libs/array-helper";
import { Category } from "../models/category";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand, CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import config from "../../config.json";

const photoBucket = config.PHOTOS_S3_BUCKET;

class CategoryService {
    constructor(
        private readonly mapper: DataMapper,
        private s3Client: S3Client
    ) { }

    async createCategories(categories: Category[]): Promise<Category[]> {
        const categoriesToSave = categories.map(category => {
            const c = new Category();
            c.name = category.name;
            c.description = category.description;
            return c;
        });

        return await gen2array(this.mapper.batchPut(categoriesToSave));
    }

    async getCategories(): Promise<Category[]> {
        const categories = await gen2array(this.mapper.scan(Category));
        await this.addPhotoUrls(categories);
        return categories;
    }

    private async addPhotoUrls(categories: Category[]) {
        for (const category of categories) {
            if (category.hasImage) {
                const photoUrl = await this.generateUrl(category.name!);
                category.photoUrl = photoUrl;
            }
        }
    }

    async getCategoriesByNames(categories: string[]): Promise<Category[]> {
        const categoriesToGet = categories.map(category => {
            const c = new Category();
            c.name = category;
            return c;
        });
        const categoriesFromDb = await gen2array(this.mapper.batchGet(categoriesToGet));
        await this.addPhotoUrls(categoriesFromDb);
        return categoriesFromDb;
    }

    async generateUrl(s3PhotoKey: string): Promise<string> {
        const getObjectParams = { Bucket: photoBucket, Key: s3PhotoKey };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        return url;
    }

    async generatePresignedUrlForUpload(categoryName: string,): Promise<String> {
        const category = new Category();
        category.name = categoryName;
        try {
            await this.mapper.get(category);
        } catch (error) {
            throw {
                code: "ClientError",
                message: "Unknown category provided!"
            }
        }
        const bucketParams = {
            Bucket: photoBucket,
            Key: categoryName
        };
        const command = new PutObjectCommand(bucketParams);
        const signedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600,
        });
        return signedUrl;
    }

    async addImage(categoryName: string) {
        const category = new Category();
        category.name = categoryName;
        category.hasImage = true;
        await this.mapper.update(category);
    }

}

export default CategoryService;
