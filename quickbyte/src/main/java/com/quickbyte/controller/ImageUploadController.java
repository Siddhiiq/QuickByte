package com.quickbyte.controller;

import com.quickbyte.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadImage(
            @RequestPart("file") MultipartFile file)  throws IOException {

        String imageUrl =
                imageUploadService.uploadImage(file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Image uploaded successfully",
                        "imageUrl", imageUrl
                )
        );
    }
}
