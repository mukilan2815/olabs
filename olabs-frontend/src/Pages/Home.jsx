import React from "react";
import { Link } from "react-router-dom";
import Carousel from "./components/Carousel";
import SubjectCard from "./components/SubjectCard";
import TestimonialCard from "./components/TestimonialCard";
import SchoolCard from "./components/SchoolCard";
import StatsCounter from "./components/StatsCounter";
import "./css/OLabsHome.css";
export default function Home() {
  const carouselItems = [
    {
      title: "Digital Content mapped to the SCHOOL SYLLABUS",
      image:
        "https://www.shutterstock.com/image-photo/sample-image-url-600w-1200h",
      description:
        "Interactive learning experiences aligned with NCERT/CBSE and State Board Syllabus",
    },
    {
      title: "Perform Lab Experiments Anywhere, Anytime",
      image:
        "https://www.shutterstock.com/image-photo/sample-image-url-600w-1200h",
      description:
        "Access to virtual labs for students with no access to physical labs",
    },
    {
      title: "Interactive Simulations & Animations",
      image:
        "https://www.shutterstock.com/image-photo/sample-image-url-600w-1200h",
      description:
        "Real-world lab environments created with cutting-edge simulation technology",
    },
    {
      title: "From Class 9 to Class 12",
      image:
        "https://www.shutterstock.com/image-photo/sample-image-url-600w-1200h",
      description:
        "Physics, Chemistry, Biology Labs and more for secondary education",
    },
    {
      title: "Free Access for Registered Schools",
      image:
        "https://www.shutterstock.com/image-photo/sample-image-url-600w-1200h",
      description:
        "Register your school today for free access to all OLabs resources",
    },
  ];

  const subjects = [
    {
      name: "PHYSICS",
      color: "#FF9800",
      icon: "https://img.icons8.com/ios-filled/50/FF9800/atom.png", // Physics icon from Flaticon
      link: "/services/physics", // Link to Physics services page
    },
    {
      name: "CHEMISTRY",
      color: "#2196F3",
      icon: "https://img.icons8.com/ios-filled/50/2196F3/test-tube.png", // Chemistry icon from Flaticon
      link: "/services/chemistry", // Link to Chemistry services page
    },
    {
      name: "BIOLOGY",
      color: "#4CAF50",
      icon: "https://img.icons8.com/ios-filled/50/4CAF50/dna.png", // Biology icon from Flaticon
      link: "/services/biology", // Link to Biology services page
    },
    {
      name: "MATHS",
      color: "#F44336",
      icon: "https://img.icons8.com/ios-filled/50/F44336/math.png", // Maths icon from Flaticon
      link: "/services/maths", // Link to Maths services page
    },
    {
      name: "LANGUAGE",
      color: "#9C27B0",
      icon: "https://img.icons8.com/ios-filled/50/9C27B0/language.png", // Language icon from Flaticon
      link: "/services/language", // Link to Language services page
    },
    {
      name: "SCIENCE",
      color: "#009688",
      icon: "https://img.icons8.com/ios-filled/50/009688/science.png", // Science icon from Flaticon
      link: "/services/science", // Link to Science services page
    },
    {
      name: "SOCIAL SCIENCE",
      color: "#FFEB3B",
      icon: "https://img.icons8.com/ios-filled/50/FFEB3B/social-science.png", // Social Science icon from Flaticon
      link: "/services/social-science", // Link to Social Science services page
    },
    {
      name: "COMPUTER",
      color: "#3F51B5",
      icon: "https://img.icons8.com/ios-filled/50/3F51B5/computer.png", // Computer icon from Flaticon
      link: "/services/computer", // Link to Computer services page
    },
    {
      name: "3D/AR/VR",
      color: "#E91E63",
      icon: "https://img.icons8.com/ios-filled/50/E91E63/3d.png", // 3D/AR/VR icon from Flaticon
      link: "/services/3d-ar-vr", // Link to 3D/AR/VR services page
    },
    {
      name: "EDP",
      color: "#00BCD4",
      icon: "https://img.icons8.com/ios-filled/50/00BCD4/edp.png", // EDP icon from Flaticon
      link: "/services/edp", // Link to EDP services page
    },
    {
      name: "ISL",
      color: "#FFC107",
      icon: "https://img.icons8.com/ios-filled/50/FFC107/isl.png", // ISL icon from Flaticon
      link: "/services/isl", // Link to ISL services page
    },
    {
      name: "Generate Your Own",
      color: "#C107",
      icon: "https://img.icons8.com/ios-filled/50/C107/generate.png", // Generate Your Own icon from Flaticon
      link: "/labgeneration", // Link to Generate Your Own services page
    },
  ];

  const testimonials = [
    {
      quote:
        "It is good for students for visual learning. Good for the schools also.",
      author: "Rakesh Khandelwal",
      school: "St.Mary's Convent Sr Sec School, Ajmer",
    },
    {
      quote:
        "Many practicals of biology which cannot be performed in labs can be shown. Student can revise the experiments any time.",
      author: "Atul Rathi",
      school: "M.P.S, Ajmer",
    },
    {
      quote:
        "Online labs provide every student an opportunity to understand every detail relating to their subject matter taught to them in the schools. It enables them a deeper understanding.",
      author: "Sujit Malakar",
      school: "Dhamma Dipa School, Tripura",
    },
    {
      quote: "Students can access the lab activities at home as well & revise.",
      author: "Avijeet Sengupta",
      school: "Mahaveer Public School Jaipur",
    },
    {
      quote: "Good to have virtual experiences of real lab experiments.",
      author: "Babu Lal Mali",
      school: "Demonstration Multipurpose School, Ajmer",
    },
    {
      quote:
        "It is very helpful for teachers as well as students for fruitful practical classes.",
      author: "Suraj Chandra Saha",
      school: "Garia Academy (Model), Assam",
    },
  ];

  const schools = [
    "Birla School Pilani, Rajasthan",
    "Kendriya Vidyalaya, Vijayanarayanam, Tamil Nadu",
    "Delhi Public School, Bidhanagar Durgapur, West Bengal",
    "Central model School, West Bengal",
    "Navy Children School, Chanakyapuri, New Delhi",
    "Abhyasa International Residential School, Toopran",
    "Kendriya vidyalaya Fort William, Kolkata, West Bengal",
    "Woodlem Park School; Ajman",
    "K.V No-2, Jhapatapur, Railway settlement, Kharagpur, West Bengal",
    "Kendriya Vidyalaya Zirakpur, Punjab",
    "Kendriya Vidyalaya No.2 Raipur Chhattisgarh",
    "Amrita Vidyalayam Bangalore",
  ];

  return (
    <div className="olabs-landing-page">
      {/* Header with logos */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="header-text">
                <img
                  src="https://www.olabs.edu.in/theme/amrita_olabs_wt_responsive/images/logo3.jpg"
                  alt="OLabs"
                  className="olabs-logo"
                />
              </div>
            </div>
            <div className="header-right">
              <img
                src="https://www.olabs.edu.in/theme/amrita_olabs_wt_responsive/images/amrita-logo.png"
                alt="Amrita Vishwa Vidyapeetham"
              />
              <img
                src="https://www.olabs.edu.in/theme/amrita_olabs_wt_responsive/images/cdac-logo.jpg"
                alt="CDAC"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-links">
              <Link to="/" className="nav-link active">
                Home
              </Link>
              <Link to="/about" className="nav-link">
                About
              </Link>
              <Link to="/news" className="nav-link">
                In the news
              </Link>
              <Link to="/workshops" className="nav-link">
                Workshops
              </Link>
              <Link to="/training" className="nav-link">
                Training
              </Link>
              <Link to="/download" className="nav-link">
                Download
              </Link>
              <Link to="/contact" className="nav-link">
                Contact us
              </Link>
            </div>
            <div className="language-dropdown">
              <button className="language-button">
                Languages
                <svg className="dropdown-icon" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <div className="language-menu">
                <Link to="#" className="language-option">
                  English
                </Link>
                <Link to="#" className="language-option">
                  हिंदी
                </Link>
                <Link to="#" className="language-option">
                  മലയാളം
                </Link>
                <Link to="#" className="language-option">
                  मराठी
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Carousel */}
      <section className="hero-section">
        <Carousel items={carouselItems} />
      </section>

      {/* Subjects Grid */}
      <section className="subjects-section">
        <div className="container">
          <h2 className="section-title">Explore Our Virtual Labs</h2>
          <div className="subjects-grid">
            {subjects.map((subject, index) => (
              <SubjectCard key={index} subject={subject} />
            ))}
          </div>
        </div>
      </section>

      {/* About OLabs */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="OLabs on multiple devices"
                className="about-img"
              />
            </div>
            <div className="about-text">
              <h2 className="section-title">What is OLabs?</h2>
              <p className="about-description">
                The OLabs is based on the idea that lab experiments can be
                taught using the Internet, more efficiently and less
                expensively. The labs can also be made available to students
                with no access to physical labs or where equipment is not
                available owing to being scarce or costly.
              </p>
              <p className="about-description">
                This helps them compete with students in better equipped schools
                and bridges the digital divide and geographical distances. The
                experiments can be accessed anytime and anywhere, overcoming the
                constraints on time felt when having access to the physical lab
                for only a short period of time.
              </p>

              <div className="features-box">
                <h3 className="features-title">Key Features</h3>
                <ul className="features-list">
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>
                      Content aligned to NCERT/CBSE and State Board Syllabus
                    </span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>
                      Physics, Chemistry, Biology Labs from Class 9 to Class 12
                    </span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>
                      Interactive simulations, animations and lab videos
                    </span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>
                      Perform, record and learn experiments - anywhere, anytime
                    </span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>
                      'Learning-enabled assessment' of procedural and conceptual
                      skills
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-content">
            <StatsCounter label="Teachers" endValue={104107} />
            <StatsCounter label="Schools" endValue={21243} />
          </div>
        </div>
      </section>

      {/* Featured Simulation */}
      <section className="simulation-section">
        <div className="container">
          <h2 className="section-title">Featured Simulation</h2>
          <p className="section-subtitle">
            Experience our interactive simulations
          </p>

          <div className="simulation-card">
            <div className="simulation-content">
              <div className="simulation-text">
                <h3 className="simulation-title">Equivalent Resistance</h3>
                <p className="simulation-description">
                  A simulation to determine the equivalent resistance of two
                  resistors when connected in parallel. A student gets to study
                  what resistance is, how it is measured and about resistance in
                  a parallel combination. The simulation allows the student to
                  perform the actual experiment online.
                </p>
                <Link to="#" className="simulation-button">
                  Try Simulation
                </Link>
              </div>
              <div className="simulation-image">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Equivalent Resistance Simulation"
                  className="simulation-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Schools Feedback</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="app-cta-section">
        <div className="container">
          <div className="app-cta-content">
            <div className="app-cta-text">
              <h2 className="app-cta-title">Take OLabs With You</h2>
              <p className="app-cta-description">
                Access our virtual labs anytime, anywhere with the OLabs mobile
                app
              </p>
              <button className="app-download-button">
                <svg className="app-download-icon" viewBox="0 0 24 24">
                  <path d="M17.6,9.48l-1.91-3.31h0a0.61,0.61,0,0,0-.54-.29h0a0.61,0.61,0,0,0-.53.29L12.25,9.48H6.88a0.61,0.61,0,0,0-.54.29h0a0.61,0.61,0,0,0,0,.62l3.19,5.51h0a0.61,0.61,0,0,0,.53.29h0a0.61,0.61,0,0,0,.53-0.29l3.19-5.51h0A0.61,0.61,0,0,0,13.78,10h0a0.61,0.61,0,0,0-.53-0.29Z" />
                </svg>
                Download OLabs Android App
              </button>
            </div>
            <div className="app-cta-image">
              <img
                src="/placeholder.svg?height=500&width=300"
                alt="OLabs Android App"
                className="app-mockup"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Schools List */}
      <section className="schools-section">
        <div className="container">
          <h2 className="section-title">Schools Registered with OLabs</h2>
          <div className="schools-grid">
            {schools.map((school, index) => (
              <SchoolCard key={index} school={school} />
            ))}
          </div>
          <div className="view-all-container">
            <Link to="#" className="view-all-link">
              View all registered schools →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <p className="footer-tagline">
              Developed by Amrita Vishwa Vidyapeetham & CDAC Mumbai. Funded by
              MeitY (Ministry of Electronics & Information Technology)
            </p>
            <div className="footer-languages">
              <Link to="#" className="footer-language">
                English
              </Link>
              <Link to="#" className="footer-language">
                हिंदी
              </Link>
              <Link to="#" className="footer-language">
                മലയാളം
              </Link>
              <Link to="#" className="footer-language">
                मराठी
              </Link>
            </div>
          </div>

          <div className="footer-content">
            <div className="footer-column">
              <h3 className="footer-heading">About OLabs</h3>
              <p className="footer-text">
                OLabs provides free virtual laboratory experiments for students
                across India. Access to OLabs is free for Schools upon
                registration.
              </p>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/workshops" className="footer-link">
                    Workshops
                  </Link>
                </li>
                <li>
                  <Link to="/download" className="footer-link">
                    Download
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Contact</h3>
              <address className="footer-address">
                <p>Amrita Vishwa Vidyapeetham</p>
                <p>CDAC Mumbai</p>
                <p>India</p>
                <p>
                  Email:{" "}
                  <a href="mailto:info@olabs.edu.in" className="footer-email">
                    info@olabs.edu.in
                  </a>
                </p>
              </address>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              © {new Date().getFullYear()} OLabs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
