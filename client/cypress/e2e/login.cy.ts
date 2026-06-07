describe("Fluxo de login e redirecionamento", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("faz login como funcionário e vai para /patient/home", () => {
    cy.intercept("POST", "**/auth/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            accessToken: "fake-access",
            refreshToken: "fake-refresh",
            user: {
              id_usuario: 1,
              nome: "Funcionario Teste",
              email: "func@ex.com",
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

    cy.get('input[name="email"]').type("func@ex.com");
    cy.get('input[name="password"]').type("senha123");
    cy.contains("button", "Entrar").click();

    cy.url().should("include", "/patient/home");
    cy.contains("Painel do paciente").should("exist");
  });

  it("faz login como psicólogo e vai para /psychologist/painel", () => {
    cy.intercept("POST", "**/auth/login", (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            accessToken: "fake-access",
            refreshToken: "fake-refresh",
            user: {
              id_usuario: 2,
              nome: "Psicologo Teste",
              email: "psic@ex.com",
              papel: "psicologo",
            },
          },
        },
      });
    });

    cy.intercept("GET", "**/lgpd/status", {
      statusCode: 200,
      body: { data: { aceitou_lgpd: true } },
    });

    cy.get('input[name="email"]').type("psic@ex.com");
    cy.get('input[name="password"]').type("senha123");
    cy.contains("button", "Entrar").click();

    // the app redirects psicologos to /psychologist/pacientes
    cy.url().should("include", "/psychologist/pacientes");
    cy.contains("Pacientes").should("exist");
  });
});
