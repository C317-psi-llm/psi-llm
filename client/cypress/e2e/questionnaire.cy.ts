describe("Questionário (Check-in)", () => {
  it("completa o questionário e exibe agradecimento", () => {
    const user = {
      id_usuario: 5,
      nome: "Teste",
      email: "t@ex.com",
      papel: "funcionario",
    };

    const questionnaire = {
      id_questionario: 1,
      titulo: "Check teste",
      descricao: "Descrição teste",
      estrutura_json: {
        sections: [
          {
            title: "Seção 1",
            questions: [
              { id: "q1", text: "Pergunta 1?" },
              { id: "q2", text: "Pergunta 2?" },
            ],
          },
        ],
      },
    };

    // use wildcard suffix to match queries and base paths (e.g. /api/v1/questionnaires)
    cy.intercept("GET", "**/questionnaires*", {
      statusCode: 200,
      body: { success: true, data: [{ id_questionario: 1 }] },
    }).as("list");
    cy.intercept("GET", "**/questionnaires/1*", {
      statusCode: 200,
      body: { success: true, data: questionnaire },
    }).as("detail");
    cy.intercept("POST", "**/questionnaires/1/response*", {
      statusCode: 200,
      body: { success: true },
    }).as("submit");

    cy.loginAs(user, "/patient/questionario");

    // wait for the questionnaire API calls to complete
    cy.wait("@list");
    cy.wait("@detail");

    cy.contains("h2", "Pergunta 1?", { timeout: 5000 }).should("exist");
    cy.contains("button", "Muito alto").first().click();

    cy.contains("h2", "Pergunta 2?", { timeout: 5000 }).should("exist");
    cy.contains("button", "Muito alto").first().click();

    cy.wait("@submit", { timeout: 5000 });
    cy.contains("Obrigado por responder!", { timeout: 5000 }).should("exist");
  });
});
