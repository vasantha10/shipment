package com.example.demo.shipment;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ShipmentController.class)
class ShipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ShipmentService service;

    private ShipmentResponse sampleResponse() {
        ShipmentResponse response = new ShipmentResponse();
        response.setId(1L);
        response.setTrackingNumber("SHP-1001");
        response.setSenderName("North Warehouse");
        response.setReceiverName("City Pharmacy");
        response.setOrigin("Leeds");
        response.setDestination("London");
        response.setCarrier("QuickMove Logistics");
        response.setStatus(ShipmentStatus.CREATED);
        response.setExpectedDeliveryDate(LocalDate.now().plusDays(3));
        response.setCreatedAt(LocalDateTime.now());
        response.setUpdatedAt(LocalDateTime.now());
        return response;
    }

    @Test
    void getById_returns404_whenNotFound() throws Exception {
        when(service.findById(99L)).thenThrow(new ShipmentNotFoundException(99L));

        mockMvc.perform(get("/api/shipments/{id}", 99L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Shipment with id 99 was not found"));
    }

    @Test
    void create_returns201_whenValid() throws Exception {
        when(service.create(any(ShipmentRequest.class))).thenReturn(sampleResponse());

        String body = """
            {
              "trackingNumber": "SHP-1001",
              "senderName": "North Warehouse",
              "receiverName": "City Pharmacy",
              "origin": "Leeds",
              "destination": "London",
              "carrier": "QuickMove Logistics",
              "expectedDeliveryDate": "2026-12-01"
            }
            """;

        mockMvc.perform(post("/api/shipments")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackingNumber").value("SHP-1001"));
    }

    @Test
    void create_returns400_whenTrackingNumberMissing() throws Exception {
        String body = """
            {
              "senderName": "North Warehouse",
              "receiverName": "City Pharmacy",
              "origin": "Leeds",
              "destination": "London",
              "carrier": "QuickMove Logistics",
              "expectedDeliveryDate": "2026-12-01"
            }
            """;

        mockMvc.perform(post("/api/shipments")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void delete_returns204_whenSuccessful() throws Exception {
        mockMvc.perform(delete("/api/shipments/{id}", 1L))
                .andExpect(status().isNoContent());
    }

    @Test
    void create_returns409_whenDuplicateTrackingNumber() throws Exception {
        when(service.create(any(ShipmentRequest.class)))
                .thenThrow(new DuplicateTrackingNumberException("SHP-1001"));

        String body = """
            {
              "trackingNumber": "SHP-1001",
              "senderName": "North Warehouse",
              "receiverName": "City Pharmacy",
              "origin": "Leeds",
              "destination": "London",
              "carrier": "QuickMove Logistics",
              "expectedDeliveryDate": "2026-12-01"
            }
            """;

        mockMvc.perform(post("/api/shipments")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    void create_returns409_whenDatabaseRejectsDuplicateTrackingNumberConcurrently() throws Exception {
        // Simulates two concurrent creates both passing the service-layer existsByTrackingNumber
        // check before either commits - the DB's unique constraint is the real guard here.
        when(service.create(any(ShipmentRequest.class)))
                .thenThrow(new org.springframework.dao.DataIntegrityViolationException("duplicate key value"));

        String body = """
            {
              "trackingNumber": "SHP-1001",
              "senderName": "North Warehouse",
              "receiverName": "City Pharmacy",
              "origin": "Leeds",
              "destination": "London",
              "carrier": "QuickMove Logistics",
              "expectedDeliveryDate": "2026-12-01"
            }
            """;

        mockMvc.perform(post("/api/shipments")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isConflict());
    }
}
