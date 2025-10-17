import { useState, useEffect } from "react";
import axios from "axios";

export default function PrintReceiptPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Top section
    consignment_no: "",
    date: new Date().toISOString().split("T")[0],
    destination: "",

    // Sender Details
    sender_phone: "",
    sender_name: "",
    sender_address: "",
    sender_state: "",
    sender_email: "",
    sender_company: "",
    sender_city: "",
    sender_pincode: "",

    // Recipient's Details
    receiver_phone: "",
    receiver_name: "",
    receiver_address: "",
    receiver_state: "",
    receiver_email: "",
    receiver_company: "",
    receiver_city: "",
    receiver_pincode: "",

    // Shipment Type
    shipment_type: "Dox",
    shipment_sub_type: "Non Dox",
    qty: "",
    total: "",
    aw: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    pcs: "",
    divide_by: "3000",
    vol_weight: "",

    // Description of Content
    description1: "",
    description2: "",
    description3: "",
    total_value: "",

    // Value Of Goods
    amount1: "",
    amount2: "",
    amount3: "",

    // Charges
    amount: "",
    service_charge: "",
    risk_surcharge: "",
    gst: "",
    discount: "0",
    additional_charge_type: "",
    additional_charge: "",
    total_amount: "",

    // Mode Of Payment
    payment_mode: "Cash",
    paid_amount: "",
    balance_amount: "0",

    // Services
    service_selected: [],
  });

  // Auto-calculate volumetric weight
  useEffect(() => {
    const { length, breadth, height, divide_by } = formData;
    if (length && breadth && height && divide_by) {
      const volWt = (
        (parseFloat(length) * parseFloat(breadth) * parseFloat(height)) /
        parseFloat(divide_by)
      ).toFixed(2);
      setFormData((prev) => ({ ...prev, vol_weight: volWt }));
    }
  }, [formData.length, formData.breadth, formData.height, formData.divide_by]);

  // Auto-calculate balance amount
  useEffect(() => {
    const total = parseFloat(formData.total_amount) || 0;
    const paid = parseFloat(formData.paid_amount) || 0;
    const balance = (total - paid).toFixed(2);
    setFormData((prev) => ({ ...prev, balance_amount: balance }));
  }, [formData.total_amount, formData.paid_amount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const services = prev.service_selected.includes(service)
        ? prev.service_selected.filter((s) => s !== service)
        : [...prev.service_selected, service];
      return { ...prev, service_selected: services };
    });
  };

  const handleSaveAndPrint = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/cashcounter/create-booking",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Booking created successfully! Opening print dialog...");
        window.print();
        handleClear();
      }
    } catch (error) {
      console.error("Create booking error:", error);
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/cashcounter/create-booking",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Booking created successfully!");
        handleClear();
      }
    } catch (error) {
      console.error("Create booking error:", error);
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      consignment_no: "",
      date: new Date().toISOString().split("T")[0],
      destination: "",
      sender_phone: "",
      sender_name: "",
      sender_address: "",
      sender_state: "",
      sender_email: "",
      sender_company: "",
      sender_city: "",
      sender_pincode: "",
      receiver_phone: "",
      receiver_name: "",
      receiver_address: "",
      receiver_state: "",
      receiver_email: "",
      receiver_company: "",
      receiver_city: "",
      receiver_pincode: "",
      shipment_type: "Dox",
      shipment_sub_type: "Non Dox",
      qty: "",
      total: "",
      aw: "",
      weight: "",
      length: "",
      breadth: "",
      height: "",
      pcs: "",
      divide_by: "3000",
      vol_weight: "",
      description1: "",
      description2: "",
      description3: "",
      total_value: "",
      amount1: "",
      amount2: "",
      amount3: "",
      amount: "",
      service_charge: "",
      risk_surcharge: "",
      gst: "",
      discount: "0",
      additional_charge_type: "",
      additional_charge: "",
      total_amount: "",
      payment_mode: "Cash",
      paid_amount: "",
      balance_amount: "0",
      service_selected: [],
    });
  };

  const services = [
    { name: "Lite", color: "bg-slate-100" },
    { name: "Non Dox Air", color: "bg-slate-100" },
    { name: "Non Dox Surface", color: "bg-slate-100" },
    { name: "DTDC Plus", color: "bg-red-500 text-white" },
    { name: "DTDC Blue", color: "bg-blue-500 text-white" },
    { name: "DTDC Green", color: "bg-green-500 text-white" },
    { name: "PTP 10.30 AM", color: "bg-purple-700 text-white" },
    { name: "PTP 12.00 PM", color: "bg-purple-700 text-white" },
    { name: "PTP 2.00 PM", color: "bg-purple-700 text-white" },
    { name: "Sunday PTP", color: "bg-purple-700 text-white" },
    { name: "Other", color: "bg-pink-200" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Print Receipt</h1>
      </div>

      {/* Top Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Consignment No
            </label>
            <input
              type="text"
              name="consignment_no"
              value={formData.consignment_no}
              onChange={handleInputChange}
              placeholder="Consignment No"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              placeholder="Destination"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Sender Details */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
            Sender Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ph No
              </label>
              <input
                type="text"
                name="sender_phone"
                value={formData.sender_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="sender_email"
                value={formData.sender_email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sender
              </label>
              <input
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleInputChange}
                placeholder="Sender Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="sender_company"
                value={formData.sender_company}
                onChange={handleInputChange}
                placeholder="Company"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                name="sender_address"
                value={formData.sender_address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="sender_city"
                value={formData.sender_city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="sender_state"
                value={formData.sender_state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="sender_pincode"
                value={formData.sender_pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Recipient's Details */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
            Recipient&apos;s Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ph No
              </label>
              <input
                type="text"
                name="receiver_phone"
                value={formData.receiver_phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="receiver_email"
                value={formData.receiver_email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recipient
              </label>
              <input
                type="text"
                name="receiver_name"
                value={formData.receiver_name}
                onChange={handleInputChange}
                placeholder="Recipient's Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="receiver_company"
                value={formData.receiver_company}
                onChange={handleInputChange}
                placeholder="Company"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                name="receiver_address"
                value={formData.receiver_address}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="receiver_city"
                value={formData.receiver_city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="receiver_state"
                value={formData.receiver_state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="receiver_pincode"
                value={formData.receiver_pincode}
                onChange={handleInputChange}
                placeholder="Pincode"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Shipment Type */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
            Shipment Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shipment_type"
                    value="Dox"
                    checked={formData.shipment_type === "Dox"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Dox</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shipment_type"
                    value="Air"
                    checked={formData.shipment_type === "Air"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Air</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shipment_type"
                    value="International"
                    checked={formData.shipment_type === "International"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">International</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                &nbsp;
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shipment_sub_type"
                    value="Non Dox"
                    checked={formData.shipment_sub_type === "Non Dox"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Non Dox</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shipment_sub_type"
                    value="Surface"
                    checked={formData.shipment_sub_type === "Surface"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Surface</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                QTY
              </label>
              <input
                type="text"
                name="qty"
                value={formData.qty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              />
              <label className="block text-sm font-medium text-slate-700 mb-2">
                A.W
              </label>
              <input
                type="text"
                name="aw"
                value={formData.aw}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total
              </label>
              <input
                type="text"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2"
              />
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Weight"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                L
              </label>
              <input
                type="text"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                B
              </label>
              <input
                type="text"
                name="breadth"
                value={formData.breadth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                H
              </label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pcs
              </label>
              <input
                type="text"
                name="pcs"
                value={formData.pcs}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Devide By
              </label>
              <input
                type="text"
                name="divide_by"
                value={formData.divide_by}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                V.Wt
              </label>
              <input
                type="text"
                name="vol_weight"
                value={formData.vol_weight}
                readOnly
                placeholder="Vol. Weight"
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Description of Content & Value Of Goods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
              Description of Content
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                name="description1"
                value={formData.description1}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="description2"
                value={formData.description2}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="description3"
                value={formData.description3}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="total_value"
                value={formData.total_value}
                onChange={handleInputChange}
                placeholder="Total Value of Goods"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
              Value Of Goods
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                name="amount1"
                value={formData.amount1}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="amount2"
                value={formData.amount2}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="amount3"
                value={formData.amount3}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                placeholder="Total"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Charges, Payment, Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charges */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
            Charges
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Charge
              </label>
              <input
                type="text"
                name="service_charge"
                value={formData.service_charge}
                onChange={handleInputChange}
                placeholder="Charge"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Risk Surcharge
              </label>
              <input
                type="text"
                name="risk_surcharge"
                value={formData.risk_surcharge}
                onChange={handleInputChange}
                placeholder="Risk"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GST
              </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                placeholder="GST"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount
              </label>
              <input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                name="additional_charge_type"
                value={formData.additional_charge_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select</option>
                <option value="handling">Handling Charge</option>
                <option value="packing">Packing Charge</option>
                <option value="delivery">Delivery Charge</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                name="additional_charge"
                value={formData.additional_charge}
                onChange={handleInputChange}
                placeholder="Additional charge"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total
              </label>
              <input
                type="text"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleInputChange}
                placeholder="Total"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Mode Of Payment & Services */}
        <div className="space-y-6">
          {/* Mode Of Payment */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
              Mode Of Payment
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Cash"
                  checked={formData.payment_mode === "Cash"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Cash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Card"
                  checked={formData.payment_mode === "Card"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Card</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Online"
                  checked={formData.payment_mode === "Online"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Online</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Cheque"
                  checked={formData.payment_mode === "Cheque"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Cheque</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Credit"
                  checked={formData.payment_mode === "Credit"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Credit</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment_mode"
                  value="Other"
                  checked={formData.payment_mode === "Other"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-slate-700">Other</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Paid Amount
                </label>
                <input
                  type="text"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Balance Amount
                </label>
                <input
                  type="text"
                  name="balance_amount"
                  value={formData.balance_amount}
                  readOnly
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
              Services
            </h3>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.name} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="service"
                    checked={formData.service_selected.includes(service.name)}
                    onChange={() => handleServiceToggle(service.name)}
                    className="w-4 h-4"
                  />
                  <div
                    className={`flex-1 px-4 py-2 rounded-md text-sm font-medium ${service.color}`}
                  >
                    {service.name}
                  </div>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-20 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSaveAndPrint}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save and Print"}
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
