import React from "react";

export const Checkbox = ({ type = "checkbox", name, checked = false, onChange }) => {
    // console.log("Checkbox: ", name, checked);
    return (
        <input type={type} id={name} name={name} checked={checked} onChange={onChange} className="checkbox" />
    );
};
