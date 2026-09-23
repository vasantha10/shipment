package com.example.demo.shipment;

  import org.springframework.data.jpa.repository.JpaRepository;
  import java.util.List;
  import java.util.Optional;

  public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

      boolean existsByTrackingNumber(String trackingNumber);

      boolean existsByTrackingNumberAndIdNot(String trackingNumber, Long id);

      Optional<Shipment> findByTrackingNumber(String trackingNumber);

      List<Shipment> findByStatus(ShipmentStatus status);
  }
