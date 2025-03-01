import React from "react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <div className="quote-icon">"</div>
        <p className="testimonial-quote">{testimonial.quote}</p>
        <div className="testimonial-author">
          <p className="author-name">{testimonial.author}</p>
          <p className="author-school">{testimonial.school}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
