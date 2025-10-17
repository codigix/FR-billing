import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const BookingFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState([]);

  const [formData, setFormData] = useState({
    booking_number: "",
    consignment_number: "",
    booking_date: new Date().toISOString().split("T")[0],

    // Sender details
    sender_name: "",
    sender_phone: "",
    sender_address: "",
    sender_pincode: "",
    sender_city: "",
    sender_state: "",

    // Receiver details
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    receiver_pincode: "",
    receiver_city: "",
    receiver_state: "",

    // Package details
    service_type: "Surface",
    weight: 0,
    pieces: 1,
    content_description: "",
    declared_value: 0,

    // Billing details
    freight_charge: 0,
    fuel_surcharge: 0,
    gst_amount: 0,
    other_charges: 0,
    total_amount: 0,

    // Payment details
    payment_mode: "cash",
    payment_status: "unpaid",
    paid_amount: 0,

    remarks: "",
  });

  useEffect(() => {
    fetchRates();
    generateBookingNumber();
  }, []);

  useEffect(() => {
    calculateCharges();
  }, [
    formData.weight,
    formData.service_type,
    formData.sender_pincode,
    formData.receiver_pincode,
    formData.freight_charge,
    formData.fuel_surcharge,
    formData.other_charges,
  ]);

  const fetchRates = async () => {
    try {
      const response = await api.get("/rates");
      if (response.data.success) {
        setRates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const generateBookingNumber = async () => {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const bookingNum = `BK${timestamp}${random}`;
      const consignmentNum = `CN${timestamp}${random}`;

      setFormData((prev) => ({
        ...prev,
        booking_number: bookingNum,
        consignment_number: consignmentNum,
      }));
    } catch (error) {
      console.error("Error generating booking number:", error);
    }
  };

  const calculateCharges = () => {
    const weight = parseFloat(formData.weight) || 0;
    const freightCharge = parseFloat(formData.freight_charge) || 0;
    const fuelSurcharge = parseFloat(formData.fuel_surcharge) || 0;
    const otherCharges = parseFloat(formData.other_charges) || 0;

    const subtotal = freightCharge + fuelSurcharge + otherCharges;
    const gstAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + gstAmount;

    setFormData((prev) => ({
      ...prev,
      gst_amount: gstAmount.toFixed(2),
      total_amount: totalAmount.toFixed(2),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/bookings", formData);
      alert("Booking created successfully");
      navigate("/bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Consignment/Booking</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          {/* Booking Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Booking Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Booking Number
                </label>
                <input
                  type="text"
                  name="booking_number"
                  value={formData.booking_number}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Consignment Number
                </label>
                <input
                  type="text"
                  name="consignment_number"
                  value={formData.consignment_number}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Booking Date
                </label>
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Sender Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Sender Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sender Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sender Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Sender Address
                </label>
                <textarea
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sender_pincode"
                  value={formData.sender_pincode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="sender_city"
                  value={formData.sender_city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="sender_state"
                  value={formData.sender_state}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Receiver Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Receiver Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Receiver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="receiver_name"
                  value={formData.receiver_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Receiver Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="receiver_phone"
                  value={formData.receiver_phone}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Receiver Address
                </label>
                <textarea
                  name="receiver_address"
                  value={formData.receiver_address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="receiver_pincode"
                  value={formData.receiver_pincode}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="receiver_city"
                  value={formData.receiver_city}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  name="receiver_state"
                  value={formData.receiver_state}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Package Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Surface">Surface</option>
                  <option value="Air">Air</option>
                  <option value="Express">Express</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pieces</label>
                <input
                  type="number"
                  name="pieces"
                  value={formData.pieces}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Content Description
                </label>
                <input
                  type="text"
                  name="content_description"
                  value={formData.content_description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Declared Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="declared_value"
                  value={formData.declared_value}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Freight Charge <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="freight_charge"
                  value={formData.freight_charge}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Fuel Surcharge
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="fuel_surcharge"
                  value={formData.fuel_surcharge}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Other Charges
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="other_charges"
                  value={formData.other_charges}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GST Amount (18%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="gst_amount"
                  value={formData.gst_amount}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-lg">
                  Total Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="total_amount"
                  value={formData.total_amount}
                  readOnly
                  className="w-full border-2 rounded px-3 py-2 bg-gray-50 text-lg font-bold"
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">
              Payment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Mode
                </label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="card">Card</option>
                  <option value="to_pay">To Pay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Paid Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormPage;
