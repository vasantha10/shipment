package com.example.demo.shipment;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository repository;

    private final ShipmentMapper mapper = new ShipmentMapper();

    private ShipmentService service;

    private ShipmentRequest request;

    @BeforeEach
    void setUp() {
        service = new ShipmentService(repository, mapper);

        request = new ShipmentRequest();
        request.setTrackingNumber("SHP-1001");
        request.setSenderName("North Warehouse");
        request.setReceiverName("City Pharmacy");
        request.setOrigin("Leeds");
        request.setDestination("London");
        request.setCarrier("QuickMove Logistics");
        request.setExpectedDeliveryDate(LocalDate.now().plusDays(3));
    }

    @Test
    void create_defaultsStatusToCreated_whenStatusNotProvided() {
        when(repository.existsByTrackingNumber("SHP-1001")).thenReturn(false);
        when(repository.save(any(Shipment.class))).thenAnswer(invocation -> {
            Shipment s = invocation.getArgument(0);
            s.setId(1L);
            return s;
        });

        ShipmentResponse response = service.create(request);

        assertThat(response.getStatus()).isEqualTo(ShipmentStatus.CREATED);
        assertThat(response.getTrackingNumber()).isEqualTo("SHP-1001");
    }

    @Test
    void create_throwsConflict_whenTrackingNumberAlreadyExists() {
        when(repository.existsByTrackingNumber("SHP-1001")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(DuplicateTrackingNumberException.class);

        verify(repository, never()).save(any());
    }

    @Test
    void findById_throwsNotFound_whenShipmentDoesNotExist() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(ShipmentNotFoundException.class);
    }

    @Test
    void findAll_filtersByStatus_whenStatusProvided() {
        Shipment shipment = new Shipment();
        shipment.setId(1L);
        shipment.setStatus(ShipmentStatus.IN_TRANSIT);
        shipment.setTrackingNumber("SHP-2002");
        shipment.setSenderName("A");
        shipment.setReceiverName("B");
        shipment.setOrigin("X");
        shipment.setDestination("Y");
        shipment.setCarrier("Z");
        shipment.setExpectedDeliveryDate(LocalDate.now());

        when(repository.findByStatus(ShipmentStatus.IN_TRANSIT)).thenReturn(List.of(shipment));

        List<ShipmentResponse> results = service.findAll(ShipmentStatus.IN_TRANSIT);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getStatus()).isEqualTo(ShipmentStatus.IN_TRANSIT);
        verify(repository, never()).findAll();
    }

    @Test
    void delete_throwsNotFound_whenShipmentDoesNotExist() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(99L))
                .isInstanceOf(ShipmentNotFoundException.class);

        verify(repository, never()).deleteById(any());
    }
}
