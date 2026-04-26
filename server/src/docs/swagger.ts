const swaggerSpec = {
  openapi: "3.0.0",

  info: {
    title: "Mentis Tech - Backend API",
    version: "1.0.0",
    description:
      "API documentation for Mentis Tech MVP backend. Versioned at /api/v1.",
  },

  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development server",
    },
  ],

  /*
    ISSO FAZ O BOTÃO AUTHORIZE APARECER GLOBALMENTE
    e aplica Bearer Token por padrão em todas as rotas
  */
  security: [{ bearerAuth: [] }],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Cole aqui APENAS o JWT retornado no login. Exemplo: eyJhbGciOiJI...",
      },
    },
  },

  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "LGPD",
      description: "LGPD acceptance management",
    },
    {
      name: "Questionnaire",
      description: "Questionnaire operations",
    },
  ],

  paths: {
    /*
      LOGIN NÃO PRECISA TOKEN
      por isso usamos:
      security: []
    */
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email and password",
        description:
          "Authenticate user and receive access token + refresh token",

        security: [],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "admin@mentis.test",
                  },
                  password: {
                    type: "string",
                    example: "Passw0rd!",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Login successful",
          },
          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },

    /*
      REFRESH TAMBÉM NÃO PRECISA ACCESS TOKEN
    */
    "/api/v1/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",

        security: [],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: {
                    type: "string",
                    example: "uuid-refresh-token",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "New tokens generated",
          },
          "401": {
            description: "Invalid refresh token",
          },
        },
      },
    },

    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "Revoke refresh token",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["refreshToken"],
                properties: {
                  refreshToken: {
                    type: "string",
                    example: "uuid-refresh-token",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Logout successful",
          },
        },
      },
    },

    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",

        responses: {
          "200": {
            description: "Current user data",
          },
          "401": {
            description: "Missing or invalid token",
          },
        },
      },
    },

    "/api/v1/lgpd/status": {
      get: {
        tags: ["LGPD"],
        summary: "Check LGPD acceptance status",

        responses: {
          "200": {
            description: "Current LGPD status",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/api/v1/lgpd/accept": {
      post: {
        tags: ["LGPD"],
        summary: "Accept LGPD terms",

        responses: {
          "200": {
            description: "LGPD accepted successfully",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Already accepted",
          },
        },
      },
    },

    "/api/v1/questionnaires": {
      get: {
        tags: ["Questionnaire"],
        summary: "List active questionnaires",

        responses: {
          "200": {
            description: "List of questionnaires",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "LGPD required",
          },
        },
      },
    },

    "/api/v1/questionnaires/{id}": {
      get: {
        tags: ["Questionnaire"],
        summary: "Get questionnaire by ID",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],

        responses: {
          "200": {
            description: "Questionnaire found",
          },
          "404": {
            description: "Questionnaire not found",
          },
        },
      },
    },

    "/api/v1/questionnaires/{id}/response": {
      post: {
        tags: ["Questionnaire"],
        summary: "Submit questionnaire answers",
        description:
          "Only funcionario role can submit responses. Requires LGPD acceptance.",

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
            },
            example: 1,
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["responses"],
                properties: {
                  responses: {
                    type: "object",
                    description: "Dynamic JSON with questionId -> answer value",
                    example: {
                      q1: 2,
                      q2: 4,
                      q3: 1,
                    },
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "Response submitted successfully",
          },
          "400": {
            description: "Validation error",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Forbidden / LGPD missing",
          },
        },
      },
    },

    "/api/v1/questionnaires/responses/history": {
      get: {
        tags: ["Questionnaire"],
        summary: "Get questionnaire response history",

        responses: {
          "200": {
            description: "History loaded successfully",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};

export default swaggerSpec;
