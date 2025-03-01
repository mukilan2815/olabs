import React from "react";
import { Link } from "react-router-dom";

export default function SubjectCard({ subject }) {
  return (
    <Link
      to={subject.link}
      className="subject-card"
      style={{ backgroundColor: subject.color }}
    >
      <img src={subject.icon} alt={subject.name} className="subject-icon" />
      <h3 className="subject-name">{subject.name}</h3>
    </Link>
  );
}
