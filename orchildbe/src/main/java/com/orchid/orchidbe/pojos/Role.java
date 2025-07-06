package com.orchid.orchidbe.pojos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    String id;

    String name;

    public Role(String name) {
        this.name = name.toUpperCase();
    }

    public void setName(String name) {
        this.name = name.toUpperCase();
    }
}
