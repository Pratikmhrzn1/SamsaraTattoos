import swaggerJSDoc from "swagger-jsdoc";
import path, { format } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Samsara Tattoos API",
      version: "1.0.0",
      description: "API documentation for Samsara Backend",
      contact: {
        name: "Pratik Maharjan",
        email: "mhrznpratik11@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
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
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64a7f9c2e4b0d345fssdfsdf",
            },
            firstName: {
              type: "string",
              example: "Pratik",
            },
            lastName: {
              type: "string",
              example: "Maharjan",
            },
            email: {
              type: "string",
              format: "email",
              example: "pratik@gmail.com",
            },
            phoneNumber: {
              type: "string",
              minLength:8,
              example: "9812345678",
            },
            createdAt: {
              type: "string",
              example: "2025-03-24T10:00:00.000Z",
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["firstName", "email", "password", "phoneNumber"],
          properties: {
            firstName: {
              type: "string",
              example: "Pratik",
            },
            lastName: {
              type: "string",
              example: "Maharjan",
            },
            email: {
              type: "string",
              format:"email",
              example: "pratik@gmail.com",
            },
            password: {
              type: "string",
              minLength:6,
              example: "Pratik1234",
            },
            phoneNumber: {
              type: "string",
              example: "9812345678",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format:"email",
              example: "pratik@gmail.com",
            },
            password: {
              type: "string",
              minLength:6,
              example: "Pratik1234",
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            token: {
              type: "string",
              example: "jwt.token.here",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong",
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

    tags: [
      {
        name: "Auth",
        description: "Authentication APIs",
      },
      {
        name: "Users",
        description: "User management",
      },
    ],
  },

  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
