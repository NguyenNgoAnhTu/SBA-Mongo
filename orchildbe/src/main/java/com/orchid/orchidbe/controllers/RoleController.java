package com.orchid.orchidbe.controllers;

import com.orchid.orchidbe.apis.ApiResponse;
import com.orchid.orchidbe.dto.RoleDto;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.services.RoleService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

    RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Role>>> findAll() {
        return ApiResponse.success(roleService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Role>> getById(@PathVariable String id) {
        return ApiResponse.success(roleService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> add(
            @Valid @RequestBody RoleDto.RoleRequest roleRequest,
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

        return ApiResponse.created(roleService.add(roleRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Role>> update(
            @PathVariable String id,
            @RequestBody RoleDto.RoleRequest roleRequest) {
        return ApiResponse.updated(roleService.update(id, roleRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable String id) {
        roleService.delete(id);
        return ApiResponse.delete();
    }
}