package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.RoleDto;
import com.orchid.orchidbe.pojos.Role;
import com.orchid.orchidbe.repositories.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
    RoleRepository roleRepository;

    @Override
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Role findById(String id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Role add(RoleDto.RoleRequest roleRequest) {
        if (roleRepository.existsByName(roleRequest.name())) {
            throw new IllegalArgumentException("Role with name " + roleRequest.name() + " already exists");
        }

        return roleRepository.save(new Role(roleRequest.name()));
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Role update(String id, RoleDto.RoleRequest roleRequest) {
        if (roleRepository.existsByName(roleRequest.name())) {
            throw new IllegalArgumentException("Role with name " + roleRequest.name() + " already exists");
        }

        Role existingRole = findById(id);
        existingRole.setName(roleRequest.name());

        return roleRepository.save(existingRole);
    }

    @Override
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void delete(String id) {
        roleRepository.deleteById(id);
    }
}
