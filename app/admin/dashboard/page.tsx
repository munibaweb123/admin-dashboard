'use client';

import ProtectedRoute from "@/app/components/protected";
import { client } from "@/sanity/lib/client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface Order {
  city: string;
  phone: string;
  orderNumber: string;
  customerName: string;
  email: string;
  orderDate: string;
  products: {
    product: Product;
    image: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "pending" | "dispatched" | "success" | "completed";
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
            orderNumber,
            customerName,
            email,
            city,
            phone,
            orderDate,
            products,
            totalPrice,
            status
        }`
      )
      .then((data) => setOrders(data))
      .catch(() => console.error("Error fetching orders"));
  }, []);

  const filterOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const handleDelete = async (orderNumber: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderNumber);
      setOrders((prevOrders) => prevOrders.filter((order) => order.orderNumber !== orderNumber));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch {
      Swal.fire("Error!", "There was an error deleting this order.", "error");
    }
  };

  const handleStatusChange = async (
    orderNumber: string,
    newStatus: "pending" | "dispatched" | "success" | "completed"
  ) => {
    try {
      await client.patch(orderNumber).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderNumber === orderNumber ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Success!", `Order status updated to ${newStatus}.`, "success");
    } catch {
      Swal.fire("Error!", "There was an error updating the order status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-red-600 p-4 text-white flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "dispatched", "success", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-red-700 font-bold" : "bg-red-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-center">Orders</h2>
          <div className="overflow-y-auto bg-white rounded-lg shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filterOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-red-100 transition-all">
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>
                      <select
                        value={order.status}
                        className="bg-gray-100 p-1 rounded-lg"
                        onChange={(e) =>
                          handleStatusChange(order.orderNumber, e.target.value as "pending" | "dispatched" | "success" | "completed")
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="success">Success</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(order.orderNumber)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
