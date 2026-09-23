package com.example.demo.shipment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=validate")
class ShipmentRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private ShipmentRepository repository;

    private Shipment newShipment(String trackingNumber, ShipmentStatus status) {
        Shipment shipment = new Shipment();
        shipment.setTrackingNumber(trackingNumber);
        shipment.setSenderName("North Warehouse");
        shipment.setReceiverName("City Pharmacy");
        shipment.setOrigin("Leeds");
        shipment.setDestination("London");
        shipment.setCarrier("QuickMove Logistics");
        shipment.setStatus(status);
        shipment.setExpectedDeliveryDate(LocalDate.now().plusDays(3));
        return shipment;
    }

    @Test
    void findByStatus_returnsOnlyShipmentsMatchingStatus() {
        repository.save(newShipment("SHP-1001", ShipmentStatus.IN_TRANSIT));
        repository.save(newShipment("SHP-1002", ShipmentStatus.DELIVERED));
        repository.save(newShipment("SHP-1003", ShipmentStatus.IN_TRANSIT));

        List<Shipment> inTransit = repository.findByStatus(ShipmentStatus.IN_TRANSIT);

        assertThat(inTransit).hasSize(2);
        assertThat(inTransit)
                .extracting(Shipment::getTrackingNumber)
                .containsExactlyInAnyOrder("SHP-1001", "SHP-1003");
    }

    @Test
    void findByStatus_returnsEmptyList_whenNoShipmentsMatch() {
        repository.save(newShipment("SHP-2001", ShipmentStatus.CREATED));

        List<Shipment> cancelled = repository.findByStatus(ShipmentStatus.CANCELLED);

        assertThat(cancelled).isEmpty();
    }

    @Test
    void existsByTrackingNumber_detectsDuplicates() {
        repository.save(newShipment("SHP-3001", ShipmentStatus.CREATED));

        assertThat(repository.existsByTrackingNumber("SHP-3001")).isTrue();
        assertThat(repository.existsByTrackingNumber("SHP-9999")).isFalse();
    }
}
