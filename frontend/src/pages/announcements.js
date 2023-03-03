import ViewServices from "./ViewServices";

const Announcements = ({ selected }) => {
  switch (selected) {
    case "Announcements":
      return (
        <strong>
          Actual hours in our all the stores might differ due to christmas
          holidays
        </strong>
      );
    case "Returns":
      return <strong>Please find nearest location to return your item.</strong>;
    case "In-StoreServices":
      return <ViewServices />;
    default:
      break;
  }
};

export default Announcements;
