// Custom Cypress commands
/* global Cypress */

Cypress.Commands.add(
  "loginAs",
  (
    user = {
      id_usuario: 1,
      nome: "Test",
      email: "test@example.com",
      papel: "funcionario",
    },
    path = "/",
  ) => {
    return cy.visit(path, {
      onBeforeLoad(win) {
        // store tokens as JSON strings because app reads them with JSON.parse
        win.localStorage.setItem("accessToken", JSON.stringify("fake-access"));
        win.localStorage.setItem(
          "refreshToken",
          JSON.stringify("fake-refresh"),
        );
        win.localStorage.setItem("user", JSON.stringify(user));
      },
    });
  },
);

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(user?: any, path?: string): Chainable<void>;
    }
  }
}
