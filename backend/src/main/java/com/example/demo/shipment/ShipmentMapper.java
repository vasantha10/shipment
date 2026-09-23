package com.example.demo.shipment;

  import org.springframework.stereotype.Component;

  @Component
  public class ShipmentMapper {

      public ShipmentResponse toResponse(Shipment shipment) {
          ShipmentResponse response = new ShipmentResponse();
          response.setId(shipment.getId());
          response.setTrackingNumber(shipment.getTrackingNumber());
          response.setSenderName(shipment.getSenderName());
          response.setReceiverName(shipment.getReceiverName());
          response.setOrigin(shipment.getOrigin());
          response.setDestination(shipment.getDestination());
          response.setCarrier(shipment.getCarrier());
          response.setStatus(shipment.getStatus());
          response.setExpectedDeliveryDate(shipment.getExpectedDeliveryDate());
          response.setCreatedAt(shipment.getCreatedAt());
          response.setUpdatedAt(shipment.getUpdatedAt());
          return response;
      }

      public void applyToEntity(ShipmentRequest request, Shipment shipment) {
          shipment.setTrackingNumber(request.getTrackingNumber());
          shipment.setSenderName(request.getSenderName());
          shipment.setReceiverName(request.getReceiverName());
          shipment.setOrigin(request.getOrigin());
          shipment.setDestination(request.getDestination());
          shipment.setCarrier(request.getCarrier());
          shipment.setStatus(request.getStatus());
          shipment.setExpectedDeliveryDate(request.getExpectedDeliveryDate());
      }
  }
