import { v2 as cloudinary } from "cloudinary";

// Implement Singleton pattern;
class CloudinaryConnection {
    private static instance: typeof cloudinary | null = null;

    // Private constructor to prevent direct instatiation
    private constructor() {}

    // Static method to get cloudnary instance
    public static getInstance(): typeof cloudinary {
        if (!CloudinaryConnection.instance) {
            CloudinaryConnection.instance = cloudinary;
            cloudinary.config({
                cloud_name: "divuiz1hv",
                api_key: "564456337381616",
                api_secret: "5vZ290YdcL23NyqegSFzYH2Y5L4",
            });
        }

        return CloudinaryConnection.instance;
    }
}

export default CloudinaryConnection;
