package com.orchid.orchidbe.mappers;

import com.orchid.orchidbe.dto.OrchidDto;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.pojos.Orchid;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-25T10:10:10+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class OrchidMapperImpl implements OrchidMapper {

    @Override
    public OrchidDto.OrchidResponse toOrchidResponse(Orchid orchid) {
        if ( orchid == null ) {
            return null;
        }

        boolean isAvailable = false;
        boolean isNatural = false;
        String id = null;
        String description = null;
        String name = null;
        String url = null;
        double price = 0.0d;
        Category category = null;

        isAvailable = orchid.isAvailable();
        isNatural = orchid.isNatural();
        id = orchid.getId();
        description = orchid.getDescription();
        name = orchid.getName();
        url = orchid.getUrl();
        price = orchid.getPrice();
        category = orchid.getCategory();

        OrchidDto.OrchidResponse orchidResponse = new OrchidDto.OrchidResponse( id, isNatural, description, name, url, price, isAvailable, category );

        return orchidResponse;
    }
}
