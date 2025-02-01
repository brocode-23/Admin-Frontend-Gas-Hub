import React, { useState, useEffect } from "react";

const BusinessRequestCard = ({ request, onStatusUpdate, onImageClick }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {request.business_name}
        </h3>
        <p className="text-sm text-gray-500">{request.email}</p>
      </div>
      <div className="mb-4">
        <img
          src={`data:image/jpeg;base64,${btoa(
            request.business_certificate_image
          )}`}
          alt="Business Certificate"
          className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onImageClick(request.business_certificate_image)}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onStatusUpdate(request.email, "approved")}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => onStatusUpdate(request.email, "rejected")}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
);

const ImagePreviewModal = ({ image, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <img
        src={`data:image/jpeg;base64,${btoa(image)}`}
        alt="Business Certificate Preview"
        className="w-full h-auto"
      />
    </div>
  </div>
);

const BusinessRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusinessRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/business-request/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch business requests");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Modified data extraction logic
      if (data && data.businessRequests) {
        setRequests(data.businessRequests);
      } else if (data && data.requests) {
        setRequests(data.requests);
      } else if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.warn("Unexpected data structure:", data);
        setRequests([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (email, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/business-request/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      alert(`Request ${status} successfully`);
      fetchBusinessRequests();
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchBusinessRequests();
  }, []);

  useEffect(() => {
    console.log("Current requests state:", requests);
  }, [requests]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Requests</h1>
        <p className="text-gray-600 mt-2">
          {Array.isArray(requests) ? requests.length : 0} pending requests
        </p>
      </div>

      {!Array.isArray(requests) || requests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pending business requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <BusinessRequestCard
              key={request.email}
              request={request}
              onStatusUpdate={handleStatusUpdate}
              onImageClick={setSelectedImage}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <ImagePreviewModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default BusinessRequests;
