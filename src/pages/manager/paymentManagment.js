import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const PaymentManagement = () => {
  // States for new payment
  const [tokenCode, setTokenCode] = useState("");
  const [tokenDetails, setTokenDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // States for payment list
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // States for update dialog
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({
    price: "",
    paidAt: "",
    paymentMethod: "",
  });

  // Fetch token details
  const fetchTokenDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/token/total-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            token_code: tokenCode,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setTokenDetails(data);

        console.log(data);
        // Calculate total based on amount and any additional fees or taxes
        const calculatedTotal = parseFloat(data.totalPrice) || 0;
        setTotal(calculatedTotal);
      } else {
        throw new Error("Failed to fetch token details");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch token details");
      setTokenDetails(null);
      setTotal(0);
    }
    setIsLoading(false);
  };

  // Create new payment
  const handleCreatePayment = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/payment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          token_code: tokenCode,
          amount: total, // Use the total instead of tokenDetails.amount
          payment_method: paymentMethod,
          status: "Completed",
        }),
      });

      if (response.ok) {
        alert("Payment created successfully");
        fetchPayments();
        resetForm();
      }
    } catch (error) {
      alert("Failed to create payment");
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/payment/outlet/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("Fetched payments:", data);
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch payments");
    }
  };

  // Update payment
  const handleUpdatePayment = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/payment/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          token_code: selectedPayment.token_code,
          price: updatedDetails.price,
          paid_at: updatedDetails.paidAt,
          payment_method: updatedDetails.paymentMethod,
        }),
      });

      if (response.ok) {
        alert("Payment updated successfully");
        setIsUpdateDialogOpen(false);
        fetchPayments();
      }
    } catch (error) {
      alert("Failed to update payment");
    }
  };

  useEffect(() => {
    console.log("Fetching payments..."); // Add this line
    fetchPayments();
  }, []); // Add this useEffect to fetch data when component mounts

  useEffect(() => {
    console.log("Current payments:", payments);
    const filtered = payments.filter((payment) => {
      // Handle potentially undefined values with optional chaining
      return (
        payment?.token_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    console.log("Filtered payments:", filtered);
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  // Reset form after payment
  const resetForm = () => {
    setTokenCode("");
    setTokenDetails(null);
    setPaymentMethod("");
    setTotal(0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* New Payment Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Create New Payment</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Token Code"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={fetchTokenDetails}
            disabled={!tokenCode || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Enter
          </button>
        </div>

        {tokenDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">
                  Status: {tokenDetails.status}
                </p>
                <p className="text-sm font-medium">
                  Expiration:{" "}
                  {new Date(tokenDetails.expirationDate).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">
                  Pickup Date:{" "}
                  {new Date(
                    tokenDetails.expectedPickupDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">User: {tokenDetails.name}</p>
                <p className="text-sm font-medium">
                  Phone: {tokenDetails.phone}
                </p>
                <p className="text-sm font-medium">
                  Email: {tokenDetails.email}
                </p>
              </div>
            </div>

            {/* New Total Field */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Amount:</p>
                <p className="text-lg font-bold">LKR{tokenDetails.amount}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium">Total to Pay:</p>
                <p className="text-xl font-bold text-blue-600">LKR {total}</p>
              </div>
            </div>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!tokenDetails}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>

            <button
              onClick={handleCreatePayment}
              disabled={!tokenDetails || !paymentMethod}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Pay LKR {total}
            </button>
          </div>
        )}
      </div>

      {/* Payment List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Payment History</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[calc(100vh-300px)] overflow-y-auto p-2">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden"
              onClick={() => {
                setSelectedPayment(payment);
                setIsUpdateDialogOpen(true);
                setUpdatedDetails({
                  price: payment.amount,
                  paidAt: payment.paid_at,
                  paymentMethod: payment.payment_method,
                });
              }}
            >
              {/* Status Header */}
              <div
                className={`px-4 py-2 ${
                  payment.status === "Completed"
                    ? "bg-green-50"
                    : "bg-yellow-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{payment.token_code}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-4 space-y-3">
                {/* User Info */}
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {payment.user_name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.user_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {payment.user_email}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Amount</span>
                    <span className="font-semibold text-green-600">
                      LKR {payment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      Payment Method
                    </span>
                    <div className="flex items-center space-x-1">
                      {payment.payment_method === "Credit Card" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path
                            fillRule="evenodd"
                            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {payment.payment_method}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Date</span>
                    <span className="text-sm text-gray-700">
                      {new Date(payment.paid_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
                <span>ID: {payment.id.slice(0, 8)}...</span>
                <span>{payment.request_type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Payment Dialog */}
      {isUpdateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Payment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong>Token Code:</strong> {selectedPayment?.token_code}
                </p>
                <p>
                  <strong>User:</strong> {selectedPayment?.user_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPayment?.user_email}
                </p>
                <p>
                  <strong>Status:</strong> {selectedPayment?.status}
                </p>
              </div>

              <input
                type="number"
                placeholder="Price"
                value={updatedDetails.price}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    price: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="datetime-local"
                value={updatedDetails.paidAt}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    paidAt: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />

              <select
                value={updatedDetails.paymentMethod}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>

              {selectedPayment?.gasTanks && (
                <div className="max-h-40 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Type</th>
                        <th className="text-right">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPayment.gasTanks.map((tank, index) => (
                        <tr key={index}>
                          <td>{tank.type}</td>
                          <td className="text-right">{tank.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleUpdatePayment}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update Payment
                </button>
                <button
                  onClick={() => setIsUpdateDialogOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
