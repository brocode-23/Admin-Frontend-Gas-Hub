import React from "react";

const TokenCard = ({ token }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!token) {
    return null; // or a loading/error state
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full">
      <div className="bg-purple-600 text-white py-4 px-6">
        <h3 className="text-xl font-semibold text-center">
          Gas Tank Request Token
        </h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="text-gray-600">Hello,</div>

        <div className="text-gray-600">
          Thank you for choosing us. Your token code:
        </div>

        <div className="bg-gray-50 p-4 text-center">
          <span className="text-3xl font-mono font-bold tracking-wider text-gray-800">
            {token.token_code}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              token.status
            )}`}
          >
            {token.status}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          Valid until:{" "}
          {token.validUntil !== "..."
            ? new Date(token.expiration_date).toLocaleDateString()
            : "..."}
        </div>
      </div>

      <div className="border-t px-6 py-4 bg-gray-50">
        <div className="text-center text-sm text-gray-500">
          © 2024 GasHub. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
