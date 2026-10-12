import { expect, Page, test } from "@playwright/test";
import { BaseComponent } from "./base.component";

export class SearchComponent extends BaseComponent {
  private readonly destinationInput = this.root.locator("#searchbox-horizontal-destination-input");

  constructor(page: Page) {
    super(page, "#SearchBoxDesktop");
  }

  public async fillDestination(value: string): Promise<void> {
    await test.step(`Fill in "Destination" input with "${value}" value`, async () => {
      await this.destinationInput.fill(value);
    });
  }

  public async verifyDestinationValue(value: string): Promise<void> {
    await test.step(`Verify "Destination" input has "${value}" value`, async () => {
      await expect(this.destinationInput).toHaveValue(value);
    });
  }
}
