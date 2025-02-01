import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartContext";

const CartPage = () => {
  const { cart, removeItem, updateQuantity, clearCart } =
    useContext(CartContext);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/outlets/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch outlets");
        }
        const data = await response.json();
        setOutlets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutlets();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!email) {
      setNotification({
        show: true,
        message: "Email is required",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Transform cart items to tank_details format
    const tankDetails = cart.map((item) => ({
      tank_type: item.name.replace(/\s*Gas.*/, ""),
      quantity: item.quantity,
    }));

    const requestData = {
      user_mail: "anonymous",
      to_mail: email,
      outlet_id: selectedOutlet.id,
      tank_details: tankDetails,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/requests/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        throw new Error(errorData.error || "Failed to submit request");
      }

      setNotification({
        show: true,
        message: "Request submitted successfully!",
        type: "success",
      });
      clearCart();
      setIsModalOpen(false);
      setEmail("");
    } catch (err) {
      setNotification({
        show: true,
        message: err.message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this JSX right before the closing </div> of your component
  const modalAndNotification = (
    <>
      {/* Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Enter Email Address</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </>
  );

  // Modify the existing "Proceed to Checkout" button to use the new handler
  const checkoutButton = (
    <button
      className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!selectedOutlet}
      onClick={handleCheckout}
    >
      {selectedOutlet ? "Proceed to Checkout" : "Select an outlet to continue"}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl text-purple-600">🛒</span>
          <h2 className="text-3xl font-bold text-gray-800">Your Cart</h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl text-gray-400">🛒</span>
            <p className="text-xl text-gray-500 mt-4">Your cart is empty.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <span className="font-medium text-gray-800">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        LKR {item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-100 text-purple-600 transition-colors disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-100 text-purple-600 transition-colors"
                            onClick={() =>
                              updateQuantity(item, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => removeItem(item)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 border-t pt-8">
              <div className="flex justify-end">
                <div className="bg-gray-50 p-6 rounded-lg w-96">
                  <div className="flex justify-between gap-16 mb-6">
                    <span className="text-lg font-semibold text-gray-600">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-purple-600">
                      LKR {calculateTotal().toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="outlet-select"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Pickup Location
                    </label>
                    {loading ? (
                      <div className="w-full p-3 text-gray-500">
                        Loading outlets...
                      </div>
                    ) : error ? (
                      <div className="w-full p-3 text-red-500">{error}</div>
                    ) : (
                      <select
                        id="outlet-select"
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        value={selectedOutlet?.id || ""}
                        onChange={(e) => {
                          const outlet = outlets.find(
                            (o) => o.id === e.target.value
                          );
                          setSelectedOutlet(outlet);
                        }}
                      >
                        <option value="">Choose an outlet</option>
                        {outlets.map((outlet) => (
                          <option key={outlet.id} value={outlet.id}>
                            {outlet.name} - {outlet.location}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedOutlet}
                    onClick={handleCheckout}
                  >
                    {selectedOutlet
                      ? "Proceed to Checkout"
                      : "Select an outlet to continue"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        {modalAndNotification}
      </div>
    </div>
  );
};

export default CartPage;
