import React, { useState } from "react";

const FilterBar = ({ onFilterChange }) => {
    const [sortField, setSortField] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const handleFilterChange = () => {
        onFilterChange({ sortField, sortOrder });
    };

    return (
        <div className="flex items-center space-x-4 mb-6">
            <select
                className="select select-bordered"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
            >
                <option value="created_at">Date Created</option>
                <option value="total_likes">Most Liked</option>
                <option value="total_comments">Most Commented</option>
            </select>

            <select
                className="select select-bordered"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>

            <button className="btn btn-primary" onClick={handleFilterChange}>
                Apply
            </button>
        </div>
    );
};

export default FilterBar;
