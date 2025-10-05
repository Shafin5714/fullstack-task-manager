import path from "path";
import swaggerJsdoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const definition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "Task Manager API",
    version: "1.0.0",
    description:
      "REST API documentation for the Task Manager service, including authentication and task management endpoints.",
  },
  servers: [
    {
      url:
        process.env.API_BASE_URL ??
        `http://localhost:${process.env.PORT ?? 5000}`,
      description: "Primary server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication and session endpoints" },
    { name: "Users", description: "User administration endpoints" },
    { name: "Tasks", description: "Task lifecycle endpoints" },
    { name: "Health", description: "Service health and metadata" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation Error" },
          error: { type: "string" },
          errors: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "671c6e2f4f93f5f9203cbb9a" },
          name: { type: "string", example: "Jane Doe" },
          email: {
            type: "string",
            format: "email",
            example: "jane.doe@example.com",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: {
            type: "string",
            format: "email",
            example: "jane.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "Str0ngP@ssword",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jane.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "Str0ngP@ssword",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful." },
          token: { type: "string", example: "<jwt-token>" },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      Task: {
        type: "object",
        properties: {
          id: { type: "string", example: "671c72b34f93f5f9203cbbad" },
          title: { type: "string", example: "Prepare sprint demo" },
          description: {
            type: "string",
            example: "Gather screenshots and metrics for sprint review.",
          },
          status: {
            type: "string",
            enum: ["Pending", "In Progress", "Completed"],
            example: "Pending",
          },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"],
            example: "Medium",
          },
          dueDate: { type: "string", format: "date-time" },
          assignedUser: {
            $ref: "#/components/schemas/User",
          },
          createdBy: {
            $ref: "#/components/schemas/User",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          isOverdue: { type: "boolean" },
        },
      },
      TaskCreateRequest: {
        type: "object",
        required: ["title", "description", "assignedUser", "dueDate"],
        properties: {
          title: { type: "string", example: "Prepare sprint demo" },
          description: {
            type: "string",
            example: "Gather screenshots and metrics for sprint review.",
          },
          status: {
            type: "string",
            enum: ["Pending", "In Progress", "Completed"],
          },
          assignedUser: {
            type: "string",
            description: "User ID assigned to the task",
            example: "671c6e2f4f93f5f9203cbb9a",
          },
          dueDate: {
            type: "string",
            format: "date-time",
            example: "2025-10-12T12:00:00.000Z",
          },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"],
            example: "Medium",
          },
        },
      },
      TaskUpdateRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["Pending", "In Progress", "Completed"],
          },
          assignedUser: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
          priority: {
            type: "string",
            enum: ["Low", "Medium", "High"],
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: OAS3Options = {
  definition,
  apis: [
    path.resolve(__dirname, "../routes/**/*.{ts,js}"),
    path.resolve(__dirname, "../models/**/*.{ts,js}"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
