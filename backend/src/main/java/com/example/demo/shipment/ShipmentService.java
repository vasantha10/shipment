package com.example.demo.shipment;

  import org.springframework.stereotype.Service;
  import org.springframework.transaction.annotation.Transactional;

  import java.util.List;

  @Service
  public class ShipmentService {

      private final ShipmentRepository repository;
      private final ShipmentMapper mapper;

      public ShipmentService(ShipmentRepository repository, ShipmentMapper mapper) {
          this.repository = repository;
          this.mapper = mapper;
      }

      @Transactional(readOnly = true)
      public List<ShipmentResponse> findAll(ShipmentStatus status) {
          List<Shipment> shipments = (status == null)
                  ? repository.findAll()
                  : repository.findByStatus(status);

          return shipments.stream().map(mapper::toResponse).toList();
      }

      @Transactional(readOnly = true)
      public ShipmentResponse findById(Long id) {
          Shipment shipment = repository.findById(id)
                  .orElseThrow(() -> new ShipmentNotFoundException(id));
          return mapper.toResponse(shipment);
      }

      @Transactional
      public ShipmentResponse create(ShipmentRequest request) {
          if (repository.existsByTrackingNumber(request.getTrackingNumber())) {
              throw new DuplicateTrackingNumberException(request.getTrackingNumber());
          }

          Shipment shipment = new Shipment();
          mapper.applyToEntity(request, shipment);
          if (shipment.getStatus() == null) {
              shipment.setStatus(ShipmentStatus.CREATED);
          }

          Shipment saved = repository.save(shipment);
          return mapper.toResponse(saved);
      }

      @Transactional
      public ShipmentResponse update(Long id, ShipmentRequest request) {
          Shipment shipment = repository.findById(id)
                  .orElseThrow(() -> new ShipmentNotFoundException(id));

          if (repository.existsByTrackingNumberAndIdNot(request.getTrackingNumber(), id)) {
              throw new DuplicateTrackingNumberException(request.getTrackingNumber());
          }

          mapper.applyToEntity(request, shipment);
          if (shipment.getStatus() == null) {
              shipment.setStatus(ShipmentStatus.CREATED);
          }

          Shipment saved = repository.save(shipment);
          return mapper.toResponse(saved);
      }

      @Transactional
      public void delete(Long id) {
          if (!repository.existsById(id)) {
              throw new ShipmentNotFoundException(id);
          }
          repository.deleteById(id);
      }
  }
