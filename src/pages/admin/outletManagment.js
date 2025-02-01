import React, { useState, useEffect } from "react";
import axios from "axios";

const OutletManagement = () => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedOutlet, setEditedOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: "",
    location: "",
    email: "",
    stocks: [
      { tank_type: "12.5kg", quantity: 0 },
      { tank_type: "5kg", quantity: 0 },
      { tank_type: "2.3kg", quantity: 0 },
    ],
  });

  // Fetch outlets data
  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/outlets/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOutlets(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch outlets");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const handleAddOutlet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/outlets/add",
        {
          name: newOutlet.name,
          location: newOutlet.location,
          email: newOutlet.email,
          stock_level: newOutlet.stocks.reduce(
            (total, stock) => total + stock.quantity,
            0
          ),
          stocks: newOutlet.stocks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchOutlets();
      setShowAddForm(false);
      setNewOutlet({
        name: "",
        location: "",
        email: "",
        stocks: [
          { tank_type: "12.5kg", quantity: 0 },
          { tank_type: "5kg", quantity: 0 },
          { tank_type: "2.3kg", quantity: 0 },
        ],
      });
    } catch (err) {
      setError("Failed to add outlet");
    }
  };

  const handleDeleteOutlet = async (outletId) => {
    if (window.confirm("Are you sure you want to delete this outlet?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/outlets/${outletId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchOutlets();
        setSelectedOutlet(null);
      } catch (err) {
        setError("Failed to delete outlet");
      }
    }
  };

  const handleUpdateOutlet = async (outletData) => {
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        id: outletData.id,
        name: outletData.name,
        location: outletData.location,
        email: outletData.User.email,
        stock_level: outletData.OutletStocks.reduce(
          (total, stock) => total + stock.quantity,
          0
        ),
        stocks: outletData.OutletStocks.map((stock) => ({
          tank_type: stock.tank_type,
          quantity: stock.quantity,
        })),
      };

      console.log(updateData);

      await axios.put(`http://localhost:3000/api/outlets/update`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchOutlets();
      setIsEditMode(false);
      setSelectedOutlet(null);
    } catch (err) {
      setError("Failed to update outlet");
    }
  };

  const calculateTotalStock = (stocks) => {
    return stocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Outlet Management
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Outlet
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map((outlet) => (
              <div
                key={outlet.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {outlet.name}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Total Stock: {calculateTotalStock(outlet.OutletStocks)}
                    </span>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="mr-2">📍</span> {outlet.location}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">👤</span> {outlet.User.name}
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">📧</span> {outlet.User.email}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedOutlet(outlet);
                        setEditedOutlet(outlet);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View/Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOutlet(outlet.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Outlet Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add New Outlet
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddOutlet} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outlet Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newOutlet.name}
                      onChange={(e) =>
                        setNewOutlet({ ...newOutlet, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newOutlet.location}
                      onChange={(e) =>
                        setNewOutlet({ ...newOutlet, location: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager Email
                    </label>
                    <input
                      type="email"
                      required
                      value={newOutlet.email}
                      onChange={(e) =>
                        setNewOutlet({ ...newOutlet, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Levels
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {newOutlet.stocks.map((stock, index) => (
                        <div
                          key={stock.tank_type}
                          className="flex items-center space-x-4"
                        >
                          <span className="w-20 text-sm">
                            {stock.tank_type}:
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={stock.quantity}
                            onChange={(e) => {
                              const newStocks = [...newOutlet.stocks];
                              newStocks[index].quantity =
                                parseInt(e.target.value) || 0;
                              setNewOutlet({ ...newOutlet, stocks: newStocks });
                            }}
                            className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Add Outlet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Detail/Edit Modal */}
        {selectedOutlet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? "Edit Outlet" : "Outlet Details"}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedOutlet(null);
                      setIsEditMode(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {isEditMode ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateOutlet(editedOutlet);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editedOutlet.name}
                        onChange={(e) =>
                          setEditedOutlet({
                            ...editedOutlet,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editedOutlet.location}
                        onChange={(e) =>
                          setEditedOutlet({
                            ...editedOutlet,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Manager Email
                      </label>
                      <input
                        type="email"
                        value={editedOutlet.User.email}
                        onChange={(e) =>
                          setEditedOutlet({
                            ...editedOutlet,
                            User: {
                              ...editedOutlet.User,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Levels
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {editedOutlet.OutletStocks.map((stock, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 mb-2"
                          >
                            <span className="w-20">{stock.tank_type}:</span>
                            <input
                              type="number"
                              value={stock.quantity}
                              onChange={(e) => {
                                const newStocks = [
                                  ...editedOutlet.OutletStocks,
                                ];
                                newStocks[index].quantity =
                                  parseInt(e.target.value) || 0;
                                setEditedOutlet({
                                  ...editedOutlet,
                                  OutletStocks: newStocks,
                                });
                              }}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Name
                        </h3>
                        <p className="mt-1 text-lg">{selectedOutlet.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Location
                        </h3>
                        <p className="mt-1 text-lg">
                          {selectedOutlet.location}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Manager
                        </h3>
                        <p className="mt-1 text-lg">
                          {selectedOutlet.User.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <p className="mt-1 text-lg">
                          {selectedOutlet.User.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Stock Levels
                      </h3>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Tank Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOutlet.OutletStocks.map((stock, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {stock.tank_type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {stock.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit Outlet
                      </button>
                      <button
                        onClick={() => handleDeleteOutlet(selectedOutlet.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete Outlet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletManagement;
