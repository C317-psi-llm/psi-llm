describe("Registro", () => {
  it("navega para login ao clicar Entrar", () => {
    cy.visit("/register");
    cy.contains("button", "Entrar").click();
    cy.url().should("include", "/login");
  });
});
