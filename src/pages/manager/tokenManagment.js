import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

// TokenCard component remains the same
const TokenCard = ({ token, onView }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => onView(token)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {token.token_code}
            </h3>
            <p className="text-sm text-gray-500">{token.email}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              token.status
            )}`}
          >
            {token.status}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Name: {token.name}</p>
          <p className="text-sm text-gray-600">
            Created: {new Date(token.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Expires: {new Date(token.expiration_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// TokenDetailsModal component remains the same
const TokenDetailsModal = ({ token, onClose, onUpdate }) => {
  const [newExpirationDate, setNewExpirationDate] = useState(
    token.expiration_date?.split("T")[0]
  );
  const [newStatus, setNewStatus] = useState(token.status);

  const handleSubmit = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/token/code/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            token_code: token.token_code,
            expiration_date: newExpirationDate,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update token");

      onUpdate();
      onClose();
      alert("Token updated successfully");
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
        className="bg-white rounded-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Token Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Token Code</p>
            <p className="text-lg">{token.token_code}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg">{token.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{token.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created Date</p>
            <p className="text-lg">
              {new Date(token.created_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              value={newExpirationDate}
              onChange={(e) => setNewExpirationDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update Token
          </button>
        </div>
      </div>
    </div>
  );
};

const TokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/token/outlet/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch tokens");

      const data = await response.json();
      setTokens(data);
      setFilteredTokens(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tokens.filter((token) =>
        token.token_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokens);
    }
  }, [searchTerm, tokens]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const isExpired = (token) => {
    return new Date(token.expiration_date) < new Date();
  };

  // Modified grouping logic
  const groupedTokens = filteredTokens.reduce(
    (groups, token) => {
      // First check if the token is expired
      if (isExpired(token)) {
        groups.expired.push(token);
      } else {
        // If not expired, group by status
        switch (token.status.toLowerCase()) {
          case "pending":
            groups.pending.push(token);
            break;
          case "active":
            groups.active.push(token);
            break;
          case "cancelled":
            groups.rejected.push(token);
            break;
          default:
            break;
        }
      }
      return groups;
    },
    {
      pending: [],
      active: [],
      rejected: [],
      expired: [],
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Token Management</h1>
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search by token code..."
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

        {Object.entries(groupedTokens).map(([status, tokens]) => (
          <div key={status} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
              {status} Tokens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onView={setSelectedToken}
                />
              ))}
            </div>
            {tokens.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No {status} tokens found.
              </div>
            )}
          </div>
        ))}

        {selectedToken && (
          <TokenDetailsModal
            token={selectedToken}
            onClose={() => setSelectedToken(null)}
            onUpdate={fetchTokens}
          />
        )}
      </div>
    </div>
  );
};

export default TokenManagement;
