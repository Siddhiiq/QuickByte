package com.quickbyte.service.impl;

import com.quickbyte.dto.Request.FoodImageRequest;
import com.quickbyte.dto.Response.FoodImageResponse;
import com.quickbyte.entity.Food.Food;
import com.quickbyte.entity.Food.FoodImage;
import com.quickbyte.exception.ResourceNotFoundException;
import com.quickbyte.mapper.FoodImageMapper;
import com.quickbyte.repository.FoodImageRepository;
import com.quickbyte.repository.FoodRepository;
import com.quickbyte.service.FoodImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodImageServiceImpl
        implements FoodImageService {

    private final FoodRepository foodRepository;
    private final FoodImageRepository imageRepository;

    @Override
    public FoodImageResponse addImage(
            FoodImageRequest request){

        Food food=foodRepository.findById(
                        request.getFoodId())
                .orElseThrow(()->new ResourceNotFoundException(
                        "Food not found"));

        FoodImage image=
                FoodImageMapper.toEntity(
                        request,
                        food);

        return FoodImageMapper.toResponse(
                imageRepository.save(image));

    }

    @Override
    public List<FoodImageResponse> getImages(
            Long foodId){

        return imageRepository
                .findByFoodIdOrderByDisplayOrderAsc(foodId)
                .stream()
                .map(FoodImageMapper::toResponse)
                .toList();

    }

    @Override
    public void deleteImage(
            Long imageId){

        imageRepository.deleteById(imageId);

    }

}