import "../styles/HeaderFooter.css";
import React from 'react';

function Footer() {
    return (
        <footer style={{
            zIndex:'0'
        }}>
            <div className="menu footer">
                <div className="copyright">
                    <p>2025 Fitchck All Rights Reserved</p>
                </div>
                <a 
                    href="https://github.com/dwu006/fashionapp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="button"
                    id="github" 
                    style={{marginRight: '10px', textDecoration: 'none'}}
                >
                    GitHub
                </a>
            </div>
        </footer>
    )
}

export default Footer;