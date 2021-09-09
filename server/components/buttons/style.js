"use strict";

exports.__esModule = true;
exports.buttonStyle = void 0;
const buttonStyle = `
    .buttons-container {
        transition: all 0.3s ease-in-out;
    }

    iframe[title=pbf], iframe[title=ppfniframe] {
        display: none;
    }
    
    .paypal-button-clicked,
    .paypal-button-clicked:focus,
    .paypal-button-clicked:focus::after {
        outline: none !important;
        box-shadow: none !important;
    }
`;
exports.buttonStyle = buttonStyle;