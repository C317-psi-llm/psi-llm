describe("Cenários E2E adicionais", () => {
  it("exibe snackbar em falha de login", () => {
    cy.visit("/login");

    cy.intercept("POST", "**/auth/login", (req) => {
      req.reply({
        statusCode: 200,
        body: { success: false, message: "Credenciais inválidas" },
      });
    });

    cy.get('input[name="email"]').type("no@ex.com");
    cy.get('input[name="password"]').type("wrong");
    cy.contains("button", "Entrar").click();

    cy.get('[role="status"]')
      .should("be.visible")
      .and("contain.text", "Credenciais inválidas");
  });

  it("redireciona para termos quando LGPD nao aceito", () => {
    cy.visit("/login");

    cy.intercept("POST", "**/auth/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            accessToken: "fake-access",
            refreshToken: "fake-refresh",
            user: {
              id_usuario: 3,
              nome: "User",
              email: "u@ex.com",
              papel: "funcionario",
            },
          },
        },
      });
    });

    cy.intercept("GET", "**/lgpd/status", {
      statusCode: 200,
      body: { data: { aceitou_lgpd: false } },
    });

    cy.get('input[name="email"]').type("u@ex.com");
    cy.get('input[name="password"]').type("senha");
    cy.contains("button", "Entrar").click();

    cy.url().should("include", "/termos");
    cy.contains("Termos de Uso").should("exist");
  });

  it("paciente acessa check-in a partir do Home", () => {
    cy.visit("/login");

    cy.intercept("POST", "**/auth/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            accessToken: "fake-access",
            refreshToken: "fake-refresh",
            user: {
              id_usuario: 4,
              nome: "Paciente",
              email: "p@ex.com",
              papel: "funcionario",
            },
          },
        },
      });
    });

    cy.intercept("GET", "**/lgpd/status", {
      statusCode: 200,
      body: { data: { aceitou_lgpd: true } },
    });

    cy.get('input[name="email"]').type("p@ex.com");
    cy.get('input[name="password"]').type("senha");
    cy.contains("button", "Entrar").click();

    // wait for home header to appear
    cy.contains("Painel do paciente", { timeout: 5000 }).should("exist");

    // click the action card for "Fazer Check-in"
    cy.contains("h3", "Fazer Check-in").closest("a").click();

    cy.url().should("include", "/patient/questionario");
  });
});
