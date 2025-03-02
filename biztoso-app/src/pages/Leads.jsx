import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, toggleLeadStatus } from "../features/leadsSlice";
import LeadGeneration from "../components/LeadGeneration";
import { Link } from "react-router-dom";

const Leads = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profiles[0]); // First profile
  const { leads, status, error } = useSelector((state) => state.leads);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "idle" && profile) {
      dispatch(fetchLeads());
    }
  }, [status, dispatch, profile]);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleLeadStatus(id));
  };

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Create a profile to look into leads.
        </h2>
        <Link to="/create-profile" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lead Generation</h2>

      {status === "loading" && <p>Loading leads...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && (
        <LeadGeneration leads={leads} filter={filter} onFilterChange={handleFilterChange} onToggleStatus={handleToggleStatus} />
      )}
    </div>
  );
};

export default Leads;
