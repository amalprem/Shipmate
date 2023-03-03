import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  textarea: {
    border: "3px solid #a9a9a9",
    borderRadius: 5,
    padding: 10,
    margin: "20px 0",
    minHeight: 100,
    width: 300,
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
  },
};
const ReviewRatings = ({ data, toggleModal, submittoggle }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [review, setReview] = useState(null);
  const stars = Array(5).fill(0);
  const url = "http://localhost:5000";

  const handleClick = (value) => {
    setCurrentValue(value);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const handleSubmit = () => {
    console.log({
      orderid: data.OrderId,
      rating: currentValue,
      review: review,
    });
    async function submitReviewRating() {
      if (currentValue > 0 && review !== null) {
        await axios.post(`${url}/submitReviewRating`, {
          orderid: data.OrderId,
          rating: currentValue,
          review: review,
        });
      }
    }
    submitReviewRating();
    submittoggle();
  };

  return (
    <div style={styles.container}>
      <h2> Review & Ratings for {data.Shipment_id} </h2>
      <div style={styles.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={40}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || currentValue) > index ? "#FFBA5A" : "#a9a9a9"
              }
              style={{
                marginRight: 10,
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
      <textarea
        placeholder="What's your experience?"
        style={styles.textarea}
        onChange={(e) => {
          setReview(e.target.value);
        }}
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default ReviewRatings;
