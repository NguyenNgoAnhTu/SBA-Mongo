package com.orchid.orchidbe.pojos;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "orchids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Orchid {
    @Id
    String id;

    boolean isNatural;

    String description;

    String name;

    String url;

    @Positive
    double price;

    boolean isAvailable;

    @DocumentReference
    Category category;
}
