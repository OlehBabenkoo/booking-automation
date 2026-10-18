import { test } from "../../utils/fixtures/index";

test.describe("Search", () => {
  test.skip();
  test('Test filling in "Destination" field', async ({ searchComponent, page }) => {
    await page.goto("/");

    await searchComponent.fillDestination("Lviv");
    await searchComponent.verifyDestinationValue("Lviv");
    const array = [1, 3, 4];
    array.pop();
  });
});
