import OrderCard from "../components/order-card-react";

const AssignDelivery = () => {
  return (
    <div style={{ margin: "2rem" }}>
      <div className="fonts" style={{ fontSize: "1.5rem" }}>
        Assign Orders to Delivery Persons
      </div>
      <OrderCard></OrderCard>
    </div>
  );
};

export default AssignDelivery;
