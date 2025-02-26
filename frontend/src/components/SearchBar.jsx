import React from "react";

const SearchBar = ({ value, onChange, placeholder = "Search posts..." }) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="input input-bordered w-full"
        />
    );
};

export default SearchBar;
