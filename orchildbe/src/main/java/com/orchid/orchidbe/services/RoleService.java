package com.orchid.orchidbe.services;

import com.orchid.orchidbe.dto.RoleDto;
import com.orchid.orchidbe.pojos.Role;
import java.util.List;

public interface RoleService {
    List<Role> findAll();
    Role findById(String id);
    Role add(RoleDto.RoleRequest role);
    Role update(String id , RoleDto.RoleRequest role);
    void delete(String id);
}
