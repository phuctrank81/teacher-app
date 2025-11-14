import React from 'react'
import '../App.css'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo + mô tả */}
        <div className="footer-section">
          <h2 className="footer-logo">Trang Trần</h2>
          <p className="footer-text">Liên hệ Phúc Trần</p>
          <p className="footer-phone">📞 +012 (345) 678 99</p>
          <p>polychrome9x@gmail.com</p>
        </div>

        {/* Follow us */}
        <div className="footer-section follow-section">
          <span className="title">Theo dõi chúng tôi</span>

          <div className="follow-icons">
            <a href="#" className="icon"><i className="fab fa-facebook"></i></a>
            <a href="#" className="icon"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="icon"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Resources */}
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li>Our Products</li>
            <li>User Flow</li>
            <li>User Strategy</li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-section">
          <h4>NextCloud</h4>
          <ul>
            <li>About Phúc Trần</li>
            <li>Contact & Support</li>
            <li>Success History</li>
            <li>Setting & Privacy</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Premium Support</li>
            <li>Our Services</li>
            <li>Know Our Team</li>
            <li>Download App</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Phúc Trần</p>
      </div>
    </footer>
  )
}
