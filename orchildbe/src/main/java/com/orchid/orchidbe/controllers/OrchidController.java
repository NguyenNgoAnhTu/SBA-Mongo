package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.ApiResponse;
import com.orchid.orchidbe.dto.OrchidDto;
import com.orchid.orchidbe.services.OrchidService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/orchids")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrchidController {

    OrchidService orchidService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrchidDto.OrchidResponse>>> findAllOrchids() {
        return ApiResponse.success(orchidService.findAll());
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<OrchidDto.OrchidResponse>>> findAllOrchidsAvailable() {
        return ApiResponse.success(orchidService.findAllAvailable());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrchidDto.OrchidResponse>> findOrchidById(@PathVariable String id) {
        return ApiResponse.success(orchidService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrchidDto.OrchidResponse>> createOrchid(
            @Valid @RequestBody OrchidDto.OrchidRequest orchidRequest) {
        return ApiResponse.success(orchidService.add(orchidRequest));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateOrchid(
            @PathVariable String id,
            @Valid @RequestBody OrchidDto.OrchidRequest orchidReq,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = bindingResult.getFieldErrors().stream()
                    .collect(Collectors.toMap(
                            FieldError::getField,
                            fieldError -> Optional.ofNullable(fieldError.getDefaultMessage())
                                    .orElse("Unknown error")
                    ));
            return ApiResponse.validationError(errors);
        }

        return ApiResponse.updated(orchidService.update(id, orchidReq));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteOrchid(@PathVariable String id) {
        orchidService.delete(id);
        return ApiResponse.delete();
    }

    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> reactivateOrchid(@PathVariable String id) {
        orchidService.reactivate(id);
        return ApiResponse.noContent();
    }
}