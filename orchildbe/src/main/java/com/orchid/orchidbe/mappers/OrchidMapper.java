package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.OrchidDto;
import com.orchid.orchidbe.pojos.Orchid;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrchidMapper {
    @Mapping(source = "available", target = "isAvailable")
    @Mapping(source = "natural", target = "isNatural")
    OrchidDto.OrchidResponse toOrchidResponse(Orchid orchid);
}
