import Greeter from "mono-lib/greeter";

const app = document.getElementById("app");
const nameInput = document.getElementById("nameInput");
const greetButton = document.getElementById("greetButton");

if (
  !(app instanceof HTMLDivElement)
  || !(nameInput instanceof HTMLInputElement)
  || !(greetButton instanceof HTMLButtonElement)
) {
  throw new Error("Missing HTML elements");
}

greetButton.addEventListener("click", () => {
  const name = nameInput.value || "World";

  const greeter = new Greeter(name);
  const paragraph = document.createElement("p");
  paragraph.textContent = greeter.greet();

  app.appendChild(paragraph);
});
