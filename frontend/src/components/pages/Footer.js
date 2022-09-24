import React from 'react';
import '../../styles.css'

import {FaCopyright, FaFacebookSquare, FaInstagramSquare} from 'react-icons/fa'
const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-item">
                <a href="https://www.facebook.com/groups/123384061073912"
                rel="noreferrer"
                className="social-icon"
                target="_blank">
                    <FaFacebookSquare/>
                </a>
                <a href="https://www.instagram.com/"
                rel="noreferrer"
                className="social-icon"
                target="_blank">
                    <FaInstagramSquare/>
                </a>
            </div>
            <div className="footer-item">
                <FaCopyright/> 2021 Jiye Choi
            </div>
        </div>    
    );
};

export default Footer