import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { authApi } from "../utils/authApi";

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log("🔹 User from Redux:", user);
    console.log("🔹 Token from Redux:", user?.token);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const token = user?.token;
    if (!token) {
      setError("Unauthorized: Token is missing. Please log in again.");
      return;
    }

    try {
      console.log("🔹 Sending Change Password Request with token:", token);

      const response = await authApi.changePassword(
        { oldPassword, newPassword },
        token
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      setSuccess("Password changed successfully!");
      setError(null);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Change Password Error:", err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mt-2"
            required
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
