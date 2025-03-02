import React from "react";

const LeadGeneration = ({ leads, filter, onFilterChange, onToggleStatus }) => {
  const filteredLeads = leads.filter(
    (lead) => filter === "all" || lead.status === (filter === "contacted")
  );

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-gray-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "new" ? "bg-blue-600 text-white" : "bg-blue-200"
          }`}
          onClick={() => onFilterChange("new")}
        >
          New
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "contacted" ? "bg-green-600 text-white" : "bg-green-200"
          }`}
          onClick={() => onFilterChange("contacted")}
        >
          Contacted
        </button>
      </div>

      {/* Lead List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="p-4 border rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold">{lead.name}</h3>
            <p className="text-gray-600">
              <strong>Email:</strong> {lead.email}
            </p>
            <p className="text-gray-600">
              <strong>Contact:</strong> {lead.contactNumber}
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {new Date(lead.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong> {lead.status ? "Contacted" : "New"}
            </p>
            <button
              className={`mt-2 px-4 py-2 rounded ${
                lead.status ? "bg-gray-400" : "bg-blue-600 text-white"
              }`}
              onClick={() => onToggleStatus(lead.id)}
            >
              {lead.status ? "Mark as New" : "Claim"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadGeneration;
