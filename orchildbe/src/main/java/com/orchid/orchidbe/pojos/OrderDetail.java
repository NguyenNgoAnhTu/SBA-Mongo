package com.orchid.orchidbe.pojos;

import jakarta.validation.constraints.Positive;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "order_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetail {
    @Id
    String id;

    @Positive
    double price;

    @Positive
    int quantity;

    @DocumentReference
    Orchid orchid;

    @DocumentReference
    Order order;
}
