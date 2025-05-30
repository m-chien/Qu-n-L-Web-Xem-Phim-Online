package org.example.mapper;

import org.example.dto.request.khachhangCreationRequest;
import org.example.dto.request.khachhangUpdateRequest;
import org.example.model.khachhang;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface khachhangMapper {
    khachhang tokhachhang(khachhangCreationRequest request);
    void updateKhachhang(@MappingTarget khachhang khachhang, khachhangUpdateRequest khachhangUpdateRequest);
}
