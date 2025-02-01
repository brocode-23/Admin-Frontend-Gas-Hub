import React, { useState, useEffect, useCallback, memo } from "react";
import { useAdmin } from "../../context/adminContext";
import ManagerCard from "../../components/admin/managerCard";

// Memoized Modal component
const Modal = memo(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

// Memoized form components
const EditManagerForm = memo(
  ({ formData, handleInputChange, handleUpdateManager, onPasswordClick }) => {
    return (
      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={formData.editManager.name}
          onChange={(e) =>
            handleInputChange("editManager", "name", e.target.value)
          }
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          value={formData.editManager.email}
          onChange={(e) =>
            handleInputChange("editManager", "email", e.target.value)
          }
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Phone"
          value={formData.editManager.phone}
          onChange={(e) =>
            handleInputChange("editManager", "phone", e.target.value)
          }
        />
        <div className="flex justify-between">
          <button
            onClick={handleUpdateManager}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button
            onClick={onPasswordClick}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset Password
          </button>
        </div>
      </div>
    );
  }
);

EditManagerForm.displayName = "EditManagerForm";

const AddManagerForm = memo(
  ({ formData, handleInputChange, handleAddManager }) => {
    return (
      <form onSubmit={handleAddManager} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={formData.newManager.name}
          onChange={(e) =>
            handleInputChange("newManager", "name", e.target.value)
          }
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Email"
          type="email"
          value={formData.newManager.email}
          onChange={(e) =>
            handleInputChange("newManager", "email", e.target.value)
          }
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Phone"
          value={formData.newManager.phone}
          onChange={(e) =>
            handleInputChange("newManager", "phone", e.target.value)
          }
          required
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Password"
          type="password"
          value={formData.newManager.password}
          onChange={(e) =>
            handleInputChange("newManager", "password", e.target.value)
          }
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Manager
        </button>
      </form>
    );
  }
);

AddManagerForm.displayName = "AddManagerForm";

const ManagerManagement = () => {
  const { outlets, addManager, updateOutletManager } = useAdmin();
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    newManager: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    editManager: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchManagers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/api/user/managers", {
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setManagers(data);
      } else if (data.managers && Array.isArray(data.managers)) {
        setManagers(data.managers);
      } else if (data.data && Array.isArray(data.data)) {
        setManagers(data.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      setError("Failed to fetch managers");
      setManagers([]);
      alert("Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleInputChange = useCallback((formType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: value,
      },
    }));
  }, []);

  const handleAddManager = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("http://localhost:3000/api/user/signup", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...formData.newManager,
            role: "Manager",
            customer_type: "Premium",
          }),
        });

        if (response.ok) {
          alert("Manager added successfully");
          setIsAddOpen(false);
          setFormData((prev) => ({
            ...prev,
            newManager: { name: "", email: "", phone: "", password: "" },
          }));
          fetchManagers();
        } else {
          throw new Error("Failed to add manager");
        }
      } catch (error) {
        alert("Failed to add manager");
      }
    },
    [formData.newManager, getAuthHeaders, fetchManagers]
  );

  const handleUpdateManager = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/update", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: selectedManager.id,
          ...formData.editManager,
        }),
      });

      if (response.ok) {
        alert("Manager updated successfully");
        setIsEditOpen(false);
        fetchManagers();
      } else {
        throw new Error("Failed to update manager");
      }
    } catch (error) {
      alert("Failed to update manager");
    }
  }, [formData.editManager, selectedManager, getAuthHeaders, fetchManagers]);

  const handleForgotPassword = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user/forgot-password",
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            userId: selectedManager.id,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password updated successfully");
        setIsPasswordOpen(false);
        setNewPassword("");
      } else {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      alert("Failed to update password");
    }
  }, [selectedManager, newPassword, getAuthHeaders]);

  if (loading) {
    return <div className="p-6">Loading managers...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
        <button
          onClick={fetchManagers}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manager Management</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(managers) &&
          managers.map((manager) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onClick={() => {
                setSelectedManager(manager);
                setFormData((prev) => ({
                  ...prev,
                  editManager: {
                    name: manager.name,
                    email: manager.email,
                    phone: manager.phone,
                  },
                }));
                setIsEditOpen(true);
              }}
            />
          ))}
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Manager"
      >
        <EditManagerForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleUpdateManager={handleUpdateManager}
          onPasswordClick={() => setIsPasswordOpen(true)}
        />
      </Modal>

      <Modal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        title="Reset Password"
      >
        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleForgotPassword}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Password
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Manager"
      >
        <AddManagerForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleAddManager={handleAddManager}
        />
      </Modal>
    </div>
  );
};

export default ManagerManagement;
