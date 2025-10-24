import axios from "axios";

async function testAPI() {
  try {
    console.log("🧪 Testing Invoice API...\n");

    // Test 1: Search by invoice number
    console.log("Test 1: Searching for invoice inv_2025_002...");
    const response = await axios.get(
      "http://localhost:5000/api/invoices?invoice_number=inv_2025_002"
    );

    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testAPI();
