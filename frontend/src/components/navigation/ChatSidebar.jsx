import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  Loader,
  Download,
  CheckCircle,
  X,
} from "lucide-react";
import { chatbotService } from "../../services/chatbotService";

// Typing animation component
const TypingIndicator = () => (
  <div className="flex space-x-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    ></div>
    <div
      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
  </div>
);

// Parse markdown-like formatting
const formatMessage = (text) => {
  if (!text) return text;

  const lines = text.split("\n");
  return lines.map((line, idx) => {
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />;
  });
};

export function ChatSidebar({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your AI Assistant. I can help you find your shipments. Enter either:\n\n• **Consignment Number** (e.g., 'CODIGIIX INFOTECH108')\n• **Customer ID** (e.g., '12345')\n\nI'll show you all matching bookings with download options!",
      sender: "assistant",
      type: "greeting",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [downloadedInvoices, setDownloadedInvoices] = useState(new Set());
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle invoice download
  const handleDownloadInvoice = async (
    messageId,
    invoiceFile,
    invoiceId,
    consignmentNo
  ) => {
    try {
      setDownloadingInvoiceId(messageId);
      const token = localStorage.getItem("token");

      const url = new URL(
        `http://localhost:5000/api/invoices/${invoiceId}/download`
      );
      if (consignmentNo) {
        url.searchParams.append("consignmentNo", consignmentNo);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Invoice download failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = invoiceFile || `invoice_${invoiceId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadedInvoices((prev) => new Set([...prev, messageId]));

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: messageIdRef.current++,
            text: `✅ **Download Complete!** Invoice for ${consignmentNo} downloaded successfully.`,
            sender: "assistant",
            type: "download_success",
          },
        ]);
      }, 500);
    } catch (error) {
      console.error("Download error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdRef.current++,
          text: `❌ **Download Failed** - Invoice not available for this consignment. Please contact support if you need help.`,
          sender: "assistant",
          type: "download_error",
        },
      ]);
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  // Handle message send
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      id: messageIdRef.current++,
      text: inputValue,
      sender: "user",
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const searchInput = inputValue.trim();

      const params = new URLSearchParams();
      if (/^\d+$/.test(searchInput)) {
        params.append("customerId", searchInput);
      } else {
        params.append("consignmentNo", searchInput);
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/search-with-invoices?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const result = await response.json();

      if (result.success && result.data.bookings.length > 0) {
        const assistantMessage = {
          id: messageIdRef.current++,
          sender: "assistant",
          type: "booking_table",
          bookings: result.data.bookings,
          text: `Found ${result.data.count} booking(s)`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: messageIdRef.current++,
            text: "No bookings found for the selected criteria.",
            sender: "assistant",
            type: "not_found",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messageIdRef.current++,
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sender: "assistant",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 max-w-[calc(100vw-20px)] bg-white shadow-2xl z-50 flex flex-col rounded-l-lg overflow-hidden transition-transform duration-300 transform translate-x-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 flex items-center justify-between flex-shrink-0 border-b border-blue-800">
          <div className="flex items-center gap-2">
            <MessageCircle size={22} />
            <div>
              <h3 className="font-semibold text-base">AI Assistant</h3>
              <p className="text-xs text-blue-100">Consignment Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1.5 transition"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.type === "booking_table" ? "max-w-full" : "max-w-xs"
                } px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* Booking table */}
                {message.type === "booking_table" && message.bookings && (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-sm mb-2">{message.text}</p>
                    <div className="overflow-x-auto bg-white text-gray-900 rounded">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-200 border-b">
                            <th className="px-2 py-1 text-left font-semibold text-xs">
                              Consignment
                            </th>
                            <th className="px-2 py-1 text-left font-semibold text-xs">
                              Destination
                            </th>
                            <th className="px-2 py-1 text-left font-semibold text-xs">
                              Weight
                            </th>
                            <th className="px-2 py-1 text-left font-semibold text-xs">
                              Mode
                            </th>
                            <th className="px-2 py-1 text-right font-semibold text-xs">
                              Amount
                            </th>
                            <th className="px-2 py-1 text-center font-semibold text-xs">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {message.bookings.map((booking, idx) => (
                            <tr
                              key={idx}
                              className="border-b hover:bg-gray-100"
                            >
                              <td className="px-2 py-1 font-medium text-xs">
                                {booking.consignment_number}
                              </td>
                              <td className="px-2 py-1 text-xs">
                                {booking.destination || "N/A"}
                              </td>
                              <td className="px-2 py-1 text-xs">
                                {booking.weight || "N/A"} kg
                              </td>
                              <td className="px-2 py-1 text-xs">
                                {booking.mode || "N/A"}
                              </td>
                              <td className="px-2 py-1 text-right text-xs">
                                ₹{booking.amount || 0}
                              </td>
                              <td className="px-2 py-1 text-center">
                                {booking.invoice_id ? (
                                  <button
                                    onClick={() =>
                                      handleDownloadInvoice(
                                        message.id,
                                        booking.invoice_number
                                          ? `${booking.invoice_number}.pdf`
                                          : `inv_${booking.invoice_id}.pdf`,
                                        booking.invoice_id,
                                        booking.consignment_number
                                      )
                                    }
                                    disabled={
                                      downloadingInvoiceId === message.id
                                    }
                                    className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                                  >
                                    {downloadingInvoiceId === message.id ? (
                                      <Loader
                                        size={12}
                                        className="inline animate-spin"
                                      />
                                    ) : (
                                      "DL"
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-xs">
                                    N/A
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Booking details card */}
                {message.booking && (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs opacity-75">Consignment</p>
                        <p className="font-semibold">
                          {message.booking.consignmentNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Status</p>
                        <p className="font-semibold uppercase">
                          {message.booking.status}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs opacity-75">From</p>
                      <p className="font-medium">
                        {message.booking.senderCity ||
                          message.booking.customerName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs opacity-75">To</p>
                      <p className="font-medium">
                        {message.booking.receiverCity ||
                          message.booking.receiverName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs opacity-75">Weight</p>
                        <p className="font-medium">
                          {message.booking.weight}kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Amount</p>
                        <p className="font-medium">
                          ₹
                          {message.booking.total ||
                            message.booking.totalAmount}
                        </p>
                      </div>
                    </div>

                    <div className="bg-opacity-20 bg-white p-2 rounded">
                      <p className="text-xs opacity-75">Payment Status</p>
                      <p className="font-medium">
                        {message.booking.paymentStatus}
                      </p>
                    </div>

                    {message.booking.invoiceFile &&
                      message.booking.invoiceId && (
                        <div className="flex gap-2 mt-3 pt-2 border-t border-opacity-30">
                          <button
                            onClick={() =>
                              handleDownloadInvoice(
                                message.id,
                                message.booking.invoiceFile,
                                message.booking.invoiceId,
                                message.booking.consignmentNo
                              )
                            }
                            disabled={
                              downloadingInvoiceId === message.id ||
                              downloadedInvoices.has(message.id)
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-opacity-90 rounded transition disabled:opacity-60 disabled:cursor-not-allowed hover:bg-opacity-100"
                            title="Download Invoice"
                          >
                            {downloadingInvoiceId === message.id ? (
                              <>
                                <Loader
                                  size={14}
                                  className="animate-spin"
                                />
                                Downloading...
                              </>
                            ) : downloadedInvoices.has(message.id) ? (
                              <>
                                <CheckCircle size={14} />
                                Downloaded
                              </>
                            ) : (
                              <>
                                <Download size={14} />
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                )}

                {/* Text message */}
                {!message.booking && message.type !== "booking_table" && (
                  <div className="text-sm">{formatMessage(message.text)}</div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter consignment or customer ID..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg transition flex items-center gap-1"
              title="Send message"
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}