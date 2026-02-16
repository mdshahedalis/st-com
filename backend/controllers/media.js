const DB = require("../config/datasource"); 
const Media = require("../models/media"); 
const { uploadToS3 } = require("../config/cloude");

exports.uploadMedia = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype, size } = req.file;
    // Frontend sends 'fieldName', NOT 'media_type' directly
    const { fieldName, specialistId, display_order } = req.body; 

    try {
        // 1. Determine Media Type based on the field name
        let dbMediaType = 'gallery'; // Default fallback
        
        if (fieldName === 'cover_image') {
            dbMediaType = 'cover';
        } else if (fieldName && fieldName.includes('gallery')) {
            dbMediaType = 'gallery';
        } else if (fieldName === 'thumbnail') {
            dbMediaType = 'thumbnail';
        }

        // 2. Upload to S3
        const fileUrl = await uploadToS3(buffer, originalname, mimetype);

        // 3. Determine Mime Type (image/video/doc)
        let simpleMimeType = 'document'; 
        if (mimetype.startsWith('image/')) simpleMimeType = 'image';
        if (mimetype.startsWith('video/')) simpleMimeType = 'video';

        const mediaRepository = DB.getRepository(Media); 

        // 4. Create Entity
        const newMedia = mediaRepository.create({
            file_name: fileUrl,
            file_size: size,
            mime_type: simpleMimeType,
            media_type: dbMediaType, // <--- Now using the mapped value
            display_order: display_order ? parseInt(display_order) : 0,
            specialist: specialistId && specialistId !== "null" ? { id: specialistId } : null 
        });

        const savedMedia = await mediaRepository.save(newMedia);

        res.status(201).json({ 
            message: 'Media uploaded successfully', 
            fileUrl: fileUrl, 
            media: savedMedia 
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ 
            message: 'Error processing upload', 
            error: error.message 
        });
    }
};