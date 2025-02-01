import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const RequestCard = ({ request, onView }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onView(request)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {request.User.name}
            </h3>
            <p className="text-sm text-gray-500">{request.User.email}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {request.status}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Type: {request.type}</p>
          <p className="text-sm text-gray-600">
            Customer Type: {request.User.customer_type}
          </p>
          <p className="text-sm text-gray-600">
            Requested: {new Date(request.requested_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const RequestDetailsModal = ({ request, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(request.status);

  const handleSubmit = async () => {
    console.log('updating ...');
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/requests/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id: request.id,
            toemail: request.toemail,
            token_id: request.token_id,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update request");

      onUpdate();
      onClose();
      alert("Request updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Name</p>
              <p className="text-lg">{request.User.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Customer Email
              </p>
              <p className="text-lg">{request.User.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer Type</p>
              <p className="text-lg">{request.User.customer_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Request Type</p>
              <p className="text-lg">{request.type}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Requested Tanks</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tank Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.RequestTankDetails.map((tank) => (
                    <tr key={tank.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tank.tank_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tank.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Request
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/requests/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch requests");

      const result = await response.json();
      setRequests(result.data);
      setFilteredRequests(result.data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = requests.filter(
        (request) =>
          request.User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.User.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [searchTerm, requests]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Group requests by status
  const groupedRequests = filteredRequests.reduce(
    (groups, request) => {
      const status = request.status.toLowerCase();
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(request);
      return groups;
    },
    { pending: [], approved: [], rejected: [] }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="sticky top-0 bg-white z-10 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Request Management
          </h1>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pr-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
              <Search size={20} className="text-gray-400" />
            </div>
          </div>
        </div>

        {Object.entries(groupedRequests).map(([status, requests]) => (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
              {status} Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onView={setSelectedRequest}
                />
              ))}
            </div>
            {requests.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No {status} requests found.
              </div>
            )}
          </div>
        ))}

        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onUpdate={fetchRequests}
          />
        )}
      </div>
    </div>
  );
};

export default RequestManagement;
