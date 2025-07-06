package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrchidDto;

import java.util.List;

public interface OrchidService {

    List<OrchidDto.OrchidResponse> findAll();
    List<OrchidDto.OrchidResponse> findAllAvailable();
    OrchidDto.OrchidResponse findById(String id);
    OrchidDto.OrchidResponse add(OrchidDto.OrchidRequest orchidRequest);
    OrchidDto.OrchidResponse update(String id, OrchidDto.OrchidRequest orchidRequest);
    void delete(String orchidId);
    void reactivate(String orchidId);
}
