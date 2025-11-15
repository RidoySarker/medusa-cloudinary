import {
    AbstractFileProviderService,
    MedusaError,
} from "@medusajs/framework/utils"
import {
    Logger,
    ProviderDeleteFileDTO,
    ProviderFileResultDTO,
    ProviderUploadFileDTO,
} from "@medusajs/framework/types"
import { v2 as cloudinary } from "cloudinary"
import { Readable } from "stream"
import { randomUUID } from "crypto"

type InjectedDependencies = {
    logger: Logger
}

type Options = {
    apiKey: string
    apiSecret: string
    cloudName: string
    secure?: boolean
    folderName?: string
}

class CloudinaryFileProviderService extends AbstractFileProviderService {
    protected logger_: Logger
    protected options_: Options
    static identifier = "cloudinary"

    constructor({ logger }: InjectedDependencies, options: Options) {
        super()
        this.logger_ = logger
        this.options_ = options

        cloudinary.config({
            cloud_name: options.cloudName,
            api_key: options.apiKey,
            api_secret: options.apiSecret,
            secure: options.secure ?? true,
        })
    }

    static validateOptions(options: Options) {
        if (!options.apiKey || !options.apiSecret || !options.cloudName) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                "API key, API secret or Cloud Name is required in the Cloudinary provider's options."
            )
        }
    }

    async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
        const publicId = this.generatePublicId(file.filename)

        // Handle content based on whether it's a string or buffer
        let buffer: Buffer
        if (typeof file.content === "string") {
            // If content is base64 encoded
            buffer = Buffer.from(file.content, "base64")
        } else if (Buffer.isBuffer(file.content)) {
            buffer = file.content
        } else {
            // Fallback: try to create buffer from the content
            buffer = Buffer.from(file.content as any)
        }

        // Decide resource_type: images = "image", others = "raw"
        const resource_type = file.mimeType?.startsWith("image/") ? "image" : "raw"

        this.logger_.info(`Uploading file: ${file.filename}, type: ${file.mimeType}, resource_type: ${resource_type}`)

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type,
                    public_id: publicId,
                    folder: this.options_?.folderName || undefined,
                },
                (error, result) => {
                    if (error) {
                        this.logger_.error("Cloudinary upload error:", error)
                        return reject(error)
                    }
                    if (!result) {
                        return reject(new Error("No result returned from Cloudinary upload."))
                    }

                    this.logger_.info(`Successfully uploaded to Cloudinary: ${result.secure_url}`)

                    resolve({
                        url: result.secure_url,
                        key: result.public_id.replace(
                            this.options_?.folderName ? `${this.options_?.folderName}/` : "",
                            ""
                        ),
                    })
                }
            )

            Readable.from(buffer).pipe(uploadStream)
        })
    }

    async delete(file: ProviderDeleteFileDTO): Promise<void> {
        const publicId =
            (this.options_?.folderName ? `${this.options_?.folderName}/` : "") +
            file.fileKey.replace(/\.[^/.]+$/, "")

        await cloudinary.uploader.destroy(publicId).catch((err) => {
            this.logger_.warn(`Cloudinary delete failed: ${err}`)
        })
    }

    async getAsBuffer(file: { fileKey: string }): Promise<Buffer> {
        const url = cloudinary.url(file.fileKey, { secure: true })
        const response = await fetch(url)
        return Buffer.from(await response.arrayBuffer())
    }

    async getDownloadStream(file: { fileKey: string }): Promise<Readable> {
        const url = cloudinary.url(file.fileKey, { secure: true })
        const response = await fetch(url)
        return Readable.fromWeb(response.body as any)
    }

    async getPresignedDownloadUrl(file: { fileKey: string }): Promise<string> {
        return cloudinary.url(file.fileKey, { secure: true })
    }

    // Helper functions
    private cleanFilename(filename: string): string {
        const filenameWithoutExtension = filename.replace(/\.[^/.]+$/, "")
        return filenameWithoutExtension
            .replace(/[^a-zA-Z0-9.\-_]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "")
            .toLowerCase()
    }

    private generatePublicId(filename: string): string {
        const cleaned = this.cleanFilename(filename)
        const unique = randomUUID()
        return `${unique}_${cleaned}`
    }
}

export default CloudinaryFileProviderService
