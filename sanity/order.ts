import { ShoppingBasketIcon } from "lucide-react";
import { defineArrayMember, defineField } from "sanity";

export const orderType = {
  name: "order",
  title: "Order",
  type: "document",
  icon: ShoppingBasketIcon,
  fields: [
    // Basic Order Details
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripeCheckoutSessionId",
      title: "Stripe Checkout Session ID",
      type: "string",
    }),
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "email",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // Product Details (Nested Fields)
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object", // Define the object type here
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }], // Ensure 'product' type is defined elsewhere
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    // Additional Order Details
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Dispatched", value: "dispatched" },
          { title: "Success", value: "success" },
          { title: "Completed", value: "completed" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],

  // Preview Configuration for the entire document
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
    },
    prepare(value: Record<string, any>) {
      // Destructure the 'value' as per the expected object
      const { name, amount, currency, orderId } = value;

      // Create the order ID snippet for preview
      const orderIdSnippet = `${orderId.slice(0, 5)}...${orderId.slice(-5)}`;

      return {
        title: `${name} (${orderIdSnippet})`,
        subtitle: `${amount} ${currency}`,
        media: ShoppingBasketIcon, // Set media to the appropriate icon or image
      };
    },
  },
};
