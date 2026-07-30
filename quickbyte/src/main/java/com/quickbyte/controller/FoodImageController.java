package com.quickbyte.controller;

import com.quickbyte.dto.Request.FoodImageRequest;
import com.quickbyte.dto.Response.FoodImageResponse;
import com.quickbyte.service.FoodImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/food-images")
@RequiredArgsConstructor
public class FoodImageController {

    private final FoodImageService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodImageResponse add(
            @Valid
            @RequestBody
            FoodImageRequest request){

        return service.addImage(request);

    }

    @GetMapping("/food/{foodId}")
    public List<FoodImageResponse> get(
            @PathVariable Long foodId){

        return service.getImages(foodId);

    }

    @DeleteMapping("/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long imageId){

        service.deleteImage(imageId);

    }

}