package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.OrchidDto;
import com.orchid.orchidbe.mappers.OrchidMapper;
import com.orchid.orchidbe.pojos.Category;
import com.orchid.orchidbe.pojos.Orchid;
import com.orchid.orchidbe.repositories.CategoryRepository;
import com.orchid.orchidbe.repositories.OrchidRepository;

import java.util.List;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrchidServiceImpl implements OrchidService {
    OrchidRepository orchidRepository;
    CategoryRepository categoryRepository;
    OrchidMapper orchidMapper;

    @Override
    public List<OrchidDto.OrchidResponse> findAll() {
        return orchidRepository.findAll()
                .stream()
                .map(orchidMapper::toOrchidResponse)
                .toList();
    }

    @Override
    public List<OrchidDto.OrchidResponse> findAllAvailable() {
        return orchidRepository.findAll()
                .stream()
                .filter(Orchid::isAvailable)
                .map(orchidMapper::toOrchidResponse)
                .toList();
    }

    @Override
    public OrchidDto.OrchidResponse findById(String id) {
        return orchidRepository.findById(id)
                .map(orchidMapper::toOrchidResponse)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public OrchidDto.OrchidResponse add(OrchidDto.OrchidRequest orchidRequest) {
        if (orchidRepository.existsByName(orchidRequest.name())) {
            throw new IllegalArgumentException("Orchid with name " + orchidRequest.name() + " already exists");
        }

        Category category = categoryRepository.findById(orchidRequest.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        Orchid newOrchid = new Orchid();
        newOrchid.setNatural(orchidRequest.isNatural());
        newOrchid.setDescription(orchidRequest.description());
        newOrchid.setName(orchidRequest.name());
        newOrchid.setUrl(orchidRequest.url());
        newOrchid.setPrice(orchidRequest.price());
        newOrchid.setAvailable(true);
        newOrchid.setCategory(category);

        orchidRepository.save(newOrchid);

        return orchidMapper.toOrchidResponse(newOrchid);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public OrchidDto.OrchidResponse update(String id, OrchidDto.OrchidRequest orchidRequest) {
        Orchid existingOrchid = orchidRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));

        if (orchidRepository.existsByNameAndIdNot(orchidRequest.name(), id)) {
            throw new IllegalArgumentException("Orchid with name " + orchidRequest.name() + " already exists");
        }

        Category category = categoryRepository.findById(orchidRequest.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        existingOrchid.setNatural(orchidRequest.isNatural());
        existingOrchid.setDescription(orchidRequest.description());
        existingOrchid.setName(orchidRequest.name());
        existingOrchid.setUrl(orchidRequest.url());
        existingOrchid.setPrice(orchidRequest.price());
        existingOrchid.setCategory(category);

        orchidRepository.save(existingOrchid);

        return orchidMapper.toOrchidResponse(existingOrchid);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String orchidId) {
        Orchid existingOrchid = orchidRepository.findById(orchidId)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));

        existingOrchid.setAvailable(false);

        orchidRepository.save(existingOrchid);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public void reactivate(String orchidId) {
        Orchid existingOrchid = orchidRepository.findById(orchidId)
                .orElseThrow(() -> new IllegalArgumentException("Orchid not found"));

        existingOrchid.setAvailable(true);

        orchidRepository.save(existingOrchid);
    }
}
