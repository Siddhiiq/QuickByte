package com.quickbyte.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.quickbyte.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadServiceImpl
        implements ImageUploadService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(
            MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Image file cannot be empty");
        }

        Map<?, ?> result =
                cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder",
                                "quickbyte"
                        )
                );

        return result.get("secure_url").toString();
    }

    @Override
    public void deleteImage(
            String publicId) throws IOException {

        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
        );
    }
}