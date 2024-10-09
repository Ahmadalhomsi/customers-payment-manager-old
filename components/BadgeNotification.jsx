import React, { useEffect, useState } from "react";
import {
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon";
import axios from "axios";
import { format } from "date-fns";

export function BadgeNotification() {
  const [isInvisible, setIsInvisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [todayServices, setTodayServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: onModalOpenChange } = useDisclosure();

  async function fetchServices(setTodayServices) {
    try {
      const response = await axios.get(`/api/services/`);
      const today = format(new Date(), "yyyy-MM-dd");

      const todayServices = response.data.filter((service) => {
        const serviceEndDate = service.endingDate.toString().split("T")[0];
        return serviceEndDate === today;
      });

      setTodayServices(todayServices);

      if (todayServices.length > 0)
        setIsInvisible(false);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }

  useEffect(() => {
    fetchServices(setTodayServices);
  }, []);

  const handleNotificationClick = (service) => {
    setIsOpen(false);
    setIsInvisible(false);
    setSelectedService(service);
    openModal();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Popover
          placement="bottom"
          isOpen={isOpen}
          onOpenChange={(open) => setIsOpen(open)}
        >
          <PopoverTrigger>
            <div className="cursor-pointer flex items-center">
              <Badge
                style={{ backgroundColor: "#f26000" }}
                content={todayServices.length}
                isInvisible={isInvisible}
                shape="circle"
              >
                <NotificationIcon className="fill-current" size={30} />
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2">
              <h3 className="text-lg font-bold mb-2">Notifications</h3>
              {todayServices.length > 0 ? (
                todayServices.map((service) => (
                  <div
                    key={service.id}
                    className="mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleNotificationClick(service)}
                  >
                    <p className="text-sm">{service.name} - {service.customer.name}</p>
                    <p className="text-xs text-gray-500">
                      Ends: {service.endingDate.toString().split('T')[0]}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No services ending today.</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={onModalOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedService?.name}
              </ModalHeader>
              <ModalBody>
                {selectedService && (
                  <>
                    <p><strong>Customer:</strong> {selectedService.customer.name}</p>
                    <p><strong>Description:</strong> {selectedService.description}</p>
                    <p><strong>Payment Type:</strong> {selectedService.paymentType}</p>
                    <p><strong>Period Price:</strong> {selectedService.periodPrice} {selectedService.currency}</p>
                    <p><strong>Starting Date:</strong> {selectedService.startingDate.toString().split('T')[0]}</p>
                    <p><strong>Ending Date:</strong> {selectedService.endingDate.toString().split('T')[0]}</p>
                    <p><strong>Customer Email:</strong> {selectedService.customer.email}</p>
                    <p><strong>Customer Phone:</strong> {selectedService.customer.phone}</p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}